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
import { PathSummonedCompanion } from '../../components/uniqueCharComponents/PathSummonedCompanion';
import pathCreatedCompanion from '../../../jsonDump/pathCreatedCompanion.json'
import { MonkKiPointCounter } from '../../components/uniqueCharComponents/MonkKiPointCounter';
import { RoguePhantomSkillPicks } from '../../components/uniqueCharComponents/RoguePhantomSkillPicks';
import logger from '../../../utility/logger';
import { ArtificerCurrentInfusedItems } from '../../components/uniqueCharComponents/ArtificerCurrentInfusedItems';
import { IconGen } from '../../components/IconGen';

interface UniqueCharStatsState {
    talesFromTheBeyondModal: boolean
    pathSummonedCompanionStatsModal: boolean,
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
            pathSummonedCompanionStatsModal: false,
            barbarianMagicModal: false,
            wildMagicModal: false,
            companionModal: false,
            maneuversModal: false,
            pickedManeuver: null,
            pickedMonkElement: null,
            monkElementModel: false
        }
    }
    userFeatureChoices = () => {
        try {
            let choices: any[] = []
            if (this.props.character.pathFeatures) {
                for (let charChoice of this.props.character.pathFeatures) {
                    if (charChoice.choice) {
                        charChoice.choice.forEach((item: any) => choices.push(item))
                    }
                }
            }
            return choices;
        } catch (err) {
            logger.log(new Error(err))
            return []
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
                {(this.props.character.path?.name === "College of Creation" && this.props.character.level && this.props.character.level >= 6 ||
                    this.props.character.path?.name === "Circle of Wildfire" && this.props.character.level && this.props.character.level >= 2 ||
                    this.props.character.path?.name === "Battle Smith" && this.props.character.level && this.props.character.level >= 3
                )
                    ?
                    <View>
                        <AppButton padding={10} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={pathCreatedCompanion[this.props.character.path?.name].name}
                            onPress={() => { this.setState({ pathSummonedCompanionStatsModal: true }) }} />
                        <Modal visible={this.state.pathSummonedCompanionStatsModal}>
                            <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                <View style={{ flex: .9 }}>
                                    <PathSummonedCompanion character={this.props.character} />
                                </View>
                                <View style={{ flex: .1 }}>
                                    <AppButton padding={10} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50} borderRadius={25} title={'Close'}
                                        onPress={() => { this.setState({ pathSummonedCompanionStatsModal: false }) }} />
                                </View>
                            </View>
                        </Modal>
                    </View>
                    : null}
                {this.props.character.characterClass === "Artificer" && this.props.character.level && this.props.character.level >= 2 &&
                    <ArtificerCurrentInfusedItems character={this.props.character} />
                }
                {this.props.character.path?.name === "Path of Wild Magic" &&
                    <UniqueRollLists modalContacts={wildBarbarianMagic.magicRolls} title={"Wild Magic"} />
                }

                {this.props.character.path?.name === "College of Spirits" &&
                    <UniqueRollLists modalContacts={talesFromTheBeyond.inspirationRolls} title={"Spirits' Tales"} />
                }

                {this.props.character.charSpecials && this.props.character.charSpecials.fightingStyle && this.props.character.charSpecials.fightingStyle.length > 0 ?
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
                {this.props.character.path?.name === "Arcane Archer" ?
                    this.userFeatureChoices().map((arrow: any, index: any) => <TouchableOpacity key={index} style={{ backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}
                        onPress={() => { this.setState({ maneuversModal: true, pickedManeuver: arrow }) }}>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{arrow.name}</AppText>
                        <View style={{ paddingRight: 10 }}>
                            <AppText>{arrow.description.substring(0, 80)}...</AppText>
                        </View>
                    </TouchableOpacity>)
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.battleMasterManeuvers && this.props.character.charSpecials.battleMasterManeuvers.length > 0 ?
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
                    </View>
                    : null
                }
                {this.props.character.charSpecials && this.props.character.charSpecials.artificerInfusions && this.props.character.charSpecials.artificerInfusions.length > 0 ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginTop: 15 }]}>
                        <AppText textAlign={'left'} color={Colors.bitterSweetRed} fontSize={22}>Infusions:</AppText>
                        {this.props.character.charSpecials.artificerInfusions.map(infusion =>
                            <TouchableOpacity key={infusion.name} style={{ backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries, borderWidth: 1, borderRadius: 15, padding: 10, margin: 5 }}
                                onPress={() => { this.setState({ maneuversModal: true, pickedManeuver: infusion }) }}>
                                <AppText fontSize={20} color={Colors.bitterSweetRed}>{infusion.name}</AppText>
                                <View style={{ paddingRight: 10 }}>
                                    <AppText>{infusion.description.substring(0, 80)}...</AppText>
                                </View>
                            </TouchableOpacity>)}
                    </View>
                    : null
                }
                <Modal visible={this.state.maneuversModal} animationType={'slide'}>
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
                {this.props.character.charSpecials && this.props.character.charSpecials.rageAmount ?
                    <BarbarianRageCounter character={this.props.character} />
                    : null
                }
                {this.props.character.characterClass === "Bard" ?
                    <BardInspirationCounter character={this.props.character} />
                    : null}
                {this.props.character.path?.name === "Phantom" ?
                    <RoguePhantomSkillPicks character={this.props.character} currentProficiency={this.props.proficiency} />
                    : null}
                {this.props.character.characterClass === "Paladin" ?
                    <PaladinLayOnHandsCounter character={this.props.character} />
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.martialPoints ?
                    <View>
                        {this.props.character.charSpecials.kiPoints ?
                            <MonkKiPointCounter character={this.props.character} />
                            : null}
                        <View>
                            <AppText fontSize={18} textAlign={"center"}>Martial hit die - 1D{this.props.character.charSpecials.martialPoints}</AppText>
                        </View>
                    </View>
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.monkElementsDisciplines && this.props.character.charSpecials.monkElementsDisciplines.length > 0 ?
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
                {this.props.character.charSpecials && this.props.character.charSpecials.sneakAttackDie ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Sneak Attack Die -</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.sneakAttackDie}D6</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.sorceryPoints ?
                    <View style={{ flexDirection: 'row' }}>
                        <AppText fontSize={20}>Your max sorcery points -</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.sorceryPoints}</AppText>
                    </View>
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.sorcererMetamagic && this.props.character.charSpecials.sorcererMetamagic.length > 0 ?
                    this.props.character.charSpecials.sorcererMetamagic.map((magic: any, index: number) =>
                        <View key={index} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginBottom: 10 }]}>
                            <AppText fontSize={20}>{magic.name}</AppText>
                            <AppText>{magic.description}</AppText>
                        </View>)
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.eldritchInvocations && this.props.character.charSpecials.eldritchInvocations.length > 0 ?
                    <View>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>Eldritch Invocations</AppText>
                        {this.props.character.charSpecials.eldritchInvocations.map((invocation: any, index: number) =>
                            <View key={index} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode, marginBottom: 10 }]}>
                                <AppText fontSize={20}>{invocation.name}</AppText>
                                <AppText>{invocation.entries}</AppText>
                            </View>)}
                    </View>
                    : null}
                {this.props.character.charSpecials && this.props.character.charSpecials.warlockPactBoon ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                        <AppText>Pact:</AppText>
                        <AppText fontSize={20} color={Colors.bitterSweetRed}>{this.props.character.charSpecials.warlockPactBoon.name}</AppText>
                        <View style={{ paddingRight: 10 }}>
                            <AppText fontSize={15}>{this.props.character.charSpecials.warlockPactBoon.description.replace(/\. /g, '.\n\n')}</AppText>
                        </View>
                    </View>
                    : null}
                <View style={{ marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center" }}>
                    <AppText fontSize={20} textAlign={'center'}>Companions</AppText>
                    <TouchableOpacity onPress={() => this.setState({ companionModal: true })}>
                        <IconGen size={80} name={'dog'} iconColor={Colors.whiteInDarkMode} backgroundColor={Colors.bitterSweetRed} />
                    </TouchableOpacity>
                </View>
                <Modal animationType={"slide"} visible={this.state.companionModal}>
                    <PickCompanion isDm={this.props.isDm} proficiency={this.props.proficiency} character={this.props.character} closeModal={(val: boolean) => { this.setState({ companionModal: val }) }} />
                </Modal>
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