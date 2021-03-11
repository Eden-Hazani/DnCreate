import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Config } from '../../../config';
import { skillExpertiseCheck } from '../../../utility/skillExpertiseCheck';
import skillModifier from '../../../utility/skillModifier';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
const { height, width } = Dimensions.get('window')
interface ProficientSkillListState {

}
export class ProficientSkillList extends Component<{ isDm: boolean, diceRolling: any, character: CharacterModel, currentProficiency: number }, ProficientSkillListState>{
    constructor(props: any) {
        super(props)
        this.state = {

        }
    }
    skillCheck = (skill: string) => {
        if (this.props.character.modifiers) {
            const modifiers = Object.entries(this.props.character.modifiers)
            const skillGroup = skillModifier(skill);
            for (let item of modifiers) {
                if (item[0] === skillGroup) {
                    return item[1]
                }
            }
        }
    }


    rollDice = (skill: string) => {
        const val = (this.skillCheck(skill) + this.props.currentProficiency) +
            skillExpertiseCheck(skill[1], this.props.currentProficiency)
        this.props.diceRolling({ diceRolling: true, rollValue: val });
    }
    render() {
        return (
            <View style={styles.container}>
                <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'center'}>Proficient skills:</AppText>
                {this.props.character.skills && this.props.character.skills.map((skill: any) =>
                    <TouchableOpacity disabled={this.props.isDm} onPress={() => this.rollDice(skill)}
                        key={skill} style={[styles.skill, { borderColor: Colors.bitterSweetRed }]}>
                        <AppText textAlign={'center'}>{`${skill[0]}`}</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}
                            textAlign={'center'}>{`${((this.skillCheck(skill) + this.props.currentProficiency) + skillExpertiseCheck(skill[1], this.props.currentProficiency)
                                <= 0 ? "" : "+")} ${(this.skillCheck(skill) + this.props.currentProficiency) +
                                skillExpertiseCheck(skill[1], this.props.currentProficiency)}`}</AppText>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        zIndex: 1
    },
    skill: {
        borderRadius: 10,
        borderWidth: 1,
        width: 100,
        padding: 5,
        marginVertical: 2
    },
});