import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { AppText } from '../../../components/AppText';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import useAnimateSection from '../../../hooks/useAnimatedSection';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel;
    isDm: boolean;
    navigation: any;
    proficiency: number
}


export function SheetInfoForthRow({ character, isDm, navigation, proficiency }: Props) {
    const animatedStatus = useAnimateSection(-800, 250)
    return (
        <Animated.View style={[animatedStatus.getLayout(), styles.secRowIconContainer]}>
            <TouchableOpacity disabled={isDm} style={{ alignItems: "center" }} onPress={() => { navigation.navigate("CreatePDF", { char: character, proficiency: proficiency }) }}>
                <IconGen size={80} backgroundColor={Colors.burgundy} name={"file-pdf-box"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Generate Pdf</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDm} style={{ alignItems: "center" }} onPress={() => { navigation.navigate("CharWeapons", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.pastelPink} name={"sword-cross"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Weapons</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity disabled={isDm} style={{ alignItems: "center" }} onPress={() => { navigation.navigate("CharEquipment", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.earthYellow} name={"necklace"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Wearable Equipment</AppText>
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
    }
});