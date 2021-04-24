import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { sheetModifierListStat } from '../functions/statisticFunctions';

interface Props {
    character: CharacterModel
    closeModel: Function
}

export function SheetStats({ character, closeModel }: Props) {
    return (
        <View style={styles.container}>
            <View style={{ flex: .9, alignItems: "center", backgroundColor: Colors.pageBackground }}>
                <AppText color={Colors.bitterSweetRed} fontSize={35}>Stats</AppText>
                <AppText fontSize={30} >{`${character.race} ${character.characterClass}`}</AppText>
                <FlatList
                    data={sheetModifierListStat(character)}
                    keyExtractor={(stats: [string, number, number]) => stats[0].toString()}
                    numColumns={2}
                    renderItem={({ item }) =>
                        <View style={styles.modifier}>
                            <View style={[styles.innerModifier, { backgroundColor: Colors.bitterSweetRed }]}>
                                <AppText fontSize={18} color={Colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
                                <View style={{ paddingTop: 10 }}>
                                    <AppText textAlign={"center"}>{`Attribute score ${item[2]}`}</AppText>
                                </View>
                                <View style={{ paddingTop: 5 }}>
                                    <AppText textAlign={"center"}>Modifier</AppText>
                                    <AppText textAlign={"center"}>{item[1]}</AppText>
                                </View>
                            </View>
                        </View>
                    } />
            </View>
            <View style={{ flex: .1, backgroundColor: Colors.pageBackground }}>
                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'close'}
                    onPress={() => closeModel()} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    modifier: {
        width: "50%",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: "space-around",
    },
    innerModifier: {
        width: 150,
        height: 150,
        borderRadius: 110,
        justifyContent: "center"
    }
});