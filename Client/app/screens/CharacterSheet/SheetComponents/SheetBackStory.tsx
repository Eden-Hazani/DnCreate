import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { BackgroundModal } from '../../../models/backgroundModal';
import { CharacterModel } from '../../../models/characterModel';

interface Props {
    character: CharacterModel
    isDm: boolean
    closeModal: Function
    navigation: any
}

export function SheetBackStory({ character, closeModal, isDm, navigation }: Props) {
    return (
        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
            <Image uri={`${Config.serverUrl}/assets/specificDragons/backstoryDragon.png`} style={{ width: 150, height: 150, alignSelf: "center" }} />
            <View style={{ flex: .8, padding: 25 }}>
                <AppText textAlign={"left"} fontSize={35} color={Colors.bitterSweetRed}>{`${character.name}'s Story`}</AppText>
                <AppText textAlign={"left"} fontSize={20}>{character.backStory}</AppText>
            </View>
            <View style={{ flex: .1, padding: 25 }}>
                <AppText textAlign={"left"} fontSize={25}>{character.background && character.background.backgroundName}</AppText>
                <View>
                    {character.background && character.background.backgroundFeatureName === '' ?
                        <View>
                            <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>No background feature.</AppText>
                        </View>
                        :
                        <View>
                            <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>Background feature</AppText>
                            <AppText textAlign={"left"} fontSize={20}>{character.background && character.background.backgroundFeatureName}</AppText>
                            <AppText textAlign={"left"} fontSize={17}>{character.background && character.background.backgroundFeatureDescription}</AppText>
                        </View>
                    }
                </View>
            </View>
            <View style={{ flex: .1, flexDirection: "row", justifyContent: "space-evenly", alignContent: "center" }}>
                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Close'} onPress={() => closeModal()} />
                <AppButton disabled={isDm} backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Update Story'} onPress={() => {
                    closeModal()
                    navigation.navigate("CharBackstory", { updateStory: true, character: character })
                }} />
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});