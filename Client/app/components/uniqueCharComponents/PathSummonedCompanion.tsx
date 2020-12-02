import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../config/colors';
import { AppText } from '../AppText';
import pathCreatedCompanion from '../../../jsonDump/pathCreatedCompanion.json'
import { CharacterModel } from '../../models/characterModel';

export class PathSummonedCompanion extends Component<{ character: CharacterModel }> {
    render() {
        const character = this.props.character.path.name;
        return (
            <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
                    <AppText padding={15} textAlign={'center'} fontSize={25}>Animating Performance Item Stats</AppText>
                    <AppText textAlign={'center'} fontSize={18}>{pathCreatedCompanion[character].armorClass}</AppText>
                    <AppText textAlign={'center'} fontSize={18}>{pathCreatedCompanion[character].hitPoints}</AppText>
                    <AppText textAlign={'center'} fontSize={18}>{pathCreatedCompanion[character].speed}</AppText>
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Actions -</AppText>
                    {pathCreatedCompanion[character].actions.map((action: any, index: any) => <View key={index}>
                        <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>- {action.name} -</AppText>
                        <AppText textAlign={'center'} fontSize={18}> {action.description}</AppText>
                    </View>)}
                    <View style={{ padding: 15, borderWidth: 1, borderColor: Colors.black, borderRadius: 15 }}>
                        <AppText fontSize={22} color={Colors.bitterSweetRed}>Attributes:</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].str}</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].dex}</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].con}</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].int}</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].wiz}</AppText>
                        <AppText fontSize={18} color={Colors.berries}>{pathCreatedCompanion[character].cha}</AppText>
                    </View>
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Damage Immunities -</AppText>
                    {pathCreatedCompanion[character].damageImmune.map((immune: any, index: any) => <View key={index}>
                        <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>{immune}</AppText>
                    </View>)}
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Condition Immunities -</AppText>
                    {pathCreatedCompanion[character].conditionImmune.map((immune: any, index: any) => <View key={index}>
                        <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>{immune}</AppText>
                    </View>)}
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Senses -</AppText>
                    <AppText textAlign={'center'} fontSize={18}>{pathCreatedCompanion[character].senses}</AppText>
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Languages -</AppText>
                    {pathCreatedCompanion[character].languages.map((lan: any, index: any) => <View key={index}>
                        <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>{lan}</AppText>
                    </View>)}
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Proficiency Bonus -</AppText>
                    <AppText textAlign={'center'} fontSize={18}>{pathCreatedCompanion[character].proficiency}</AppText>
                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Abilities -</AppText>
                    {pathCreatedCompanion[character].abilities.map((ability: any, index: any) => <View key={index}>
                        <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>{ability.name}</AppText>
                        <AppText textAlign={'center'} fontSize={18} >{ability.description}</AppText>
                    </View>)}
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
    }
});