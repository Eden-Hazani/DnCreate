import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { AppButton } from './AppButton';
import { Colors } from '../config/colors';
import { IconGen } from './IconGen';
import logger from '../../utility/logger';


export function ImageInput({ imageUri, onChangeImage, idDisabled }: any) {
    useEffect(() => {
        // requestPermission();
    }, [])
    const [allowed, setAllowed] = useState(true);

    const requestPermission = async () => {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (result.granted) {
            setAllowed(true)
        }
        if (!result.granted) {
            alert("Must enable permissions");
            setAllowed(false)
        }
    }
    const handelPress = async () => {
        if (!allowed) {
            requestPermission()
            alert("Must enable permissions");
            return;
        }
        if (!imageUri) selectImg();
        else {
            Alert.alert("Replace", "Remove currently picked image?", [{ text: 'Yes', onPress: () => onChangeImage(null) }, { text: 'No' }])
        }
    }

    const selectImg = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5
            });
            if (result.cancelled === false) onChangeImage(result.uri);
        } catch (err) {
            logger.log(err)
        }
    }

    return (
        <TouchableWithoutFeedback disabled={idDisabled} onPress={() => handelPress()}>
            <View style={styles.container}>
                {!imageUri && <IconGen name={"camera"} size={100} backgroundColor={Colors.lightGray} iconColor={Colors.white} />}
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>
        </TouchableWithoutFeedback>
    )

}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    image: {
        marginBottom: 5,
        height: 100,
        width: 100,
        borderRadius: 50,
    }
});