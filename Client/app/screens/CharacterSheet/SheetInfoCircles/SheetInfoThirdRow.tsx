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
}

export function SheetInfoThirdRow({ character, isDm, navigation }: Props) {
    const animatedStatus = useAnimateSection(-800, 200)
    return (
        <Animated.View style={[animatedStatus.getLayout(), styles.secRowIconContainer]}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { navigation.navigate("Armor", { char: character, isDm: isDm }) }}>
                <IconGen size={80} backgroundColor={Colors.paleGreen} name={"tshirt-crew"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Armor</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { navigation.navigate("PathFeatures", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.metallicBlue} name={"chart-arc"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Path Features</AppText>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { navigation.navigate("RaceFeatures", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.pinkishSilver} name={"human-handsdown"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Race Features</AppText>
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