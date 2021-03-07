import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import { addMagicToChar } from '../screens/charOptions/helperFunctions/AddMagicToChar';
import { AppText } from './AppText';

export class AppAddMagicToNonMagic extends Component<{ path: any, character: CharacterModel, loadMagicalAbilities: any, pathType: string }>{
    componentDidMount() {
        try {
            this.props.loadMagicalAbilities(addMagicToChar(this.props.character, this.props.pathType, this.props.path))
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.props.pathType === 'Eldritch Knight' &&
                    <View>
                        <AppText textAlign={'center'} fontSize={22} color={Colors.berries}>As a level {this.props.character.level} {this.props.pathType} you gain the following magic</AppText>
                        <AppText textAlign={'center'} fontSize={18}>{this.props.pathType}s use magical techniques similar to those practiced by wizards. and so your spellcasting ability is Intelligence.</AppText>
                        <AppText textAlign={'center'} fontSize={18}>You learn two cantrips of your choice from the wizard spell list and you have 3 known spells.</AppText>
                        <AppText textAlign={'center'} fontSize={18}>At this level you have 2 spell slots for 1st level spell casting (this will increase as you level up).</AppText>
                    </View>
                }
                {this.props.pathType === 'Arcane Trickster' &&
                    <View>
                        <AppText textAlign={'center'} fontSize={22} color={Colors.berries}>As a level {this.props.character.level} {this.props.pathType} you gain the following magic</AppText>
                        <AppText textAlign={'center'} fontSize={18}>{this.props.pathType}s use magical techniques similar to those practiced by wizards. and so your spellcasting ability is Intelligence.</AppText>
                        <AppText textAlign={'center'} fontSize={18}>You learn two cantrips of your choice from the wizard spell list and the cantrip Mage Hand is automatically added to your known cantrips.</AppText>
                        <AppText textAlign={'center'} fontSize={18}>At this level you have 2 spell slots for 1st level spell casting (this will increase as you level up) and a total of 3 known spells.</AppText>
                    </View>
                }{
                    this.props.pathType === 'Custom' &&
                    <View>
                        <AppText textAlign={'center'} fontSize={18}>This path provides you with magical techniques similar to those practiced by {this.props.path.levelUpChart[this.props.character.level as any][1].spellCastingClass}s.</AppText>
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.pinkishSilver,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.berries,
        margin: 15,
        padding: 15,
        justifyContent: "center",
        alignItems: "center"
    }
});