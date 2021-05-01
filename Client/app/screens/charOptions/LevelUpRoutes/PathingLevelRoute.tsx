import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppExtraPathChoicePicker } from '../../../components/AppExtraPathChoicePicker';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { ActionType } from '../../../redux/action-type';
import { store } from '../../../redux/store';
import { AppPathAdditionalApply } from '../AppPathAdditionalApply';
import { SubClassList } from '../SubClassList';
import { addPathArmor, addSpellAvailabilityByName, loadPathElements, loadSpellsFromList, addPathArmorProficiency, newPathFirstLevelMagic, loadPathBattleManuevers, loadPathSavingThrows, loadPathUnrestrictedMagic, loadPathSpecificSpell, addPathLanguages, addPathWeaponProficiency, applyExtraPathChoice } from './functions/characterUpdateFunctions';
import { extractCustomPathJson, customOrOfficialPath } from './functions/pathFunctions';


interface Props {
    character: CharacterModel;
    returnUpdatedCharacter: Function;
    pathSelector: any;
    beforeAnyChanges: CharacterModel;
    pathFeature: boolean;
    errorList: { isError: boolean, errorDesc: string }[];
    updateErrorList: Function;
    resetExpertiseSkills: Function;
}

export function PathingLevelRoute({ character, pathSelector, returnUpdatedCharacter, beforeAnyChanges, pathFeature, errorList, updateErrorList, resetExpertiseSkills }: Props) {

    const [pathClicked, setPathClicked] = useState<boolean[]>([])
    const [pathChosen, setPathChosen] = useState<any>(null)
    const [pathInfoLoading, setPathInfoLoading] = useState<boolean>(false)
    const [currentPathInformation, setCurrentPathInformation] = useState<any>(null)

    useEffect(() => {
        if (pathChosen !== null && character.level) {
            getPathDetails()
        }
    }, [pathChosen])

    const getPathDetails = async () => {
        if (pathChosen !== null && character.level) {
            const result = await customOrOfficialPath(character, pathChosen, character.path, pathFeature)
            setCurrentPathInformation(result)
        }
    }

    const pickPath = (path: any, index: number) => {
        try {
            setPathInfoLoading(true)
            setTimeout(() => {
                setPathInfoLoading(false)
            }, 800);
            if (!pathClicked[index]) {
                if (pathChosen !== null) {
                    alert(`Can't pick more then one path`)
                    return
                }
                const updatedPathClicked = [...pathClicked];
                updatedPathClicked[index] = true
                setPathClicked(updatedPathClicked)
                setPathChosen(path)
            }
            else if (pathClicked[index]) {
                character = JSON.parse(JSON.stringify(beforeAnyChanges));
                const updatedPathClicked = [...pathClicked];
                updatedPathClicked[index] = false
                setPathClicked(updatedPathClicked)
                setPathChosen(null)
                store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    const alterErrorSequence = (error: { isError: boolean, errorDesc: string }) => {
        const updatedErrorList = [...errorList];
        for (let item of updatedErrorList) {
            if (error.errorDesc === item.errorDesc) {
                item.isError = error.isError;
            }
        }
        updateErrorList(updatedErrorList)
    }

    return (
        <View style={styles.container}>
            {pathSelector ?
                <View>
                    <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                        <AppText fontSize={20} textAlign={'center'}>As a {character.characterClass} at level {character.level} you can pick a path</AppText>
                        <AppText fontSize={18} textAlign={'center'}>It is highly recommended to search the many guides online in order to find the path that suites you best.</AppText>
                        <AppText fontSize={18} textAlign={'center'}>As you level up the path you chose will provide you with spacial bonuses.</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <SubClassList pathClicked={pathClicked} pickPath={(item: any, index: number) => pickPath(item, index)}
                            baseSubClassList={pathSelector} baseClass={character.characterClass} />
                    </View>
                </View>
                :
                null}

            {pathFeature ?
                pathChosen || character.path ?
                    <View>
                        {pathInfoLoading ?
                            <AppActivityIndicator visible={pathInfoLoading} />
                            :
                            <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                                <AppText fontSize={25} textAlign={'center'}>Level {character.level} with the {pathChosen?.name || character.path.name}!</AppText>
                                {currentPathInformation.map((item: any, index: number) =>
                                    <View key={item.name}>
                                        <View style={item.description && styles.infoContainer}>
                                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={'center'}>
                                                {item.name}</AppText>
                                            <AppText color={Colors.whiteInDarkMode} fontSize={18} textAlign={'center'}>
                                                {item.description && item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                        </View>
                                        {(item.armorProf || item.weaponProf || item.skillList || item.fightingStyles || item.additionCantrip || item.druidCircleSpellLists ||
                                            item.unrestrictedMagicPick || item.addMagicalAbilities || item.maneuvers || item.toolsToPick || item.learnLanguage ||
                                            item.levelOneSpells || item.specificCantrip || item.AddSpellsFromDifferentClass || item.addElementalAttunement ||
                                            item.elementList || item.spellsToBeAdded || item.toolsToBeAdded || item.addArmor || item.spellListWithLimiter ||
                                            item.savingThrowList || item.addExactSkillProficiency ||
                                            item.increaseMaxHp || item.addSpellAvailability || item.pickSpecificSpellWithChoices) &&
                                            <AppPathAdditionalApply
                                                updateSpellList={(val: any) => { returnUpdatedCharacter(loadSpellsFromList(character, val)) }}
                                                addSpellAvailabilityByName={(val: any) => { returnUpdatedCharacter(addSpellAvailabilityByName(character, val)) }}
                                                armorToLoad={(val: any) => { addPathArmor(val, character) }}
                                                loadFirstLevelSpells={(val: any) => returnUpdatedCharacter(newPathFirstLevelMagic(val.newSpells, val.spellsKnown, character))}
                                                loadCharacter={(character: CharacterModel) => returnUpdatedCharacter(character)}
                                                languagesToPick={(val: boolean) => alterErrorSequence({ isError: val, errorDesc: 'You Still Have Languages To Pick From' })}
                                                pickDruidCircle={(val: boolean) => alterErrorSequence({ isError: val, errorDesc: 'Must Pick Druid Circle' })}
                                                fightingStylesToPick={(val: boolean) => alterErrorSequence({ isError: val, errorDesc: 'Must Pick A Fighting Style' })}
                                                isAdditionalToolChoice={(val: boolean) => alterErrorSequence({ isError: val, errorDesc: 'You Have Additional Tools To Pick From' })}
                                                pathChosen={pathChosen?.name || character.path.name}
                                                pathChosenObj={pathChosen || character.path}
                                                maneuversToPick={(val: boolean) => alterErrorSequence({ isError: val, errorDesc: 'You Have Additional Maneuvers To Pick' })}
                                                elementsToPick={(val: any) => alterErrorSequence({ isError: val, errorDesc: 'You Have Additional Elements To Pick' })}
                                                loadElements={(val: any) => returnUpdatedCharacter(loadPathElements(character, val))}
                                                loadManeuvers={(val: any) => returnUpdatedCharacter(loadPathBattleManuevers(character, val))}
                                                returnSavingThrows={(val: any) => returnUpdatedCharacter(loadPathSavingThrows(character, val))}
                                                loadUnrestrictedMagic={(magicNumber: number) => returnUpdatedCharacter(loadPathUnrestrictedMagic(character, magicNumber))}
                                                loadSpecificSpell={(val: any) => returnUpdatedCharacter(loadPathSpecificSpell(character, val))}
                                                loadLanguage={(languages: []) => returnUpdatedCharacter(addPathLanguages(character, languages))}

                                                loadWeapons={(weapons: any) => returnUpdatedCharacter(addPathWeaponProficiency(character, weapons))}
                                                resetExpertiseSkills={(skill: any) => { resetExpertiseSkills(skill) }}
                                                loadArmors={(armors: any) => returnUpdatedCharacter(addPathArmorProficiency(character, armors))}
                                                isAdditionalSkillChoice={(val: any) => alterErrorSequence({ isError: val, errorDesc: 'You Have Additional Choices To Pick From' })}
                                                character={character}
                                                pathItem={item}
                                                loadSkills={() => returnUpdatedCharacter(store.getState().character)} />
                                        }
                                        {item.choice &&
                                            <AppExtraPathChoicePicker
                                                customPathFeatureList={currentPathInformation}
                                                pathChosen={pathChosen}
                                                numberOfChoices={(numberOfChoices: number) => { this.setState({ numberOfChoices }) }}
                                                resetExpertiseSkills={() => { resetExpertiseSkills() }}
                                                character={character}
                                                isExtraChoice={(val: boolean) => { }}
                                                applyExtraPathChoice={(val: CharacterModel) => { }}
                                                item={item}
                                                extraPathChoiceClicked={[]}
                                                isAdditionalSkillChoice={(val: any) => { this.setState({ additionalSkillPicks: val }) }}
                                                loadSkills={(val: any[]) => {
                                                    this.setState({ character: store.getState().character })
                                                }}
                                            />}
                                    </View>)}
                            </View>
                        }
                    </View>
                    :
                    null
                :
                null}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    infoContainer: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 15,
        padding: 10
    }
});