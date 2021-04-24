import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface Props {
    character: CharacterModel
    navigation: any
}

export function SheetLanguages({ character, navigation }: Props) {
    return (
        <View>
            <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Languages:</AppText>
            {character.languages &&
                <View style={[styles.list, { width: '100%', flexDirection: 'row', justifyContent: "space-evenly" }]}>
                    <View>
                        {character.languages.map((lang, index) =>
                            <View key={index} style={[styles.items, { borderColor: Colors.bitterSweetRed, maxHeight: 30 }]}>
                                <AppText>{lang}</AppText>
                            </View>
                        )}
                    </View>
                    <View style={{ paddingLeft: 15 }}>
                        <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                            width={110} height={60} borderRadius={25} title={'Change Languages'}
                            onPress={() => { navigation.navigate("ReplaceLanguages", { char: character }) }} />
                    </View>
                </View>
            }
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