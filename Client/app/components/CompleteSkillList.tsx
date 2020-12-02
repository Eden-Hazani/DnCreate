import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import skillModifier from '../../utility/skillModifier';
import { CharacterModel } from '../models/characterModel';
import skillsJson from '../../jsonDump/skillList.json';
import { AppText } from './AppText';
import { Colors } from '../config/colors';

interface CompleteSkillListState {
    skillList: any[]
}

export class CompleteSkillList extends Component<{ character: CharacterModel }, CompleteSkillListState>{
    constructor(props: any) {
        super(props)
        this.state = {
            skillList: []
        }
    }
    componentDidMount() {
        const baseSkillList = skillsJson.skillList;
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
                    {this.state.skillList.map((skill: any, index: number) => <View key={index} style={{
                        margin: 10, borderWidth: 1, borderColor: Colors.bitterSweetRed, borderRadius: 15, padding: 10,
                        width: 150, height: 80, justifyContent: "center"
                    }}>
                        <AppText textAlign={'center'} fontSize={18}>{skill[0]}</AppText>
                        <AppText textAlign={'center'} fontSize={20}>{skill[1]}</AppText>
                    </View>)}
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