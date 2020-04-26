import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Formulario from './components/Formulario';
import Clima from './components/Clima';

const App = () => {

  
  
  const [ busqueda, setBusqueda] = useState({
    pais:'',
    ciudad: ''
  });

  const { ciudad, pais } = busqueda;
  
  const [consultar, setConsultar] = useState(false)
  const [resultadoClima, setResultadoClima] = useState({});
  const [bgColor, setBgColor] = useState('rgb(105,108,149)');
  
  useEffect(() => {
    const consultarClima = async () => {
      if(consultar){
        console.log('Test', consultar)
        const keyWeather = 'f7ca4e0d6b854b6b6a4e3178ff84729c';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${keyWeather}`

        try {
          const respuesta = await fetch(url);
          const resultado = await respuesta.json();
          setResultadoClima(resultado);
          setConsultar(false);

          //Modifica color de fondo

          const kelvin = 273.15;

          const {main} = resultado;
          const actual = main.temp - kelvin
          if(actual < 10) {
            console.log('frio : ',actual);
            setBgColor('rgb(105,108,149)');

          } else if(actual < 25){
            console.log('normal : ',actual);
            setBgColor('rgb(71,149,212)');

          } else {
            console.log('calor : ',actual);
            setBgColor('rgb(178,28,61)');

          }


        } catch (error) {
          mostrarAlerta();
        }
      }

    }

    consultarClima();
  },[consultar])

  const bgColorApp = {
    backgroundColor: bgColor
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
    <>
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
//    backgroundColor: {bgColor},
    justifyContent: 'center'
  },
  contenido: {
    marginHorizontal: '2.5%'
  }
});

export default App;
