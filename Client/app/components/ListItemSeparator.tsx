import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors'

export class ListItemSeparator extends Component<any>{
    render() {
        return (
            <View style={styles.container}>
                {this.props.thick ?
                    <View style={styles.thickSeparator} />

                    :
                    <View style={styles.separator} />

                }
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
    },
    thickSeparator: {
        width: '70%',
        height: 1.5,
        backgroundColor: Colors.borderLight,
    }
})
