import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';
import spellsJSON from '../../jsonDump/spells.json'
import { spellLevelChanger } from '../screens/charOptions/helperFunctions/SpellLevelChanger';
import { store } from '../redux/store';
import { Colors } from '../config/colors';
import logger from '../../utility/logger';


interface AppAddSpellChoiceState {
    pickedSpellList: any[],
    character: CharacterModel
    alreadyHaveSpell: boolean
    spellClicked: boolean[]
}

export class AppAddSpellChoice extends Component<{
    character: CharacterModel, updateSpellList: any, spellListWithLimiter: any,
}, AppAddSpellChoiceState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickedSpellList: [],
            alreadyHaveSpell: false,
            character: store.getState().character,
            spellClicked: []
        }
    }
    componentDidMount() {
        try {
            this.props.updateSpellList({ spells: 0, limit: this.props.spellListWithLimiter.limit })
        } catch (err) {
            logger.log(err)
        }
    }

    pickSpells = (spell: any, index: number) => {
        try {
            let pickedSpellList = this.state.pickedSpellList;
            if (!this.state.spellClicked[index]) {
                if (this.state.pickedSpellList.length >= this.props.spellListWithLimiter.limit) {
                    alert(`You can only pick ${this.props.spellListWithLimiter.limit} spells.`)
                    return;
                }
                const spellClicked = this.state.spellClicked;
                spellClicked[index] = true;
                pickedSpellList.push(spell)
                this.setState({ pickedSpellList, spellClicked }, () => {
                    this.sendSpells()
                })
            }
            else if (this.state.spellClicked[index]) {
                pickedSpellList = pickedSpellList.filter(val => val !== spell);
                const spellClicked = this.state.spellClicked;
                spellClicked[index] = false;
                this.setState({ pickedSpellList, spellClicked }, () => {
                    this.sendSpells()
                })
            }
        } catch (err) {
            logger.log(err)
        }
    }

    sendSpells = () => {
        try {
            this.props.updateSpellList({ spells: this.state.pickedSpellList, limit: this.props.spellListWithLimiter.limit })
        } catch (err) {
            logger.log(err)
        }
    }

    render() {
        return (
            <View>
                <View>
                    {this.props.spellListWithLimiter.spells.map((spell: any, index: number) =>
                        <TouchableOpacity key={`${spell}${index}`} onPress={() => this.pickSpells(spell, index)}
                            style={[styles.item, { backgroundColor: this.state.spellClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText textAlign={'center'}>{spell}</AppText>
                        </TouchableOpacity>)}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    item: {
        borderRadius: 15,
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.berries
    }
});