import React, { Component, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { AppText } from '../../components/AppText';
import { PersonalInfo } from '../../components/PersonalInfo';
import { Colors } from '../../config/colors';
import useAnimateSection from '../../hooks/useAnimatedSection';
import { CharacterModel } from '../../models/characterModel';

interface Props {
    character: CharacterModel
}

export function SheetBaseInfo({ character }: Props) {
    const [isPersonalModalOpen, setIsPersonalModalOpen] = useState<boolean>(false)
    const animatedVal = useAnimateSection(-500, 0)
    return (
        <Animated.View style={[animatedVal.getLayout(), { flexDirection: "column", paddingLeft: 2 }]}>
            <TouchableOpacity onPress={() => setIsPersonalModalOpen(true)}>
                <Image style={styles.image} uri={character.image ? `${Config.serverUrl}/assets/races/${character.image}` : `${Config.serverUrl}/assets/backgroundDragons/blankDragon.png`} />
            </TouchableOpacity>
            {character.name && <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{character.name.replace(/ /g, "\r\n")}</AppText>}
            <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{character.race}</AppText>
            <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{character.characterClass}</AppText>
            <Modal visible={isPersonalModalOpen} animationType="slide">
                <PersonalInfo character={character} close={(val: boolean) => setIsPersonalModalOpen(val)} />
            </Modal>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 100,
        resizeMode: "cover",
    },
});