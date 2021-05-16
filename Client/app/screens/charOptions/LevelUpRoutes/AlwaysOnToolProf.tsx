import React, { Component, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/AppText';
import { CharacterModel } from '../../../models/characterModel';
import { turnOnAlwayExpertise } from './functions/additionalCharacterUpdates';

interface Props {
    character: CharacterModel
    returnUpdatedCharInfo: Function
}

export function AlwaysOnToolProf({ character, returnUpdatedCharInfo }: Props) {
    useEffect(() => {
        returnUpdatedCharInfo(turnOnAlwayExpertise(character))
    }, [])
    return (
        <View style={{ padding: 15 }}>
            <AppText fontSize={18} textAlign={'center'}>You have expertise with all your proficient tools, doubling your proficiency score for them</AppText>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});