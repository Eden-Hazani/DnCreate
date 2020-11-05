import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppPathAddArmorToCharState {
    character: CharacterModel
}

export class AppPathAddArmorToChar extends Component<{ character: CharacterModel, armor: any, path: string, armorToLoad: any }, AppPathAddArmorToCharState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    addArmor = async () => {
        let armorName = this.props.armor.name;
        let armorAc = this.props.armor.ac;
        const armor: any = {
            id: armorName + Math.floor((Math.random() * 1000000) + 1),
            name: armorName,
            ac: armorAc,
            baseAc: armorAc,
            disadvantageStealth: this.props.armor.disadvantageStealth,
            armorType: this.props.armor.armorType,
            armorBonusesCalculationType: this.props.armor.armorCalculationType,
            removable: false
        }
        this.props.armorToLoad(armor)
    }
    componentDidMount() {
        this.addArmor()
    }
    componentWillUnmount() {
        this.props.armorToLoad(null)
    }
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <AppText fontSize={20} textAlign={'center'}>As a level {this.props.character.level} {this.props.character.characterClass} {this.props.path} you gain the following armor.</AppText>
                    <AppText fontSize={18} textAlign={'center'}>{this.props.armor.name} with {this.props.armor.ac} AC</AppText>
                    <AppText fontSize={18} textAlign={'center'}>it is now available in the armor tab and you can equip it from there.</AppText>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});