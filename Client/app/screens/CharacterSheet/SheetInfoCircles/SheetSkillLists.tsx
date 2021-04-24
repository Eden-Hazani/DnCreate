import React, { Component, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { CompleteSkillList } from '../../../components/CompleteSkillList';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { ProficientSkillList } from '../../charOptions/ProficiantSkillList';

interface Props {
    character: CharacterModel;
    isDm: boolean;
    navigation: any;
    currentProficiency: number;
    rollSkillDice: Function
}

export function SheetSkillLists({ character, isDm, navigation, currentProficiency, rollSkillDice }: Props) {
    const [completeSkillModel, setCompleteSkillModel] = useState<boolean>(false)
    return (
        <View style={[styles.list, { width: '40%' }]}>
            <AppButton backgroundColor={Colors.bitterSweetRed} fontSize={30} width={100} height={50} borderRadius={25} title={'complete skill list'}
                onPress={() => setCompleteSkillModel(true)} />
            <ProficientSkillList
                isDm={isDm}
                diceRolling={(val: any) => rollSkillDice({ diceRolling: val.diceRolling, currentDiceRollValue: val.rollValue })}
                character={character}
                currentProficiency={currentProficiency} />
            <View style={{ paddingTop: 15 }}>
                <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                    width={110} height={60} borderRadius={25} title={'Replace skill proficiencies'}
                    onPress={() => { navigation.navigate("ReplaceProficiencies", { char: character, profType: "skills" }) }} />
            </View>
            <Modal visible={completeSkillModel} animationType={'slide'}>
                <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                    <CompleteSkillList close={(val: boolean) => setCompleteSkillModel(false)}
                        onPress={(val: number) => rollSkillDice({ diceRolling: true, currentDiceRollValue: val })}
                        character={character} />
                </ScrollView>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%"
    }
});