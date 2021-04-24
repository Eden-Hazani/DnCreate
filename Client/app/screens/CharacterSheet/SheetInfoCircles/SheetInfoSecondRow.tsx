import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components/AppText';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import useAnimateSection from '../../../hooks/useAnimatedSection';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel
    navigation: any
    isDm: boolean
}

export function SheetInfoSecondRow({ navigation, character, isDm }: Props) {
    const animatedStatus = useAnimateSection(-800, 150)
    return (
        <Animated.View style={[animatedStatus.getLayout(), styles.secRowIconContainer]}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { navigation.navigate("CharFeatures", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.shadowBlue} name={"pentagon"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Features</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { navigation.navigate("CharFeats", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.orange} name={"atlassian"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Feats</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDm} style={{ alignItems: "center" }} onPress={() => { navigation.navigate("Spells", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.berries} name={"fire"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Spell Book</AppText>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    secRowIconContainer: {
        flex: .2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
});