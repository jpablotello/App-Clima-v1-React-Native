import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Formulario from './components/Formulario';
import Clima from './components/Clima';
import ClimaGeo from './components/ClimaGeo';
import AsyncStorage from '@react-native-community/async-storage';

const App = () => {

  
  
  const [ busqueda, setBusqueda] = useState({
    pais:'',
    ciudad: ''
  });

  const [cargando, setCargando ] = useState(true);


  const [ ubicacion, setUbicacion ] = useState({});

  const { ciudad, pais } = busqueda;
  
  const [consultar, setConsultar] = useState(false)
  const [resultadoClima, setResultadoClima] = useState({});
  const [bgColor, setBgColor] = useState('rgb(71,149,212)');
  
  useEffect(() => {
    const consultarClima = async () => {

      console.log('Test', busqueda)
      if(consultar){
        const keyWeather = 'f7ca4e0d6b854b6b6a4e3178ff84729c';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad.trim()},${pais}&appid=${keyWeather}`

        try {
          const respuesta = await fetch(url);
          const resultado = await respuesta.json();
          console.log('Resultado : ',resultado);
          setResultadoClima(resultado);
          setConsultar(false);

          //Modifica color de fondo

          const kelvin = 273.15;

          const {main} = resultado;
          const actual = main.temp - kelvin
          if(actual < 10) {
            setBgColor('rgb(105,108,149)');

          } else if(actual < 30){
            setBgColor('rgb(71,149,212)');

          } else {
            setBgColor('rgb(178,28,61)');

          }

          guardarUbicacionStorage();
        } catch (error) {
          mostrarAlerta();
        }
      }

    }

    consultarClima();
  },[consultar])

  useEffect(() => {

    Geolocation.getCurrentPosition(
      info => {
        console.log(info)
        const {coords} = info;
        setUbicacion({lat: coords.latitude, long: coords.longitude, timestamp: coords.timestamp});
      },
      (error) => {
        console.log(error)
        setUbicacion({});
      },
      {enableHighAccuracy: false, timeout: 2000, maximumAge: 1000}
    );
  },[])

  useEffect(() => {
    const getCiudad = async () => { 
      const apiKey = 'd7bd8a24a404cc';
      //const apiKey = 'pk.867d15500d93de6a54363e8e7f6b0bc0';
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${ubicacion.lat}&lon=${ubicacion.long}&format=json`;
      console.log({url});
      try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        console.log('Ciudad OK : ',resultado);
        setBusqueda({ciudad: resultado.address.city, pais: resultado.address.country_code.toUpperCase()});
        setConsultar(true);
      } catch (error) {
        console.log('Error Ciudad : ',error);
        
      }
    }
    if(ubicacion)
    {
      getCiudad();
    }
  },[ubicacion])

  const bgColorApp = {
    backgroundColor: bgColor
  }

  const guardarUbicacionStorage = async () => {
    try {
      
      await AsyncStorage.setItem('busqueda',JSON.stringify(busqueda));
      const data = await AsyncStorage.getItem('busqueda');
      console.log('Leido del Storage : ',JSON.parse(data));
    } catch (error) {
      console.log('No se pudo guardar en Storage : ', error)
    }
  }

  const mostrarAlerta = () => {
    Alert.alert(
      'Error',
      'No hay resultados, intente con otra ciudad',
      [{text: 'Aceptar'}]
    )
  };

  const ocultarTeclado = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1}}>
    
        <TouchableWithoutFeedback onPress={() => ocultarTeclado()}>
          <View style={[styles.app,bgColorApp]}>
            <View style={styles.contenido}>
              <Clima 
                resultado={resultadoClima}
                />
              <Formulario 
                busqueda={busqueda}
                setConsultar={setConsultar}
                setBusqueda={setBusqueda}
                
                />
              <ClimaGeo
              />
              <Text>
                {'Latitud : ' + ubicacion.lat + ' - Longitud : ' + ubicacion.long} 
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    paddingTop: 25,
//    backgroundColor: {bgColor},
    //justifyContent: 'center'
  },
  contenido: {
    marginHorizontal: '2.5%'
  }
});

export default App;
