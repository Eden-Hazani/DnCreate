import React, { Component } from 'react';
import { View, StyleSheet, Switch, Dimensions, TouchableOpacity } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';

interface FeatOptionsState {
    weaponsProfWindow: boolean
    armorProfWindow: boolean
    abilityPointsImprove: boolean
    character: CharacterModel
    weaponProfArray: any[]
    armorProfArray: any[]
    abilityClicked: number[]
    strength: number
    constitution: number
    dexterity: number
    intelligence: number
    wisdom: number
    charisma: number

}


export class FeatOptions extends Component<{ featName: any, featDescription: any, resetAbilityScore: any, resetList: any, weaponsProfChange: any, armorProfChange: any, attributePointsChange: any, character: CharacterModel }, FeatOptionsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            abilityClicked: [0, 0, 0, 0, 0, 0],
            armorProfArray: [],
            weaponProfArray: [],
            weaponsProfWindow: false,
            armorProfWindow: false,
            abilityPointsImprove: false,
            character: this.props.character,
            strength: this.props.character.strength,
            dexterity: this.props.character.dexterity,
            constitution: this.props.character.constitution,
            intelligence: this.props.character.intelligence,
            wisdom: this.props.character.wisdom,
            charisma: this.props.character.charisma,
        }
    }

    setWeaponProf = (text: string) => {
        this.props.weaponsProfChange(text)
    }
    setArmorProf = (text: string) => {
        this.props.armorProfChange(text)
    }

    pickAbilityPoints = (ability: any, index: number) => {
        if (this.state[ability] === 20) {
            alert(`Max 20 ability points`)
            return;
        }
        this.setState({ [ability]: this.state[ability] + 1 } as any, () => {
            this.props.attributePointsChange(ability, this.state[ability])
        })
    }

    removeAbilityPoints = (ability: any, index: number) => {
        if (this.state[ability] === this.state.character[ability]) {
            return;
        }
        this.setState({ [ability]: this.state[ability] - 1 } as any, () => {
            this.props.attributePointsChange(ability, this.state[ability])
        })
    }

    listStats = () => {
        const stats: any[] = [];
        stats.push(['strength', this.state.strength])
        stats.push(['constitution', this.state.constitution])
        stats.push(['dexterity', this.state.dexterity])
        stats.push(['intelligence', this.state.intelligence])
        stats.push(['wisdom', this.state.wisdom])
        stats.push(['charisma', this.state.charisma]);
        return stats
    }

    resetAbilityScore = () => {
        this.setState({
            strength: this.props.character.strength,
            dexterity: this.props.character.dexterity,
            constitution: this.props.character.constitution,
            intelligence: this.props.character.intelligence,
            wisdom: this.props.character.wisdom,
            charisma: this.props.character.charisma
        }, () => {
            this.props.resetAbilityScore()
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={20} textAlign={'center'}>On the way to earning a feat!</AppText>
                <AppText fontSize={18} textAlign={'center'}>In the field below please fill in a description of your chosen feat, please take the time and talk with your DM regarding the many kinds of feats available online.</AppText>
                <AppTextInput placeholder={"Feat name"} iconName={"text"} onChangeText={(text: string) => { this.props.featName(text) }} />
                <AppTextInput placeholder={"Feat description"} iconName={"text"} numberOfLines={5} multiline={true} textAlignVertical={"top"} onChangeText={(text: string) => { this.props.featDescription(text) }} />
                <View style={[styles.switchBox, { flexDirection: 'row', width: '50%', paddingLeft: 20 }]}>
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add weapon proficiency?</AppText>
                    <Switch value={this.state.weaponsProfWindow} onValueChange={() => {
                        if (this.state.weaponsProfWindow) {
                            this.setState({ weaponsProfWindow: false }, () => {
                                this.props.resetList('weaponProfArray')
                            })
                            return;
                        }
                        this.setState({ weaponsProfWindow: true })
                    }} />
                </View>
                {this.state.weaponsProfWindow &&
                    <View>
                        <AppText fontSize={18} textAlign={'center'}>Please enter your new weapon proficiency.</AppText>
                        <AppText fontSize={14} textAlign={'center'}>If you need to add multiple proficiencies use comma to separate them</AppText>
                        <AppTextInput placeholder={"name"} iconName={"text"} onChangeText={(text: string) => { this.setWeaponProf(text) }} />
                    </View>
                }
                <View style={[styles.switchBox, { flexDirection: 'row', width: '50%', paddingLeft: 20 }]}>
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add armor proficiency?</AppText>
                    <Switch value={this.state.armorProfWindow} onValueChange={() => {
                        if (this.state.armorProfWindow) {
                            this.setState({ armorProfWindow: false }, () => {
                                this.props.resetList('armorProfArray')
                            })
                            return;
                        }
                        this.setState({ armorProfWindow: true })
                    }} />
                </View>
                {this.state.armorProfWindow &&
                    <View>
                        <AppText fontSize={18} textAlign={'center'}>Please enter your new armor proficiency.</AppText>
                        <AppText fontSize={14} textAlign={'center'}>If you need to add multiple proficiencies use comma to separate them</AppText>
                        <AppTextInput placeholder={"name"} iconName={"text"} onChangeText={(text: string) => { this.setArmorProf(text) }} />
                    </View>
                }
                <View style={[styles.switchBox, { flexDirection: 'row', width: '50%', paddingLeft: 20 }]}>
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add any Ability Scores?</AppText>
                    <Switch value={this.state.abilityPointsImprove} onValueChange={() => {
                        if (this.state.abilityPointsImprove) {
                            this.setState({ abilityPointsImprove: false }, () => {
                                this.resetAbilityScore()
                            })
                            return;
                        }
                        this.setState({ abilityPointsImprove: true })
                    }} />
                </View>
                {this.state.abilityPointsImprove &&
                    <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
                        {this.listStats().map((item, index) =>
                            <View key={index} style={{ width: Dimensions.get('screen').width / 2, paddingHorizontal: Dimensions.get('screen').width / 12 }}>
                                <View style={{ flexDirection: 'row', position: 'absolute', alignSelf: 'center' }}>
                                    <TouchableOpacity style={{ marginRight: 33 }} onPress={() => { this.pickAbilityPoints(item[0], index) }}>
                                        <IconGen size={55} backgroundColor={colors.shadowBlue} name={'plus'} iconColor={colors.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginLeft: 33 }} onPress={() => { this.removeAbilityPoints(item[0], index) }}>
                                        <IconGen size={55} backgroundColor={colors.orange} name={'minus'} iconColor={colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.innerModifier}>
                                    <AppText fontSize={18} color={colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
                                    <View style={{ paddingTop: 10 }}>
                                        <AppText fontSize={25} textAlign={"center"}>{`${item[1]}`}</AppText>
                                    </View>
                                </View>
                            </View>)}
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    innerModifier: {
        width: 120,
        height: 120,
        backgroundColor: colors.bitterSweetRed,
        borderRadius: 120,
        justifyContent: "center"
    },
    switchBox: {
        paddingBottom: 25
    }
});