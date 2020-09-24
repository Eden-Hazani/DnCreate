import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IconGen } from './IconGen';

export function listItemDelete({ onPress }: any) {
    return (
        <TouchableWithoutFeedback onPress={onPress} style={{ flex: 1 }}>
            <View style={styles.container}>
                <IconGen size={50} backgroundColor={colors.danger} name={"trash-can"} iconColor={colors.white} />
            </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container: {
        marginRight: 5,
        flex: .75,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end"
    }
})

export default listItemDelete;