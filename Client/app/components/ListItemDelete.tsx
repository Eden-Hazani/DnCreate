import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { IconGen } from './IconGen';

export function ListItemDelete({ onPress }: any) {
    return (
        <TouchableWithoutFeedback onPress={onPress} style={{ flex: 1 }}>
            <View style={styles.container}>
                <IconGen size={50} backgroundColor={Colors.danger} name={"trash-can"} iconColor={Colors.white} />
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

export default ListItemDelete;