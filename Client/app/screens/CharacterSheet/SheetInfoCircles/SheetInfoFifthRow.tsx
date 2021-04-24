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

export function SheetInfoFifthRow({ character, isDm, navigation }: Props) {
    const animatedStatus = useAnimateSection(-900, 300)
    return (
        <Animated.View style={[animatedStatus.getLayout(), styles.secRowIconContainer]}>
            <TouchableOpacity disabled={isDm} style={{ alignItems: "center" }} onPress={() => { navigation.navigate("PersonalNotes", { char: character }) }}>
                <IconGen size={80} backgroundColor={Colors.primaryBackground} name={"feather"} iconColor={Colors.white} />
                <View style={{ width: 90, marginTop: 10 }}>
                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Personal notes</AppText>
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