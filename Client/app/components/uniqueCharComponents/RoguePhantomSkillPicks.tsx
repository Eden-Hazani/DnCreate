import React, { Component } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import skillModifier from '../../../utility/skillModifier';
import { CharacterModel } from '../../models/characterModel';
import JsonSkills from '../../../jsonDump/skillList.json'
import JsonTools from '../../../jsonDump/toolList.json'
import { AppText } from '../AppText';
import { AppButton } from '../AppButton';
import { Colors } from '../../config/colors';
import AsyncStorage from '@react-native-community/async-storage';
interface RoguePhantomSkillPicksState {
    totalSkillToolList: string[]
    pickedSkill: string,
    pickSkillModal: boolean,
    skillClicked: boolean[]
}

export class RoguePhantomSkillPicks extends Component<{ character: CharacterModel, currentProficiency: number }, RoguePhantomSkillPicksState>{
    constructor(props: any) {
        super(props)
        this.state = {
            skillClicked: [],
            totalSkillToolList: JsonSkills.skillList.concat(JsonTools.tools),
            pickedSkill: "",
            pickSkillModal: false
        }
    }

    async componentDidMount() {
        const skill = await AsyncStorage.getItem(`${this.props.character._id}PhantomRogueSkill`);
        if (skill) {
            this.setState({ pickedSkill: JSON.parse(skill) })
        }
    }
    skillCheck = (skill: string) => {
        if (JsonSkills.skillList.includes(skill) && this.props.character.modifiers) {
            const modifiers = Object.entries(this.props.character.modifiers)
            const skillGroup = skillModifier(skill);
            for (let item of modifiers) {
                if (item[0] === skillGroup) {
                    return item[1]
                }
            }
        }
        return 0
    }

    pickSkill = (skill: string, index: number) => {
        let skillClicked = this.state.skillClicked;
        skillClicked = [];
        skillClicked[index] = true;
        this.setState({ pickedSkill: skill, skillClicked }, () => this.setInStorage())
    }

    setInStorage = async () => {
        await AsyncStorage.setItem(`${this.props.character._id}PhantomRogueSkill`, JSON.stringify(this.state.pickedSkill))
    }


    render() {
        return (
            <View style={styles.container}>

                <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={200} height={140} borderRadius={100}
                    textAlign={'center'}
                    title={`Phantom proficiency\n\n ${this.state.pickedSkill === "" ? 'No Skill Picked' : `${this.state.pickedSkill}  ${((this.skillCheck(this.state.pickedSkill) + this.props.currentProficiency) <= 0 ? "" : "+")}${(this.skillCheck(this.state.pickedSkill) + this.props.currentProficiency)}`}`}
                    onPress={() => { this.setState({ pickSkillModal: true }) }} />
                <Modal visible={this.state.pickSkillModal}>
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <View style={{ padding: 15 }}>
                            <AppText textAlign={'center'} fontSize={17}>Whispers of the Dead allows you to pick one tool or skill proficiency that you can change every short/long rest</AppText>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                            {this.state.totalSkillToolList.map((item: any, index: any) => <TouchableOpacity key={index} onPress={() => this.pickSkill(item, index)}
                                style={[styles.item, { backgroundColor: this.state.skillClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <AppText textAlign={'center'}>{item}</AppText>
                            </TouchableOpacity>)}
                        </View>
                        <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'close'}
                            onPress={() => { this.setState({ pickSkillModal: false }) }} />
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        margin: 15
    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});