import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IconGen } from './IconGen';

export function ListItemDecreaseIncrease({ onPressDecrease, onPressIncrease }: any) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
            <TouchableWithoutFeedback onPress={onPressIncrease} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <IconGen size={50} backgroundColor={colors.shadowBlue} name={"plus"} iconColor={colors.white} />
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onPressDecrease} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <IconGen size={50} backgroundColor={colors.orange} name={"minus"} iconColor={colors.white} />
                </View>
            </TouchableWithoutFeedback>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 5,
        flex: 1,
        justifyContent: "center",
    }
})

export default ListItemDecreaseIncrease;