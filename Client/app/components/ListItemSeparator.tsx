import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors'

export class ListItemSeparator extends Component<any>{
    render() {
        return (
            <View style={styles.container}>
                {this.props.thick ?
                    <View style={[styles.thickSeparator, { backgroundColor: Colors.borderLight }]} />

                    :
                    <View style={[styles.separator, { backgroundColor: Colors.borderLight }]} />

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
    },
    thickSeparator: {
        width: '70%',
        height: 1.5,
    }
})
