import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CharacterModel } from '../../models/characterModel';
import AsyncStorage from '@react-native-community/async-storage';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';


export class UniqueCharStats extends Component<{ character: CharacterModel }> {
    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <AppText fontSize={30}>{this.props.character.characterClass} Stats</AppText>
                </View>
                {this.props.character.path ?
                    <View style={{ padding: 10 }}>
                        <AppText>Path Chosen:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.path}</AppText>
                    </View>
                    :
                    null}

                {this.props.character.charSpecials.fightingStyle ?
                    <View style={styles.statContainer}>
                        <AppText>Fighting Style:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.fightingStyle.name}</AppText>
                        <View style={{ paddingRight: 10 }}>
                            <AppText>{this.props.character.charSpecials.fightingStyle.description}</AppText>
                        </View>
                    </View>
                    : null
                }
                {this.props.character.charSpecials.martialPoints ?
                    <View>
                        {this.props.character.charSpecials.kiPoints ?
                            <View style={{ flexDirection: 'row' }}>
                                <AppText fontSize={20}>Your max ki points -</AppText>
                                <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.kiPoints}</AppText>
                            </View>
                            : null}
                        <View style={{ paddingRight: 10 }}>
                            <AppText fontSize={18}>Martial hit die - 1D{this.props.character.charSpecials.martialPoints}</AppText>
                        </View>
                    </View>
                    : null}
                {this.props.character.charSpecials.sneakAttackDie ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Sneak Attack Die -</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.sneakAttackDie}D6</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials.sorceryPoints ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Your max sorcery points -</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.sorceryPoints}</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials.sorcererMetamagic.length > 0 ?
                    this.props.character.charSpecials.sorcererMetamagic.map((magic: any, index: number) =>
                        <View key={index} style={[styles.statContainer, { marginBottom: 10 }]}>
                            <AppText fontSize={20}>{magic.name}</AppText>
                            <AppText>{magic.description}</AppText>
                        </View>)
                    : null}
                {this.props.character.charSpecials.eldritchInvocations.length > 0 ?
                    <View>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>Eldritch Invocations</AppText>
                        {this.props.character.charSpecials.eldritchInvocations.map((invocation: any, index: number) =>
                            <View key={index} style={[styles.statContainer, { marginBottom: 10 }]}>
                                <AppText fontSize={20}>{invocation.name}</AppText>
                                <AppText>{invocation.entries}</AppText>
                            </View>)}
                    </View>
                    : null}
                {this.props.character.charSpecials.warlockPactBoon ?
                    <View style={styles.statContainer}>
                        <AppText>Pact:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.warlockPactBoon.name}</AppText>
                        <View style={{ paddingRight: 10 }}>
                            <AppText fontSize={15}>{this.props.character.charSpecials.warlockPactBoon.description.replace(/\. /g, '.\n\n')}</AppText>
                        </View>
                    </View>
                    : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginTop: 20,

    },
    statContainer: {
        borderColor: colors.black,
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    }
});