import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import spellLists from '../../jsonDump/PathSpellAdditionLists.json'
import spellsJSON from '../../jsonDump/spells.json'
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { setTotalKnownSpells } from '../screens/charOptions/helperFunctions/setTotalKnownSpells';
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { AppText } from './AppText';

interface AppPathFirstLevelSpellsAdditionState {
    character: CharacterModel
    domainMagic: any[]
}

export class AppPathFirstLevelSpellsAddition extends Component<{ noCountAgainstKnown: any, returnMagic: any, path: any, character: CharacterModel }, AppPathFirstLevelSpellsAdditionState>{
    constructor(props: any) {
        super(props)
        this.state = {
            domainMagic: [],
            character: this.props.character
        }
    }


    componentDidMount() {
        try {
            const character = { ...this.state.character }
            const domainMagic = spellLists[this.props.character.characterClass][this.props.path][this.props.character.level].spellList;
            for (let item of domainMagic) {
                const spell = spellsJSON.find(spell => spell.name === item)
                if (spell && character.spells) {
                    const spellLevel = spellLevelChanger(spell.level)
                    if (this.props.noCountAgainstKnown && spellLevel !== "cantrip") {
                        if (!character.spellsKnown) {
                            const spellsKnown = setTotalKnownSpells(this.props.character);
                            character.spellsKnown = spellsKnown;
                        }
                        character.spellsKnown = (parseInt(character.spellsKnown) + 1).toString()
                    }
                    character.spells[spellLevel].push({ spell: spell, removable: false });
                }
            }
            this.setState({ character, domainMagic }, () => {
                this.props.returnMagic(this.state.character)
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={22} textAlign={'center'}>You will gain the following spells </AppText>
                {this.state.domainMagic.map((magic, index: number) =>
                    <View key={`${magic}${index}`} style={{ justifyContent: "center", alignItems: "center" }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={18}>{magic}</AppText>
                    </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});