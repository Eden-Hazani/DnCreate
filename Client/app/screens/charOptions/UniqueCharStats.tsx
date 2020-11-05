import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CharacterModel } from '../../models/characterModel';
import AsyncStorage from '@react-native-community/async-storage';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { AppButton } from '../../components/AppButton';
import { AppCompanion } from '../../components/AppCompanion';
import { PickCompanion } from '../../components/PickCompanion';
import wildSurge from '../../../jsonDump/wildMagicList.json'

interface UniqueCharStatsState {
    monkElementModel: boolean
    pickedMonkElement: any
    maneuversModal: boolean
    pickedManeuver: any
    companionModal: boolean
    wildMagicModal: boolean
}


export class UniqueCharStats extends Component<{ character: CharacterModel, proficiency: any }, UniqueCharStatsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            wildMagicModal: false,
            companionModal: false,
            maneuversModal: false,
            pickedManeuver: null,
            pickedMonkElement: null,
            monkElementModel: false
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ marginBottom: 10 }}>
                    <AppText fontSize={30}>{this.props.character.characterClass} Stats</AppText>
                </View>
                {this.props.character.path ?
                    <View style={{ padding: 10 }}>
                        <AppText fontSize={22}>Path Chosen:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.path.name}</AppText>
                        <AppText fontSize={15} color={colors.black}>{this.props.character.path.description.replace(/\. /g, '.\n\n')}</AppText>
                    </View>
                    :
                    null}
                {this.props.character.path?.name === "Wild Magic" &&
                    <View>
                        <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Wild Magic Effects'}
                            onPress={() => { this.setState({ wildMagicModal: true }) }} />
                        <Modal visible={this.state.wildMagicModal} animationType='slide'>
                            {this.state.wildMagicModal &&
                                <ScrollView style={{ padding: 20 }}>
                                    <AppText color={colors.berries} textAlign={'center'} fontSize={18}>List of Wild Magic Surge, roll result and effect</AppText>
                                    {wildSurge.wildMagic.map((magic, index) =>
                                        <View key={index}>
                                            <AppText fontSize={20} textAlign={'center'} color={colors.berries}>{magic.roll}</AppText>
                                            <View style={{ padding: 10, backgroundColor: colors.pinkishSilver, borderWidth: 1, borderColor: colors.berries, borderRadius: 25 }}>
                                                <AppText fontSize={16} textAlign={'center'}>{magic.effect}</AppText>
                                            </View>
                                        </View>)}
                                </ScrollView>
                            }
                            <View>
                                <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Close'}
                                    onPress={() => { this.setState({ wildMagicModal: false }) }} />
                            </View>
                        </Modal>
                    </View>
                }
                {this.props.character.charSpecials.fightingStyle.length > 0 ?
                    <View style={styles.statContainer}>
                        <AppText>Fighting Style:</AppText>
                        {this.props.character.charSpecials.fightingStyle.map(fight =>
                            <View key={fight.name}>
                                <AppText fontSize={20} color={colors.bitterSweetRed}>{fight.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText>{fight.description}</AppText>
                                </View>
                            </View>)}
                    </View>
                    : null
                }
                {this.props.character.charSpecials.battleMasterManeuvers.length > 0 ?
                    <View style={[styles.statContainer, { marginTop: 15 }]}>
                        <AppText textAlign={'left'} color={colors.bitterSweetRed} fontSize={22}>Maneuvers:</AppText>
                        {this.props.character.charSpecials.battleMasterManeuvers.map(maneuver =>
                            <TouchableOpacity key={maneuver.name} style={{ backgroundColor: colors.pinkishSilver, borderColor: colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}
                                onPress={() => { this.setState({ maneuversModal: true, pickedManeuver: maneuver }) }}>
                                <AppText fontSize={20} color={colors.bitterSweetRed}>{maneuver.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText>{maneuver.description.substring(0, 80)}...</AppText>
                                </View>
                            </TouchableOpacity>)}
                        <Modal visible={this.state.maneuversModal}>
                            {this.state.pickedManeuver &&
                                <View style={{ flex: 1 }}>
                                    <View style={{ padding: 20, flex: .8 }}>
                                        <AppText textAlign={'center'} fontSize={25} color={colors.bitterSweetRed}>{this.state.pickedManeuver.name}</AppText>
                                        <AppText textAlign={'center'} fontSize={19}>{this.state.pickedManeuver.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                    </View>
                                    <View style={{ flex: .2 }}>
                                        <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'close'} onPress={() => { this.setState({ maneuversModal: false, pickedManeuver: null }) }} />
                                    </View>
                                </View>
                            }
                        </Modal>
                    </View>
                    : null
                }
                {this.props.character.charSpecials.rageAmount ?
                    <View style={styles.statContainer}>
                        <AppText>Rage Amount:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.rageAmount}</AppText>
                        <AppText>Rage bonus damage:</AppText>
                        <AppText fontSize={20} color={colors.bitterSweetRed}>{this.props.character.charSpecials.rageDamage}</AppText>
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
                {this.props.character.charSpecials.monkElementsDisciplines.length > 0 ?
                    <View>
                        <AppText color={colors.bitterSweetRed} textAlign={'center'} fontSize={25}>Elements Disciplines:</AppText>
                        {this.props.character.charSpecials.monkElementsDisciplines.map(elements =>
                            <TouchableOpacity onPress={() => { this.setState({ monkElementModel: true, pickedMonkElement: elements }) }}
                                key={elements.name} style={{ backgroundColor: colors.pinkishSilver, borderColor: colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}>
                                <AppText fontSize={22} color={colors.totalWhite}>{elements.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText fontSize={17}>{elements.description.substring(0, 80)}...</AppText>
                                </View>
                            </TouchableOpacity>)}
                        <Modal visible={this.state.monkElementModel}>
                            {this.state.pickedMonkElement &&
                                <View style={{ flex: 1 }}>
                                    <View style={{ padding: 20, flex: .8 }}>
                                        <AppText textAlign={'center'} fontSize={25} color={colors.bitterSweetRed}>{this.state.pickedMonkElement.name}</AppText>
                                        <AppText textAlign={'center'} fontSize={19}>{this.state.pickedMonkElement.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                    </View>
                                    <View style={{ flex: .2 }}>
                                        <AppButton fontSize={20} backgroundColor={colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'close'} onPress={() => { this.setState({ monkElementModel: false, pickedMonkElement: null }) }} />
                                    </View>
                                </View>
                            }
                        </Modal>
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
                <View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <AppButton fontSize={16} backgroundColor={colors.bitterSweetRed} width={120} height={50}
                            borderRadius={25} title={'Companions'} onPress={() => { this.setState({ companionModal: true }) }} />
                    </View>
                    <Modal animationType={"slide"} visible={this.state.companionModal}>
                        <PickCompanion proficiency={this.props.proficiency} character={this.props.character} closeModal={(val: boolean) => { this.setState({ companionModal: val }) }} />
                    </Modal>
                </View>
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