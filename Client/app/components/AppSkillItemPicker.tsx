import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Unsubscribe } from 'redux';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppText } from './AppText';

interface AppSkillItemPickerState {
    skillsClicked: boolean[]
    skills: any[]
    amountToPick: number
    skillConfirmation: boolean
    character: CharacterModel
}

export class AppSkillItemPicker extends Component<{
    character: CharacterModel
    amount: number, itemList: any, setAdditionalSkillPicks: any, sendSkillsBack: any, resetExpertiseSkills: any, skillsStartAsExpertise: any
}, AppSkillItemPickerState> {
    constructor(props: any) {
        super(props)
        this.state = {
            skillConfirmation: false,
            skills: [],
            amountToPick: this.props.amount,
            skillsClicked: [],
            character: store.getState().character
        }
    }

    componentDidMount() {
        this.props.setAdditionalSkillPicks(true)
    }
    componentWillUnmount() {
        this.props.setAdditionalSkillPicks(false)
    }
    componentDidUpdate() {
        if (this.state.skills.length === this.state.amountToPick && !this.state.skillConfirmation) {
            this.setState({ skillConfirmation: true })
            this.props.sendSkillsBack(this.state.skills)
            this.props.setAdditionalSkillPicks(false)
        }
    }

    pickSkill = (skill: any, index: number) => {
        const character = store.getState().character;
        let skills = this.state.skills;
        if (!this.state.skillsClicked[index]) {
            for (let item of this.state.character.skills) {
                if (item[0] === skill) {
                    alert(`You are already proficient with this skill`)
                    return;
                }
            }
            if (this.state.skills.length >= this.state.amountToPick) {
                alert(`You can only pick ${this.state.amountToPick} skills.`)
                return;
            }
            const skillsClicked = this.state.skillsClicked;
            skillsClicked[index] = true;
            skills.push(skill)
            this.props.skillsStartAsExpertise ? character.skills.push([skill, 2]) : character.skills.push([skill, 0])
            this.setState({ skills, skillsClicked, character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            })
        }
        else if (this.state.skillsClicked[index]) {
            this.props.resetExpertiseSkills(skill)
            skills = skills.filter(val => val !== skill);
            character.skills = character.skills.filter(val => val[0] !== skill)
            const skillsClicked = this.state.skillsClicked;
            skillsClicked[index] = false;
            this.setState({ skills, skillsClicked, character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.itemList.map((skill: any, index: number) =>
                    <TouchableOpacity key={`${skill}${index}`} onPress={() => this.pickSkill(skill, index)} style={[styles.item, { backgroundColor: this.state.skillsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
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