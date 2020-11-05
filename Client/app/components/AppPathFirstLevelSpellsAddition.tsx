import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import spellLists from '../../jsonDump/PathSpellAdditionLists.json'
import spellsJSON from '../../jsonDump/spells.json'
import colors from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { AppText } from './AppText';

interface AppPathFirstLevelSpellsAdditionState {
    character: CharacterModel
    domainMagic: any[]
}

export class AppPathFirstLevelSpellsAddition extends Component<{ returnMagic: any, path: any, character: CharacterModel }, AppPathFirstLevelSpellsAdditionState>{
    constructor(props: any) {
        super(props)
        this.state = {
            domainMagic: [],
            character: this.props.character
        }
    }


    componentDidMount() {
        const character = { ...this.state.character }
        const domainMagic = spellLists[this.props.character.characterClass][this.props.path][this.props.character.level].spellList;
        for (let item of domainMagic) {
            const spell = spellsJSON.find(spell => spell.name === item)
            const spellLevel = spellLevelChanger(spell.level)
            character.spells[spellLevel].push({ spell: spell, removable: false });
        }
        this.setState({ character, domainMagic }, () => {
            this.props.returnMagic(this.state.character)
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={22} textAlign={'center'}>You will gain the following spells </AppText>
                {this.state.domainMagic.map((magic, index: number) =>
                    <View key={`${magic}${index}`} style={{ justifyContent: "center", alignItems: "center" }}>
                        <AppText color={colors.bitterSweetRed} fontSize={18}>{magic}</AppText>
                    </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});