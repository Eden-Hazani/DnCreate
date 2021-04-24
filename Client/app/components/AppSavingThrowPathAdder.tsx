import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Unsubscribe } from 'redux';
import { generateSkillPickPathCondition } from '../classFeatures/generateSkillPickPathCondition';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppText } from './AppText';
import jsonSkills from '../../jsonDump/skillList.json'
import { generateSavingThrowsPathConditions } from '../classFeatures/generateSavingThrowsPathConditions';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSavingThrowPathAdderState {
    savingThrowsClicked: boolean[]
    savingThrows: any[]
    amountToPick: number
    savingThrowsConfirmation: boolean
    character: CharacterModel
    alreadyPickedSavingThrows: boolean[]
    savingThrowsWasPickedByPath: any[]
}

export class AppSavingThrowPathAdder extends Component<{
    returnSavingThrows: any
    character: CharacterModel, withConditions: boolean, extraSavingThrowsTotal: any, pathChosen: any
    amount: number, itemList: any, setAdditionalSaveThrowPicks: any
}, AppSavingThrowPathAdderState> {
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyPickedSavingThrows: [],
            savingThrowsConfirmation: false,
            savingThrows: [],
            amountToPick: this.props.amount,
            savingThrowsClicked: [],
            character: store.getState().character,
            savingThrowsWasPickedByPath: []
        }
    }

    componentDidMount() {
        const alreadyPickedSavingThrows = this.state.alreadyPickedSavingThrows;
        if (this.props.withConditions && this.state.character.savingThrows) {
            for (let item of this.state.character.savingThrows) {
                if (this.props.itemList.includes(item)) {
                    const alreadyPickedSavingThrows = this.state.alreadyPickedSavingThrows;
                    alreadyPickedSavingThrows[this.props.itemList.indexOf(item)] = true;
                }
            }
            this.setState({ alreadyPickedSavingThrows }, () => {
                const { extraSavingThrowsToPick, pickedSkillFromStart } = generateSavingThrowsPathConditions(this.state.character, this.props.itemList, this.props.pathChosen, this.props.extraSavingThrowsTotal)
                if (pickedSkillFromStart !== "") {
                    let savingThrowsWasPickedByPath = this.state.savingThrowsWasPickedByPath
                    savingThrowsWasPickedByPath.push(pickedSkillFromStart)
                    this.setState({ savingThrowsWasPickedByPath }, () => {
                        for (let item of this.state.savingThrowsWasPickedByPath) {
                            if (this.props.itemList.includes(item)) {
                                const alreadyPickedSavingThrows = this.state.alreadyPickedSavingThrows;
                                alreadyPickedSavingThrows[this.props.itemList.indexOf(item)] = true;
                            }
                        }
                        this.pickSaveThrow(pickedSkillFromStart, -1)
                        this.setState({ amountToPick: extraSavingThrowsToPick })

                    })
                } else {
                    this.setState({ amountToPick: extraSavingThrowsToPick })
                }
            })
            this.props.setAdditionalSaveThrowPicks(this.state.amountToPick)
            return
        }
        if (this.state.character.savingThrows) {
            for (let item of this.state.character.savingThrows) {
                if (this.props.itemList.includes(item)) {
                    const alreadyPickedSavingThrows = this.state.alreadyPickedSavingThrows;
                    alreadyPickedSavingThrows[this.props.itemList.indexOf(item)] = true;
                }
            }
        }
        this.props.setAdditionalSaveThrowPicks(this.state.amountToPick)
    }
    componentWillUnmount() {
        this.props.setAdditionalSaveThrowPicks(0)
    }
    componentDidUpdate() {
        if ((this.state.savingThrows.length === this.state.amountToPick && !this.state.savingThrowsConfirmation) || (this.state.amountToPick === 0 && !this.state.savingThrowsConfirmation)) {
            this.setState({ savingThrowsConfirmation: true })
            this.saveSavingThrow()
            this.props.setAdditionalSaveThrowPicks(0)
        }
    }

    saveSavingThrow = async () => {
        this.props.returnSavingThrows(this.state.savingThrows)
        await AsyncStorage.setItem(`${this.state.character._id}SavingThrows`, JSON.stringify(this.state.savingThrows));
    }


    pickSaveThrow = (saveThrow: any, index: number) => {
        let savingThrows = this.state.savingThrows;
        if (!this.state.savingThrowsClicked[index]) {
            if (this.state.savingThrows.length >= this.state.amountToPick) {
                this.state.amountToPick === 0 && alert(`You have zero saving throws to pick from (a skill might have been auto picked by your path).`)
                this.state.amountToPick > 0 && alert(`You can only pick ${this.state.amountToPick} saving throws.`)
                return;
            }
            const savingThrowsClicked = this.state.savingThrowsClicked;
            savingThrowsClicked[index] = true;
            savingThrows.push(saveThrow)
            this.setState({ savingThrows, savingThrowsClicked })
        }
        else if (this.state.savingThrowsClicked[index]) {
            savingThrows = savingThrows.filter(val => val !== saveThrow);
            const savingThrowsClicked = this.state.savingThrowsClicked;
            savingThrowsClicked[index] = false;
            this.setState({ savingThrows, savingThrowsClicked })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.itemList.map((skill: any, index: number) =>
                    <TouchableOpacity disabled={this.state.alreadyPickedSavingThrows[index]} key={`${skill}${index}`} onPress={() => this.pickSaveThrow(skill, index)}
                        style={[styles.item, { backgroundColor: this.state.alreadyPickedSavingThrows[index] ? Colors.berries : this.state.savingThrowsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                        <AppText textAlign={'center'}>{skill}</AppText>
                    </TouchableOpacity>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        justifyContent: "center"
    },
    item: {
        borderRadius: 15,
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.berries
    }
});