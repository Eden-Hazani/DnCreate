import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors'

export class ListItemSeparator extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.separator} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 10
    },
    separator: {
        width: '70%',
        height: 1,
        backgroundColor: Colors.borderLight,
    }
})
