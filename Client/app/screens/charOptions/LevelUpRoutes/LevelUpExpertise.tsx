import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { RootState } from '../../../redux/reducer';

interface Props {
    reloadingSkills: boolean
    character: CharacterModel
    expertise: number
}

export function LevelUpExpertise({ reloadingSkills, character, expertise }: Props) {

    const storeChar = useSelector((state: RootState) => { return { ...state.character } });
    const [skillsClicked, setSkillsClicked] = useState<any[]>([])

    const pickSkill = (skill: any, index: number) => {
        try {
            let count = 0;
            skillsClicked.forEach(appear => appear === true && count++)
            if (!skillsClicked[index]) {
                if (count === expertise) {
                    alert(`You can only Improve ${expertise} skills`);
                    return;
                }
                const newTools = character.tools || [];
                let newSkills: any = [];
                const storeCharSkills = storeChar.skills;
                if (storeCharSkills) {
                    newSkills = storeCharSkills
                }
                const updatedSkillsClicked = [...skillsClicked];
                newTools.filter((item: any, index: number) => {
                    if (item.includes(skill[0]) && character.skills) {
                        if (item[1] === 2) {
                            alert('You already have expertise in this skill, you cannot double stack the same skill.');
                            return;
                        }
                        updatedSkillsClicked[index + character.skills.length] = true
                        item[1] = item[1] + 2
                        setSkillsClicked(updatedSkillsClicked)
                        return;
                    }
                })
                newSkills.filter((item: any, index: number) => {
                    if (item.includes(skill[0])) {
                        if (item[1] === 2) {
                            alert('You already have expertise in this skill, you cannot double stack that same skill.');
                            return;
                        }
                        updatedSkillsClicked[index] = true
                        item[1] = item[1] + 2
                        setSkillsClicked(updatedSkillsClicked)
                        return;
                    }
                })
            }
            else if (skillsClicked[index]) {
                let newSkills: any = [];
                const storeCharSkills = storeChar.skills;
                if (storeCharSkills) {
                    newSkills = storeCharSkills
                }
                const updatedSkillsClicked = [...skillsClicked];
                const newTools = character.tools || [];
                newTools.filter((item: any, index: number) => {
                    if (item.includes(skill[0]) && character.skills) {
                        updatedSkillsClicked[index + character.skills.length] = false
                        item[1] = item[1] - 2
                        setSkillsClicked(updatedSkillsClicked)
                        return;
                    }
                })
                newSkills.filter((item: any, index: number) => {
                    if (item.includes(skill[0])) {
                        updatedSkillsClicked[index] = false
                        item[1] = item[1] - 2;
                        setSkillsClicked(updatedSkillsClicked)
                        return;
                    }
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }

    }

    return (
        <View style={styles.container}>
            {reloadingSkills ? <AppActivityIndicator visible={reloadingSkills} /> :
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <AppText color={Colors.bitterSweetRed} fontSize={20}>As a level {character.level} {character.characterClass}</AppText>
                    <AppText textAlign={"center"}>You have the option to choose two of your skill proficiencies, your proficiency bonus is doubled for any ability check you make that uses either of the chosen proficiencies.</AppText>
                    {storeChar.skills && storeChar.skills.map((skill: any, index: number) =>
                        <TouchableOpacity key={index} onPress={() => pickSkill(skill, index)} style={[styles.item, { padding: 15, backgroundColor: skillsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText>{skill[0]}</AppText>
                        </TouchableOpacity>)}
                    {character.characterClass === 'Rogue' && character.tools &&
                        character.tools.map((tool, index) =>
                            <TouchableOpacity key={index} onPress={() => pickSkill(tool, index + (character.skills ? character.skills.length : 0))}
                                style={[styles.item, { padding: 15, backgroundColor: skillsClicked[index + (character.skills ? character.skills.length : 0)] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <AppText>{tool[0]}</AppText>
                            </TouchableOpacity>)}
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    },
});