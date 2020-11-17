import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

export class AppPathUnrestrictedMagic extends Component<{ character: CharacterModel, magicNumber: number, loadUnrestrictedMagic: any }> {
    componentDidMount() {
        this.props.loadUnrestrictedMagic(this.props.magicNumber)
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={18} textAlign={'center'}>You have {this.props.magicNumber} new spells that you can learn from any class!</AppText>
                <AppText fontSize={18} textAlign={'center'}>You can pick your new spells from the spell book after you finish leveling up</AppText>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.pinkishSilver,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 15,
        padding: 15,
        margin: 5
    }
});