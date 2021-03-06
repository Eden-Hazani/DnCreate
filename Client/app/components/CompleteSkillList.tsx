import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import skillModifier from '../../utility/skillModifier';
import { CharacterModel } from '../models/characterModel';
import skillsJson from '../../jsonDump/skillList.json';
import { AppText } from './AppText';
import { Colors } from '../config/colors';
import logger from '../../utility/logger';
import { AppButton } from './AppButton';

interface CompleteSkillListState {
    skillList: any[]
}

export class CompleteSkillList extends Component<{ onPress: any, character: CharacterModel, close: any }, CompleteSkillListState>{
    constructor(props: any) {
        super(props)
        this.state = {
            skillList: []
        }
    }
    componentDidMount() {
        try {
            const baseSkillList = [...skillsJson.skillList];
            if (this.props.character.skills && this.props.character.modifiers) {
                for (let item of this.props.character.skills) {
                    if (baseSkillList.includes(item[0])) {
                        baseSkillList.splice(baseSkillList.indexOf(item[0]), 1);
                    }
                }
                const skillList = baseSkillList.map((skill) => { return [skill, 0] })
                const modifiers = Object.entries(this.props.character.modifiers)
                let modifiedSkills: any[] = [];
                skillList.forEach((skill: any) => {
                    const skillGroup = skillModifier(skill);
                    for (let item of modifiers) {
                        if (item[0] === skillGroup) {
                            modifiedSkills.push([skill[0], item[1]])
                        }
                    }
                })
                this.setState({ skillList: modifiedSkills })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={30}>Skills</AppText>
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {this.state.skillList.map((skill: any, index: number) => <TouchableOpacity key={index} onPress={() => {
                        this.props.onPress(skill[1])
                        this.props.close(false)
                    }}
                        style={{
                            margin: 10, borderWidth: 1, borderColor: Colors.bitterSweetRed, borderRadius: 15, padding: 10,
                            width: 150, height: 80, justifyContent: "center"
                        }}>
                        <AppText textAlign={'center'} fontSize={18}>{skill[0]}</AppText>
                        <AppText textAlign={'center'} fontSize={20}>{skill[1]}</AppText>
                    </TouchableOpacity>)}
                </View>
                <View>
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={150} height={50} borderRadius={25} title={'close'}
                        onPress={() => this.props.close(false)} />
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    }
});