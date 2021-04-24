import React, { Component, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import hitDiceSwitch from '../../../utility/hitDiceSwitch';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { AttackRollTutorial } from '../charOptions/AttackRollTutorial';

interface Props {
    character: CharacterModel
    currentProficiency: number
}

export function SheetHitDiceInfo({ character, currentProficiency }: Props) {
    const [attackRollTutorialModal, setAttackRollTutorialModal] = useState<boolean>(false)
    return (
        <View style={styles.container}>
            <AppText fontSize={25}>Base Hit Dice</AppText>
            <AppText fontSize={25} color={Colors.bitterSweetRed}>{`D${hitDiceSwitch(character.characterClass)}`}</AppText>
            <AppText textAlign={'center'} fontSize={18}>Attack Modifiers {'\n'} (Add to damage roll)</AppText>
            <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                <AppText textAlign={'center'} fontSize={16}>{character.modifiers && character.modifiers.strength && character.modifiers.strength > 0 ? '+' : null} {character.modifiers && character.modifiers.strength} for melee weapons</AppText>
            </View>
            <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                <AppText textAlign={'center'} fontSize={16}>{character.modifiers && character.modifiers.dexterity && character.modifiers.dexterity > 0 ? '+' : null} {character.modifiers && character.modifiers.dexterity} for ranged weapons</AppText>
            </View>
            <AppText textAlign={'center'} fontSize={18}>Proficient weapons {'\n'} (add to attack roll)</AppText>
            <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                    <AppText textAlign={'center'} fontSize={16}>+{currentProficiency} + the fitting ability modifier for the weapon</AppText>
                </View>
                <AppText textAlign={'center'} fontSize={16}>Includes {character.characterClassId && character.characterClassId.weaponProficiencies &&
                    character.characterClassId.weaponProficiencies.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
            </View>
            {character.addedWeaponProf && character.addedWeaponProf.length > 0 &&
                <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                    <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                        <AppText textAlign={'center'} fontSize={16}>+{currentProficiency} + the fitting ability modifier for the weapon</AppText>
                    </View>
                    <AppText textAlign={'center'} fontSize={16}>Includes {character.addedWeaponProf.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
                </View>}
            <View>
                <AppButton backgroundColor={Colors.bitterSweetRed} width={120} height={60} borderRadius={25} title={'Issues with bonuses?'} onPress={() => setAttackRollTutorialModal(true)} />
                <Modal visible={attackRollTutorialModal} animationType={'slide'}>
                    <AttackRollTutorial closeWindow={(val: boolean) => setAttackRollTutorialModal(val)} />
                </Modal>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center"
    }
});