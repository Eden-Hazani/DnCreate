import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CharacterModel } from '../../models/characterModel';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { AppButton } from '../../components/AppButton';
import { PickCompanion } from '../../components/PickCompanion';
import wildSurge from '../../../jsonDump/wildMagicList.json'
import wildBarbarianMagic from '../../../jsonDump/barbarianWildMagicList.json'
import talesFromTheBeyond from '../../../jsonDump/talesFromTheBeyondList.json'
import { PaladinLayOnHandsCounter } from '../../components/uniqueCharComponents/PaladinLayOnHandsCounter';
import { BarbarianRageCounter } from '../../components/uniqueCharComponents/BarbarianRageCounter';
import { BardInspirationCounter } from '../../components/uniqueCharComponents/BardInspirationCounter';
import { UniqueRollLists } from '../../components/UniqueRollLists';

interface UniqueCharStatsState {
    talesFromTheBeyondModal: boolean
    bardAnimatedDancingItem: boolean,
    monkElementModel: boolean
    pickedMonkElement: any
    maneuversModal: boolean
    pickedManeuver: any
    companionModal: boolean
    wildMagicModal: boolean
    barbarianMagicModal: boolean
}


export class UniqueCharStats extends Component<{ isDm: boolean, character: CharacterModel, proficiency: any }, UniqueCharStatsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            talesFromTheBeyondModal: false,
            bardAnimatedDancingItem: false,
            barbarianMagicModal: false,
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
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.path.name}</AppText>
                        <AppText fontSize={15} color={Colors.whiteInDarkMode}>{this.props.character.path.description.replace(/\. /g, '.\n\n')}</AppText>
                    </View>
                    :
                    null}
                {this.props.character.path?.name === "Wild Magic" &&
                    <UniqueRollLists modalContacts={wildSurge.wildMagic} title={"Wild Magic"} />
                }
                {this.props.character.path?.name === "College of Creation" && this.props.character.level >= 6 ?
                    <View>
                        <AppButton padding={10} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Animated dancing'}
                            onPress={() => { this.setState({ bardAnimatedDancingItem: true }) }} />
                        <Modal visible={this.state.bardAnimatedDancingItem}>
                            <ScrollView style={{ padding: 20, backgroundColor: Colors.pageBackground }}>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <AppText padding={15} textAlign={'center'} fontSize={25}>Animating Performance Item Stats</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>Armor class: 16 (natural armor)</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>Hit Points: 10 + 5 times your bard level</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>Speed: 30 ft., fly 30 ft. (hover)</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Actions -</AppText>
                                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>- Force Empowered Slam -</AppText>
                                    <AppText textAlign={'center'} fontSize={18}> Melee Weapon Attack: your spell attack modifier to hit {'\n'} reach 5 ft., one target you can see. Hit: 1d10 + proficiency bonus force damage.</AppText>
                                    <View style={{ padding: 15, borderWidth: 1, borderColor: Colors.black, borderRadius: 15 }}>
                                        <AppText fontSize={22} color={Colors.bitterSweetRed}>Attributes:</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>STR - 18(+4)</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>DEX - 14(+2)</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>CON - 16(+3)</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>INT - 4(-3)</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>WIZ - 10(+0)</AppText>
                                        <AppText fontSize={18} color={Colors.berries}>CHA - 6(-2)</AppText>
                                    </View>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Damage Immunities -</AppText>
                                    <AppText textAlign={'center'} fontSize={18} > poison, psychic</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Condition Immunities -</AppText>
                                    <AppText textAlign={'center'} fontSize={18} > charmed, exhaustion, poisoned, frightened.</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Senses -</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>Darkvision 60 ft., passive Perception 10.</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Languages -</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>understands the languages you speak.</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Proficiency Bonus -</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>equals your bonus.</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Immutable Form -</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>The item is immune to any spell or effect that would alter its form.</AppText>
                                    <AppText textAlign={'center'} fontSize={22} color={Colors.bitterSweetRed}>- Irrepressible Dance - </AppText>
                                    <AppText textAlign={'center'} fontSize={18} >Irrepressible Dance. When any creature starts its turn within 10 feet of the item, the item can increase or decrease (your choice){`\n`}the walking speed of that creature by 10 feet until the end of the turn, provided the item isn't incapacitated.</AppText>
                                    <AppButton padding={25} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Close'}
                                        onPress={() => { this.setState({ bardAnimatedDancingItem: false }) }} />
                                </View>
                            </ScrollView>
                        </Modal>
                    </View>
                    : null}

                {this.props.character.path?.name === "Path of Wild Magic" &&
                    <UniqueRollLists modalContacts={wildBarbarianMagic.magicRolls} title={"Wild Magic"} />
                }

                {this.props.character.path?.name === "College of Spirits" &&
                    <UniqueRollLists modalContacts={talesFromTheBeyond.inspirationRolls} title={"Spirits' Tales"} />
                }

                {this.props.character.charSpecials.fightingStyle.length > 0 ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                        <AppText>Fighting Style:</AppText>
                        {this.props.character.charSpecials.fightingStyle.map(fight =>
                            <View key={fight.name}>
                                <AppText fontSize={20} color={Colors.bitterSweetRed}>{fight.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText>{fight.description}</AppText>
                                </View>
                            </View>)}
                    </View>
                    : null
                }
                {this.props.character.charSpecials.battleMasterManeuvers.length > 0 ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginTop: 15 }]}>
                        <AppText textAlign={'left'} color={Colors.bitterSweetRed} fontSize={22}>Maneuvers:</AppText>
                        {this.props.character.charSpecials.battleMasterManeuvers.map(maneuver =>
                            <TouchableOpacity key={maneuver.name} style={{ backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}
                                onPress={() => { this.setState({ maneuversModal: true, pickedManeuver: maneuver }) }}>
                                <AppText fontSize={20} color={Colors.bitterSweetRed}>{maneuver.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText>{maneuver.description.substring(0, 80)}...</AppText>
                                </View>
                            </TouchableOpacity>)}
                        <Modal visible={this.state.maneuversModal}>
                            {this.state.pickedManeuver &&
                                <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                    <View style={{ padding: 20, flex: .8 }}>
                                        <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>{this.state.pickedManeuver.name}</AppText>
                                        <AppText textAlign={'center'} fontSize={19}>{this.state.pickedManeuver.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                    </View>
                                    <View style={{ flex: .2 }}>
                                        <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'close'} onPress={() => { this.setState({ maneuversModal: false, pickedManeuver: null }) }} />
                                    </View>
                                </View>
                            }
                        </Modal>
                    </View>
                    : null
                }
                {this.props.character.charSpecials.rageAmount ?
                    <BarbarianRageCounter character={this.props.character} />
                    : null
                }
                {this.props.character.characterClass === "Bard" ?
                    <BardInspirationCounter character={this.props.character} />
                    : null}

                {this.props.character.characterClass === "Paladin" ?
                    <PaladinLayOnHandsCounter character={this.props.character} />
                    : null}
                {this.props.character.charSpecials.martialPoints ?
                    <View>
                        {this.props.character.charSpecials.kiPoints ?
                            <View style={{ flexDirection: 'row' }}>
                                <AppText fontSize={20}>Your max ki points -</AppText>
                                <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.kiPoints}</AppText>
                            </View>
                            : null}
                        <View style={{ paddingRight: 10 }}>
                            <AppText fontSize={18}>Martial hit die - 1D{this.props.character.charSpecials.martialPoints}</AppText>
                        </View>
                    </View>
                    : null}
                {this.props.character.charSpecials.monkElementsDisciplines.length > 0 ?
                    <View>
                        <AppText color={Colors.bitterSweetRed} textAlign={'center'} fontSize={25}>Elements Disciplines:</AppText>
                        {this.props.character.charSpecials.monkElementsDisciplines.map(elements =>
                            <TouchableOpacity onPress={() => { this.setState({ monkElementModel: true, pickedMonkElement: elements }) }}
                                key={elements.name} style={{ backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}>
                                <AppText fontSize={22} color={Colors.totalWhite}>{elements.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText fontSize={17}>{elements.description.substring(0, 80)}...</AppText>
                                </View>
                            </TouchableOpacity>)}
                        <Modal visible={this.state.monkElementModel}>
                            {this.state.pickedMonkElement &&
                                <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                    <View style={{ padding: 20, flex: .8 }}>
                                        <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>{this.state.pickedMonkElement.name}</AppText>
                                        <AppText textAlign={'center'} fontSize={19}>{this.state.pickedMonkElement.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                                    </View>
                                    <View style={{ flex: .2 }}>
                                        <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'close'} onPress={() => { this.setState({ monkElementModel: false, pickedMonkElement: null }) }} />
                                    </View>
                                </View>
                            }
                        </Modal>
                    </View>
                    : null}
                {this.props.character.charSpecials.sneakAttackDie ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Sneak Attack Die -</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.sneakAttackDie}D6</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials.sorceryPoints ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Your max sorcery points -</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.sorceryPoints}</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials.sorcererMetamagic.length > 0 ?
                    this.props.character.charSpecials.sorcererMetamagic.map((magic: any, index: number) =>
                        <View key={index} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginBottom: 10 }]}>
                            <AppText fontSize={20}>{magic.name}</AppText>
                            <AppText>{magic.description}</AppText>
                        </View>)
                    : null}
                {this.props.character.charSpecials.eldritchInvocations.length > 0 ?
                    <View>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>Eldritch Invocations</AppText>
                        {this.props.character.charSpecials.eldritchInvocations.map((invocation: any, index: number) =>
                            <View key={index} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginBottom: 10 }]}>
                                <AppText fontSize={20}>{invocation.name}</AppText>
                                <AppText>{invocation.entries}</AppText>
                            </View>)}
                    </View>
                    : null}
                {this.props.character.charSpecials.warlockPactBoon ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                        <AppText>Pact:</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.warlockPactBoon.name}</AppText>
                        <View style={{ paddingRight: 10 }}>
                            <AppText fontSize={15}>{this.props.character.charSpecials.warlockPactBoon.description.replace(/\. /g, '.\n\n')}</AppText>
                        </View>
                    </View>
                    : null}
                <View>
                    <View style={{ marginTop: 10, marginBottom: 10 }}>
                        <AppButton fontSize={16} backgroundColor={Colors.bitterSweetRed} width={120} height={50}
                            borderRadius={25} title={'Companions'} onPress={() => { this.setState({ companionModal: true }) }} />
                    </View>
                    <Modal animationType={"slide"} visible={this.state.companionModal}>
                        <PickCompanion isDm={this.props.isDm} proficiency={this.props.proficiency} character={this.props.character} closeModal={(val: boolean) => { this.setState({ companionModal: val }) }} />
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
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    }
});