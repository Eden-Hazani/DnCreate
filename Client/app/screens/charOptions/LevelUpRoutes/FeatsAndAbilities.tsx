import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { FeatOptions } from '../FeatOptions';
import { mergeFeatToChar, pushNewFeat, validateFeat, removeNewFeat } from './functions/featFunctionality';
import { alterErrorSequence, levelUpModifierListStats } from './functions/LevelUpUtilityFunctions';

interface Props {
    beforeChanges: CharacterModel;
    character: CharacterModel;
    errorList: { isError: boolean, errorDesc: string }[];
    updateErrorList: Function
    updateCharacter: Function
}

interface FeatObj {
    featName: string;
    featDescription: string;
    featSkillList: string[];
    featSavingThrowList: any[];
    featToolList: any[];
    strength: number;
    constitution: number;
    dexterity: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    weaponProfArray: any[];
    armorProfArray: any[]
}

export function FeatsAndAbilities({ character, beforeChanges, errorList, updateErrorList, updateCharacter }: Props) {

    const [abilityWindow, setAbilityWindow] = useState<boolean>(false)
    const [featWindow, setFeatWindow] = useState<boolean>(false)
    const [totalAbilityPoints, setTotalAbilityPoints] = useState<number>(2)
    const [loading, setLoading] = useState<boolean>(false)
    const [abilityClicked, setAbilityClicked] = useState<number[]>([0, 0, 0, 0, 0, 0])

    const [featChangeObj, setFeatChangeObj] = useState<FeatObj>({
        charisma: character.charisma || 0,
        constitution: character.constitution || 0,
        dexterity: character.dexterity || 0,
        featDescription: '',
        featName: '',
        featSavingThrowList: [],
        featSkillList: [],
        featToolList: [],
        intelligence: character.intelligence || 0,
        strength: character.strength || 0,
        wisdom: character.wisdom || 0,
        weaponProfArray: [],
        armorProfArray: []
    })


    useEffect(() => {
        const { desc, error } = validateFeat(featChangeObj)
        if (featWindow && error) {
            updateCharacter(mergeFeatToChar(featChangeObj, character, beforeChanges));
            alterErrorSequence({ isError: true, errorDesc: desc }, errorList, updateErrorList)
            return
        } else if (featWindow && !error) {
            updateCharacter(mergeFeatToChar(featChangeObj, character, beforeChanges));
            alterErrorSequence({ isError: false, errorDesc: desc }, errorList, updateErrorList)
        }
        else if (!featWindow && abilityWindow) {
            alterErrorSequence({ isError: false, errorDesc: desc }, errorList, updateErrorList)
        }
    }, [featWindow, featChangeObj])

    useEffect(() => {
        if (!featWindow && !abilityWindow) {
            alterErrorSequence({ isError: true, errorDesc: 'Must Pick A Feat Or Ability Score Improve' }, errorList, updateErrorList)
        } else {
            alterErrorSequence({ isError: false, errorDesc: 'Must Pick A Feat Or Ability Score Improve' }, errorList, updateErrorList)
        }
        setLoading(false)
    }, [featWindow, abilityWindow])


    useEffect(() => {
        if (abilityWindow) {
            if (totalAbilityPoints !== 0) {
                alterErrorSequence({ isError: true, errorDesc: 'You Still Have Unspent Ability Points' }, errorList, updateErrorList)
            } else {
                alterErrorSequence({ isError: false, errorDesc: 'You Still Have Unspent Ability Points' }, errorList, updateErrorList)
            }
        } else if (!abilityWindow && featWindow) {
            alterErrorSequence({ isError: false, errorDesc: 'You Still Have Unspent Ability Points' }, errorList, updateErrorList)
        }
    }, [totalAbilityPoints, abilityWindow])


    const resetAbilityScoresToCurrentLevel = () => {
        const updatedCharacter = { ...character };
        updatedCharacter.strength = beforeChanges.strength;
        updatedCharacter.constitution = beforeChanges.constitution;
        updatedCharacter.dexterity = beforeChanges.dexterity;
        updatedCharacter.wisdom = beforeChanges.wisdom;
        updatedCharacter.intelligence = beforeChanges.intelligence;
        updatedCharacter.charisma = beforeChanges.charisma;
        updateCharacter(updatedCharacter)
    }

    const updateCharacterModifier = (modifier: string, addOrRemove: string) => {
        const updatedCharacter = { ...character };
        if (addOrRemove === "ADD") {
            if (updatedCharacter.modifiers) {
                updatedCharacter[modifier] = updatedCharacter[modifier] + 1;
                updateCharacter(updatedCharacter)
            }
        }
        if (addOrRemove === "REMOVE") {
            if (updatedCharacter.modifiers) {
                updatedCharacter[modifier] = updatedCharacter[modifier] - 1;
                updateCharacter(updatedCharacter)
            }
        }
    }

    const pickAbilityPoints = (ability: any, index: number) => {
        try {
            if (character.modifiers) {
                if (character.modifiers[ability] === 20) {
                    alert(`Max 20 ability points`)
                    return;
                }
                if (abilityClicked[index] <= 2) {
                    if (totalAbilityPoints === 0) {
                        alert(`You only have 2 ability points to spend`)
                        return;
                    }
                    const updatedAbilityClicked = [...abilityClicked];
                    updatedAbilityClicked[index] = updatedAbilityClicked[index] + 1
                    setTotalAbilityPoints(prevState => prevState - 1)
                    setAbilityClicked(updatedAbilityClicked)
                    updateCharacterModifier(ability, "ADD")
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    const removeAbilityPoints = (ability: any, index: number) => {
        try {
            if (abilityClicked[index] >= 0 && abilityClicked[index] <= 2 && totalAbilityPoints < 2 && character.modifiers && beforeChanges.modifiers) {
                if (character[ability] === beforeChanges[ability]) {
                    return;
                }
                const updatedAbilityClicked = [...abilityClicked];
                updatedAbilityClicked[index] = updatedAbilityClicked[index] - 1
                setAbilityClicked(updatedAbilityClicked)
                setTotalAbilityPoints(prevState => prevState + 1)
                updateCharacterModifier(ability, "REMOVE")
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    const updateFeatObj = (parameter: string, value: any) => setFeatChangeObj(prevState => ({ ...prevState, [parameter]: value }));


    return (
        <View >
            <View>
                <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                    <AppText fontSize={20} textAlign={'center'}>As a {character.characterClass} at level {character.level} you can choose between increasing your ability score and adopting a new feat.</AppText>
                    <AppText fontSize={18} textAlign={'center'}>You can either spend 2 points on one ability or spread your choice and put 1 point in two different abilities</AppText>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ padding: 15 }}>
                            <AppButton fontSize={18} backgroundColor={featWindow ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={100} width={100} height={100} title={"Feats"} onPress={() => {
                                resetAbilityScoresToCurrentLevel()
                                setFeatWindow(true)
                                setAbilityWindow(false)
                                setAbilityClicked([0, 0, 0, 0, 0, 0])
                                setTotalAbilityPoints(2)
                                setLoading(true)
                            }} />
                        </View>
                        <View style={{ padding: 15 }}>
                            <AppButton fontSize={18} backgroundColor={abilityWindow ? Colors.bitterSweetRed : Colors.lightGray}
                                borderRadius={100} width={100} height={100} title={"Ability Score"} onPress={() => {
                                    updateCharacter(beforeChanges)
                                    setFeatWindow(false)
                                    setAbilityWindow(true)
                                    setLoading(true)
                                }} />
                        </View>
                    </View>
                </View>
                {loading ? <AppActivityIndicator visible={loading} /> :
                    <View>
                        {abilityWindow &&
                            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                                {levelUpModifierListStats(character).map((item, index) =>
                                    <View key={index} style={{ flexDirection: 'row', width: Dimensions.get('screen').width / 2, paddingHorizontal: Dimensions.get('screen').width / 12 }}>
                                        <View style={{ flexDirection: 'row', position: 'absolute', alignSelf: 'center' }}>
                                            <TouchableOpacity style={{ marginRight: Dimensions.get("screen").width / 17, bottom: Dimensions.get("screen").height / 15 }} onPress={() => { pickAbilityPoints(item[0], index) }}>
                                                <IconGen size={55} backgroundColor={Colors.shadowBlue} name={'plus'} iconColor={Colors.white} />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ marginLeft: Dimensions.get("screen").width / 7.5, bottom: Dimensions.get("screen").height / 15 }} onPress={() => { removeAbilityPoints(item[0], index) }}>
                                                <IconGen size={55} backgroundColor={Colors.orange} name={'minus'} iconColor={Colors.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={[styles.innerModifier, { backgroundColor: Colors.bitterSweetRed }]}>
                                            <AppText fontSize={18} color={Colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
                                            <View style={{ paddingTop: 10 }}>
                                                <AppText fontSize={25} textAlign={"center"}>{`${item[1]}`}</AppText>
                                            </View>
                                        </View>
                                    </View>)}
                            </View>}

                        {featWindow &&
                            <View>
                                <FeatOptions character={character}
                                    featName={(e: string) => updateFeatObj('featName', e)}
                                    featDescription={(e: string) => updateFeatObj('featDescription', e)}
                                    weaponsProfChange={(e: any) => {
                                        const weaponProfArray = e.split(',').filter((i: any) => i);
                                        updateFeatObj('weaponProfArray', weaponProfArray)
                                    }}
                                    armorProfChange={(e: any) => {
                                        const armorProfArray = e.split(',').filter((i: any) => i);
                                        updateFeatObj('armorProfArray', armorProfArray)
                                    }}
                                    skillListChange={(featSkillList: any[]) => updateFeatObj('featSkillList', featSkillList)}
                                    savingThrowListChange={(featSavingThrowList: any[]) => updateFeatObj('featSavingThrowList', featSavingThrowList)}
                                    toolListChange={(featToolList: any[]) => updateFeatObj('featToolList', featToolList)}
                                    attributePointsChange={(abilityName: string, ability: number) => updateFeatObj(`${abilityName}`, ability)}
                                    resetList={(listName: string) => updateFeatObj(`${listName}`, [])}
                                    resetAbilityScore={() => { resetAbilityScoresToCurrentLevel() }} />
                            </View>
                        }
                    </View>}


            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    innerModifier: {
        width: 120,
        height: 120,
        borderRadius: 120,
        justifyContent: "center"
    },
});