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

interface AppSkillItemPickerState {
    skillsClicked: boolean[]
    skills: any[]
    amountToPick: number
    skillConfirmation: boolean
    character: CharacterModel
    alreadyPickedSkills: boolean[]

}

export class AppSkillItemPicker extends Component<{
    character: CharacterModel, withConditions: boolean, pathChosen: any, extraSkillsTotal: number,
    amount: number, itemList: any, setAdditionalSkillPicks: any, sendSkillsBack: any, resetExpertiseSkills: any, skillsStartAsExpertise: any
}, AppSkillItemPickerState> {
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyPickedSkills: [],
            skillConfirmation: false,
            skills: [],
            amountToPick: this.props.amount,
            skillsClicked: [],
            character: store.getState().character
        }
    }

    componentDidMount() {
        const alreadyPickedSkills = this.state.alreadyPickedSkills;
        if (this.props.withConditions) {
            for (let item of this.state.character.skills) {
                if (this.props.itemList.includes(item[0])) {
                    const alreadyPickedSkills = this.state.alreadyPickedSkills;
                    alreadyPickedSkills[this.props.itemList.indexOf(item[0])] = true;
                }
            }
            for (let item of this.state.character.tools) {
                if (this.props.itemList.includes(item[0])) {
                    const alreadyPickedSkills = this.state.alreadyPickedSkills;
                    alreadyPickedSkills[this.props.itemList.indexOf(item[0])] = true;
                }
            }
            this.setState({ alreadyPickedSkills }, () => {
                this.setState({ amountToPick: generateSkillPickPathCondition(this.state.character, this.props.itemList, this.props.pathChosen, this.props.extraSkillsTotal) })
            })
            this.props.setAdditionalSkillPicks(this.state.amountToPick)
            return
        }
        for (let item of this.state.character.skills) {
            if (this.props.itemList.includes(item[0])) {
                const alreadyPickedSkills = this.state.alreadyPickedSkills;
                alreadyPickedSkills[this.props.itemList.indexOf(item[0])] = true;
            }
        }
        this.props.setAdditionalSkillPicks(this.state.amountToPick)
    }
    componentWillUnmount() {
        this.props.setAdditionalSkillPicks(0)
    }
    componentDidUpdate() {
        if (this.state.skills.length === this.state.amountToPick && !this.state.skillConfirmation) {
            this.setState({ skillConfirmation: true })
            this.props.sendSkillsBack(this.state.skills)
            this.props.setAdditionalSkillPicks(0)
        }
    }

    pickSkill = (skill: any, index: number) => {
        if (this.props.withConditions) {
            if (jsonSkills.skillList.includes(skill)) {
                this.pickSkillFuc(skill, index)
                return;
            } else {
                this.pickToolFuc(skill, index)
                return;
            }
        }
        this.pickSkillFuc(skill, index)
    }

    pickToolFuc = (skill: any, index: number) => {
        const character = store.getState().character;
        let skills = this.state.skills;
        if (!this.state.skillsClicked[index]) {
            if (this.state.skills.length >= this.state.amountToPick) {
                alert(`You can only pick ${this.state.amountToPick} skills.`)
                return;
            }
            const skillsClicked = this.state.skillsClicked;
            skillsClicked[index] = true;
            skills.push(skill)
            this.props.skillsStartAsExpertise ? character.tools.push([skill, 2]) : character.tools.push([skill, 0])
            this.setState({ skills, skillsClicked, character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            })
        }
        else if (this.state.skillsClicked[index]) {
            this.props.resetExpertiseSkills(skill)
            skills = skills.filter(val => val !== skill);
            character.tools = character.tools.filter(val => val[0] !== skill)
            const skillsClicked = this.state.skillsClicked;
            skillsClicked[index] = false;
            this.setState({ skills, skillsClicked, character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            })
        }
    }

    pickSkillFuc = (skill: any, index: number) => {
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
                    <TouchableOpacity disabled={this.state.alreadyPickedSkills[index]} key={`${skill}${index}`} onPress={() => this.pickSkill(skill, index)}
                        style={[styles.item, { backgroundColor: this.state.alreadyPickedSkills[index] ? Colors.berries : this.state.skillsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
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