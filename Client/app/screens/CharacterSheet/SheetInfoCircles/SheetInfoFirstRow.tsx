import React, { Component, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '../../../components/AppText';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import useAnimateSection from '../../../hooks/useAnimatedSection';
import { CharacterModel } from '../../../models/characterModel';
import { SheetBackStory } from '../SheetComponents/SheetBackStory';
import { SheetStats } from '../SheetComponents/SheetStats';

interface Props {
    character: CharacterModel
    isDm: boolean
    navigation: any
}

export function SheetInfoFirstRow({ character, isDm, navigation }: Props) {
    const [backgroundModel, setBackgroundModel] = useState<boolean>(false)
    const [statsModel, setStatesModel] = useState<boolean>(false)
    const animatedVal = useAnimateSection(-800, 100)
    return (
        <Animated.View style={[animatedVal.getLayout(), styles.secRowIconContainer]}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => setBackgroundModel(true)}>
                <IconGen size={80} backgroundColor={Colors.primary} name={"book-open-page-variant"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{character.name}'s Story</AppText>
                </View>
            </TouchableOpacity>
            <Modal visible={backgroundModel} animationType="slide">
                <SheetBackStory character={character} isDm={isDm} closeModal={() => setBackgroundModel(false)} navigation={navigation} />
            </Modal>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => setStatesModel(true)}>
                <IconGen size={80} backgroundColor={Colors.bitterSweetRed} name={"sword"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Ability Score &amp; Modifiers</AppText>
                </View>
            </TouchableOpacity>
            <Modal visible={statsModel} animationType="slide">
                <SheetStats character={character} closeModel={() => setStatesModel(false)} />
            </Modal>
            <TouchableOpacity style={{ alignItems: "center" }}
                onPress={() => { navigation.navigate("CharItems", { isDm: isDm ? character : null }) }}>
                <IconGen size={80} backgroundColor={Colors.danger} name={"sack"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Items And Currency</AppText>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    secRowIconContainer: {
        flex: .2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
});