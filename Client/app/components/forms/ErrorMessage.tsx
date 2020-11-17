import React, { Component } from 'react';
import { AppText } from '../AppText';
import { Colors } from '../../config/colors';
import { View, StyleSheet, Dimensions } from 'react-native';
import { IconGen } from '../IconGen';

export class ErrorMessage extends Component<any>{
    render() {
        if (!this.props.error || !this.props.visible) return null
        return (
            <View style={styles.container}>
                <IconGen name={"exclamation"} size={60} backgroundColor={'none'} iconColor={Colors.danger} />
                <AppText color={Colors.danger}>{this.props.error}</AppText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 55,
        left: Dimensions.get('window').width * .01,
        right: Dimensions.get('window').width * .1,
    }
})