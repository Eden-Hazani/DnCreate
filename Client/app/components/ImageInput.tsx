import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { AppButton } from './AppButton';
import colors from '../config/colors';
import { IconGen } from './IconGen';


export function ImageInput({ imageUri, onChangeImage }: any) {
    useEffect(() => {
        requestPermission();
    }, [])

    const requestPermission = async () => {
        const result = await ImagePicker.requestCameraRollPermissionsAsync();
        if (!result.granted) {
            alert("Must enable permissions")
        }
    }
    const handelPress = () => {
        if (!imageUri) selectImg();
        else {
            Alert.alert("Delete", "Remove profile image?", [{ text: 'Yes', onPress: () => onChangeImage(null) }, { text: 'No' }])
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
            console.log(err.message)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => handelPress()}>
            <View style={styles.container}>
                {!imageUri && <IconGen name={"camera"} size={100} backgroundColor={colors.lightGray} iconColor={colors.white} />}
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