import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppText } from './AppText';

interface AppAddExactSkillProfState {
    character: CharacterModel
}

export class AppAddExactSkillProf extends Component<{ character: CharacterModel, skillsStartAsExpertise: any, skillList: [] }, AppAddExactSkillProfState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }

    componentDidMount() {
        try {
            if (this.props.character.skills) {
                const character = { ...this.state.character }
                const charSkills = this.props.character.skills.map(skill => { return skill[0] });
                for (let skill of this.props.skillList) {
                    if (!charSkills.includes(skill) && character.skills) {
                        this.props.skillsStartAsExpertise ? character.skills.push([skill, 2]) : character.skills.push([skill, 0])
                        this.setState({ character }, () => {
                            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                        })
                    }
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }

    }



    render() {
        return (
            <View style={styles.container}>
                <AppText>You have acquired proficiency in the following skills:</AppText>
                {this.props.skillList.map((skill, index) => <View key={index}>
                    <AppText color={Colors.berries}>{skill}</AppText>
                </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});