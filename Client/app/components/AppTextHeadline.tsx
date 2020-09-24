import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Font from 'expo-font';


export class AppTextHeadline extends Component {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <Text style={styles.text}>{this.props.children}</Text>
        )
    }
}


const styles = StyleSheet.create({
    text: {
        fontSize: 30,
        textAlign: "center",
        fontFamily: "KumbhSans-Light"
    },
});

