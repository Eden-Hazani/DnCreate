import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { skillExpertiseCheck } from '../../../utility/skillExpertiseCheck';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface Props {
    character: CharacterModel
    currentProficiency: number
    navigation: any
}

export function SheetTools({ character, currentProficiency, navigation }: Props) {
    return (
        <View >
            <View style={[styles.list, { width: '100%' }]}>
                <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Tools:</AppText>
                {character.tools && character.tools.map((tool, index) =>
                    <View key={index} style={[styles.items, { borderColor: Colors.bitterSweetRed }]}>
                        <AppText>{`${tool[0]} +${(currentProficiency) + skillExpertiseCheck(tool[1], currentProficiency)}`}</AppText>
                    </View>
                )}
            </View>
            <View style={{ paddingTop: 5, alignSelf: "flex-start", paddingBottom: 10, paddingLeft: 25 }}>
                <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                    width={110} height={60} borderRadius={25} title={'Replace tool proficiencies'}
                    onPress={() => { navigation.navigate("ReplaceProficiencies", { char: character, profType: "tools" }) }} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%"
    },
    items: {
        borderRadius: 10,
        borderWidth: 1,
        width: 200,
        padding: 5,
        marginVertical: 2
    }
});