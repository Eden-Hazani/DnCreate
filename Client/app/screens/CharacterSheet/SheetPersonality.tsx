import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface Props {
    character: CharacterModel;
    navigation: any;
    isDm: boolean;
}

export function SheetPersonality({ character, navigation, isDm }: Props) {
    return (
        <View >
            <View style={styles.personality}>
                <View style={{ width: '30%', paddingLeft: 18 }}>
                    <AppText textAlign={'center'}>To change any your personality traits, alignment, or appearance long press on the text you wish to change.</AppText>
                </View>
                <View style={styles.list}>
                    <TouchableOpacity disabled={isDm} onLongPress={() => { navigation.navigate("CharPersonalityTraits", { updateTraits: true, character: character }) }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Traits:</AppText>
                    </TouchableOpacity>
                    {character.personalityTraits && character.personalityTraits.map((trait, index) => <AppText key={index}>{`${index + 1}. ${trait}`}</AppText>)}
                </View>
                <View style={styles.list}>
                    <TouchableOpacity disabled={isDm} onLongPress={() => { navigation.navigate("CharIdeals", { updateIdeals: true, character: character }) }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Ideals:</AppText>
                    </TouchableOpacity>
                    {character.ideals && character.ideals.map((ideal, index) => <AppText key={index}>{`${index + 1}. ${ideal}`}</AppText>)}
                </View>
                <View style={styles.list}>
                    <TouchableOpacity disabled={isDm} onLongPress={() => { navigation.navigate("CharFlaws", { updateFlaws: true, character: character }) }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Flaws:</AppText>
                        {character.flaws && character.flaws.map((flaw, index) => <AppText key={index}>{`${index + 1}. ${flaw}`}</AppText>)}
                    </TouchableOpacity>
                </View>
                <View style={styles.list}>
                    <TouchableOpacity disabled={isDm} onLongPress={() => { navigation.navigate("CharBonds", { updateBonds: true, character: character }) }}>
                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Bonds:</AppText>
                        {character.bonds && character.bonds.map((bond, index) => <AppText key={index}>{`${index + 1}. ${bond}`}</AppText>)}
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity disabled={isDm} onLongPress={() => navigation.navigate("CharacterAlignment", { updateAlignment: true, character: character })}
                style={{ alignItems: "center", marginBottom: 20 }}>
                <AppText fontSize={26} color={Colors.bitterSweetRed} textAlign={"center"}>Alignment</AppText>
                {character.characterAlignment ?
                    <View>
                        {character.characterAlignment.alignment && character.characterAlignment.alignment.length > 0 ?
                            <AppText fontSize={20} textAlign={'center'}>{character.characterAlignment.alignment}</AppText>
                            :
                            null}
                        {character.characterAlignment.alignmentDescription && character.characterAlignment.alignmentDescription.length > 0 ?
                            <AppText fontSize={16} textAlign={'center'}>{character.characterAlignment?.alignmentDescription}</AppText>
                            :
                            null}
                    </View>
                    : null}
            </TouchableOpacity>
            <TouchableOpacity disabled={isDm} onLongPress={() => navigation.navigate("CharacterAppearance", { updateAppearance: true, character: character })}
                style={{ alignItems: "center", marginBottom: 20 }}>
                <AppText fontSize={26} color={Colors.bitterSweetRed} textAlign={"center"}>Appearance</AppText>
                {(character.characterAppearance || character.characterAppearance !== '') && <AppText textAlign={'center'} fontSize={15}>{character.characterAppearance}</AppText>}
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%"
    },
    personality: {
        justifyContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: "row",
    }
});