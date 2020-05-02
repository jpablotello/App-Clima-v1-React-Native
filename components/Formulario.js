import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Animated, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker';

const Formulario = ({busqueda, setBusqueda, setConsultar}) => {

    const {pais, ciudad} = busqueda;

    const [ animacionboton ] = useState(new Animated.Value(1));

    const animacionEntrada = () => {
        Animated.spring( animacionboton , {
            toValue: .75,
            useNativeDriver: true
        }).start();
    };

    const animacionSalida = () => {
        Animated.spring( animacionboton , {
            useNativeDriver: true,
            toValue: 1,
            friction: 4,
            tension: 30
        }).start();
    };

    const consultarClima = () => {
        if(pais.trim() === '' || ciudad.trim() === ''){
            mostrarError();
            setConsultar(false);
            console.log('Consultar clima false')
            return;
        }

        setConsultar(true);

    };

    const mostrarError = () => {
        Alert.alert(
            'Error',
            'Agrega una ciudad y país para la búsqueda',
            [{ text: 'Aceptar'}]
        );
    }

    const estiloAnimacion = {
        transform: [{ scale: animacionboton }]
    }

    return (
        <>
            <View style={styles.formulario}>
                <View>
                    <TextInput
                        value={ciudad}
                        style={styles.input}
                        onChangeText={ ciudad => setBusqueda({...busqueda, ciudad})}
                        placeholder="Ingrese Ciudad"
                        placeholderTextColor='#666'
                    />
                </View>
                <View>
                    <Picker
                        selectedValue={pais}
                        itemStyle={{height: 120, backgroundColor: '#61AFEE'}}
                        onValueChange={ pais => setBusqueda({ ...busqueda, pais})}
                    >
                        <Picker.Item label="-- Sleccione un país --" value=""/>
                        <Picker.Item label="Argentina" value="AR"/>
                        <Picker.Item label="Colombia" value="CO"/>
                        <Picker.Item label="España" value="ES"/>
                        <Picker.Item label="Estados Unidos" value="US"/>
                        <Picker.Item label="Italia" value="IT"/>
                        <Picker.Item label="México" value="MX"/>
                        <Picker.Item label="Paraguay" value="PY"/>
                        <Picker.Item label="Perú" value="PE"/>
                    </Picker>
                </View>
                <TouchableWithoutFeedback
                    onPressIn={() => animacionEntrada()}
                    onPressOut={() => animacionSalida()}
                    onPress={() => consultarClima()}
                >
                    <Animated.View
                        style={[styles.btnBuscar, estiloAnimacion]}
                    >
                        <Text style={styles.txtBuscar}>Buscar Clima</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    formulario: {
//        marginTop: 100,
    },
    input: {
        padding: 10,
        height: 50,
        backgroundColor: '#FFF',
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center'
    },
    btnBuscar: {
        marginTop: 50,
        backgroundColor: '#000',
        padding: 10,
        justifyContent: 'center'
    },
    txtBuscar: {
        color: '#FFF',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        fontSize: 18
    }
})

export default Formulario

