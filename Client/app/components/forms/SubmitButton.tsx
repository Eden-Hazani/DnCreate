import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../AppText';
import { useFormikContext } from 'formik';
import colors from '../../config/colors';


/**
 * 
 * @param  title: string 
 *   
 */

export function SubmitButton({ ...props }: any) {
    const { handleSubmit } = useFormikContext();
    return (
        <TouchableOpacity activeOpacity={.8} style={styles.container} onPress={() => handleSubmit()}>
            <View style={[styles.button, { width: props.width ? props.width : 100 }]}>
                <AppText fontSize={20} padding={5} color={'white'}>{props.title}</AppText>
            </View>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        elevation: 10,
        alignItems: "center",
        justifyContent: "center",
        height: 100,
        borderRadius: 100,
        backgroundColor: colors.bitterSweetRed
    }
})