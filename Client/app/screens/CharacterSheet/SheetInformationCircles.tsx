import React, { Component, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Vibration, Modal } from 'react-native';
import { hpColors } from '../../../utility/hpColors';
import { AppText } from '../../components/AppText';
import { ChangeMaxHp } from '../../components/ChangeMaxHp';
import { Colors } from '../../config/colors';
import useAnimateSection from '../../hooks/useAnimatedSection';
import { CharacterModel } from '../../models/characterModel';
import { RaceModel } from '../../models/raceModel';
import { CurrentHpSetting } from '../charOptions/CurrentHpSetting';
import { armorBonusCalculator } from '../charOptions/helperFunctions/armorBonusCalculator';
import { racialArmorBonuses } from '../charOptions/helperFunctions/racialArmorBonuses';

interface Props {
    character: CharacterModel
    isDm: boolean
    currentHp: string;
    currentProficiency: number;
    returnMaxHp: Function
    returnCurrentHp: Function
    changeLevel: Function
    rollDice: Function
}

export function SheetInformationCircles({ rollDice, character, isDm, returnCurrentHp, currentHp, changeLevel, returnMaxHp, currentProficiency }: Props) {
    const [isCurrentHpModalOpen, setIsCurrentHpModalOpen] = useState<boolean>(false)
    const [isMaxHpChangeModalOpen, setIsMaxHpChangeModalOpen] = useState<boolean>(false)

    const animatedVal = useAnimateSection(-500, 50)
    return (
        <Animated.View style={animatedVal.getLayout()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                {character.modifiers &&
                    <TouchableOpacity style={{ alignItems: "center", flex: .3 }} onPress={() => rollDice(character.modifiers?.dexterity)}>
                        <AppText>Initiative</AppText>
                        <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                            <AppText color={Colors.totalWhite} fontSize={25} >{character.modifiers.dexterity}</AppText>
                        </View>
                    </TouchableOpacity>
                }
                <View style={{ alignItems: "center", flex: .3 }}>
                    <AppText>Level</AppText>
                    <TouchableOpacity disabled={isDm} style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}
                        onPress={() => {
                            Vibration.vibrate(400)
                            if (character.level) {
                                changeLevel(character.level + 1)
                            }
                        }}
                        onLongPress={() => {
                            Vibration.vibrate(400)
                            if (character.level) {
                                changeLevel(character.level - 1)
                            }
                        }}>
                        <AppText color={Colors.totalWhite} fontSize={25}>{character.level}</AppText>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: "center", flex: .3 }}>
                    <AppText>Max HP</AppText>
                    <TouchableOpacity onPress={() => setIsMaxHpChangeModalOpen(true)}
                        style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                        <AppText color={Colors.totalWhite} fontSize={25}>{`${character.maxHp}`}</AppText>
                    </TouchableOpacity>
                </View>
                <Modal visible={isMaxHpChangeModalOpen} animationType="slide">
                    <ChangeMaxHp character={character}
                        sendNewMax={() => {
                            returnMaxHp()
                            setIsMaxHpChangeModalOpen(false)
                        }}
                        currentMax={character.maxHp} />
                </Modal>
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ alignItems: "center", flex: .3 }}>
                    <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                        <AppText color={Colors.totalWhite} fontSize={25}>{`+${currentProficiency}`}</AppText>
                    </View>
                    <AppText textAlign={'center'}>Proficiency Bonus</AppText>
                </View>
                <View style={{ alignItems: "center", flex: .3 }}>
                    <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                        <AppText color={Colors.totalWhite} fontSize={25}>{
                            armorBonusCalculator(character, character.equippedArmor && character.equippedArmor.ac ? character.equippedArmor.ac : 0,
                                character.equippedArmor ? character.equippedArmor.armorBonusesCalculationType : "") + racialArmorBonuses(character.raceId ? character.raceId : new RaceModel())}</AppText>
                    </View>
                    <AppText>AC</AppText>
                </View>
                <View style={{ alignItems: "center", flex: .3 }}>
                    <TouchableOpacity disabled={isDm} onPress={() => setIsCurrentHpModalOpen(true)} style={[styles.triContainer, { borderColor: Colors.whiteInDarkMode, backgroundColor: hpColors(parseInt(currentHp), character.maxHp ? character.maxHp : 0) }]}>
                        <AppText color={Colors.black} fontSize={25}>{currentHp}</AppText>
                    </TouchableOpacity>
                    <AppText>Current Hp</AppText>
                </View>
                <CurrentHpSetting
                    closeModal={(newHPVal: number) => {
                        setIsCurrentHpModalOpen(false)
                        returnCurrentHp(newHPVal)
                    }}
                    currentHp={currentHp}
                    char_id={character._id || ''}
                    maxHp={character.maxHp || 0}
                    openModal={isCurrentHpModalOpen} />
            </View>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    triContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 70,
        height: 70,
        width: 70
    },
});