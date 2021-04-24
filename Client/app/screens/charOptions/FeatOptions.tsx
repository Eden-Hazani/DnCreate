import React, { Component } from 'react';
import { View, StyleSheet, Switch, Dimensions, TouchableOpacity } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import skillList from '../../../jsonDump/skillList.json'
import toolList from '../../../jsonDump/toolList.json'
import abilityScores from '../../../jsonDump/abilityScores.json'
import { AppMultipleItemPicker } from '../../components/AppMultipleItemPicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSpecialSaveThrows } from '../../../utility/getSpecialSaveThrows';

interface FeatOptionsState {
    cashedSavingThrows: string[]
    alreadyPickedSavingThrows: boolean[]
    alreadyPickedSkills: boolean[]
    alreadyPickedTools: boolean[]
    weaponsProfWindow: boolean
    armorProfWindow: boolean
    savingThrowsWindow: boolean
    skillProfWindow: boolean
    toolProfWindow: boolean
    abilityPointsImprove: boolean
    resetClicked: string,
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


export class FeatOptions extends Component<{ savingThrowListChange: any, toolListChange: any, skillListChange: any, featName: any, featDescription: any, resetAbilityScore: any, resetList: any, weaponsProfChange: any, armorProfChange: any, attributePointsChange: any, character: CharacterModel }, FeatOptionsState> {
    constructor(props: any) {
        super(props)
        this.state = {
            savingThrowsWindow: false,
            cashedSavingThrows: [],
            toolProfWindow: false,
            alreadyPickedSavingThrows: [],
            alreadyPickedSkills: [],
            alreadyPickedTools: [],
            resetClicked: '',
            skillProfWindow: false,
            abilityClicked: [0, 0, 0, 0, 0, 0],
            armorProfArray: [],
            weaponProfArray: [],
            weaponsProfWindow: false,
            armorProfWindow: false,
            abilityPointsImprove: false,
            character: this.props.character,
            strength: this.props.character.strength ? this.props.character.strength : 0,
            dexterity: this.props.character.dexterity ? this.props.character.dexterity : 0,
            constitution: this.props.character.constitution ? this.props.character.constitution : 0,
            intelligence: this.props.character.intelligence ? this.props.character.intelligence : 0,
            wisdom: this.props.character.wisdom ? this.props.character.wisdom : 0,
            charisma: this.props.character.charisma ? this.props.character.charisma : 0,
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
            strength: this.props.character.strength ? this.props.character.strength : 0,
            dexterity: this.props.character.dexterity ? this.props.character.dexterity : 0,
            constitution: this.props.character.constitution ? this.props.character.constitution : 0,
            intelligence: this.props.character.intelligence ? this.props.character.intelligence : 0,
            wisdom: this.props.character.wisdom ? this.props.character.wisdom : 0,
            charisma: this.props.character.charisma ? this.props.character.charisma : 0
        }, () => {
            this.props.resetAbilityScore()
        })
    }

    loadCashedSavingThrows = async () => {
        if (!this.state.character.savingThrows || this.state.character.savingThrows.length === 0) {
            const character = { ...this.state.character };
            const cashedSavingThrows = await AsyncStorage.getItem(`${this.state.character._id}SavingThrows`);
            const savingThrows: any = cashedSavingThrows !== null ? getSpecialSaveThrows(this.state.character).concat(JSON.parse(cashedSavingThrows)) : getSpecialSaveThrows(this.state.character)
            this.setState({ cashedSavingThrows: savingThrows })
            return
        }
        this.setState({ cashedSavingThrows: this.state.character.savingThrows })
    }

    async componentDidMount() {
        await this.loadCashedSavingThrows()
        if (this.state.character.skills) {
            for (let item of this.state.character.skills) {
                if (skillList.skillList.includes(item[0])) {
                    const alreadyPickedSkills = this.state.alreadyPickedSkills;
                    alreadyPickedSkills[skillList.skillList.indexOf(item[0])] = true;
                    this.setState({ alreadyPickedSkills })
                }
            }
        }
        if (this.state.character.tools) {
            for (let item of this.state.character.tools) {
                if (toolList.tools.includes(item[0])) {
                    const alreadyPickedTools = this.state.alreadyPickedTools;
                    alreadyPickedTools[toolList.tools.indexOf(item[0])] = true;
                    this.setState({ alreadyPickedTools })
                }
            }
        }
        for (let item of this.state.cashedSavingThrows) {
            if (abilityScores.abilityScores.includes(item)) {
                const alreadyPickedSavingThrows = this.state.alreadyPickedSavingThrows;
                alreadyPickedSavingThrows[abilityScores.abilityScores.indexOf(item)] = true;
                this.setState({ alreadyPickedSavingThrows })
            }
        }
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
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add Skill proficiencies?</AppText>
                    <Switch value={this.state.skillProfWindow} onValueChange={() => {
                        if (this.state.skillProfWindow) {
                            this.setState({ resetClicked: 'skillList' }, () => {
                                this.props.resetList('featSkillList')
                                this.setState({ skillProfWindow: false }, () => {
                                    setTimeout(() => {
                                        this.setState({ resetClicked: "" })
                                    }, 500);
                                })
                            })
                            return;
                        }
                        this.setState({ skillProfWindow: true })
                    }} />
                </View>
                {this.state.skillProfWindow &&
                    <View>
                        <AppText textAlign={'center'} fontSize={17} padding={8}>You can add any skill you like here, if you are going by an official feat read what skills are provided with it and pick accordingly</AppText>
                        <AppMultipleItemPicker addAsProficiency={true} resetList={this.state.resetClicked === "skillList" ? true : false} list={skillList.skillList} alreadyPickedItems={this.state.alreadyPickedSkills} listChange={(val: any[]) => { this.props.skillListChange(val) }} />
                    </View>
                }
                <View style={[styles.switchBox, { flexDirection: 'row', width: '50%', paddingLeft: 20 }]}>
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add Tool proficiencies?</AppText>
                    <Switch value={this.state.toolProfWindow} onValueChange={() => {
                        if (this.state.toolProfWindow) {
                            this.setState({ resetClicked: 'toolList' }, () => {
                                this.props.resetList('featToolList')
                                this.setState({ toolProfWindow: false }, () => {
                                    setTimeout(() => {
                                        this.setState({ resetClicked: "" })
                                    }, 500);
                                })
                            })
                            return;
                        }
                        this.setState({ toolProfWindow: true })
                    }} />
                </View>
                {this.state.toolProfWindow &&
                    <View>
                        <AppText textAlign={'center'} fontSize={17} padding={8}>You can add any Tools you like here, if you are going by an official feat read what tools are provided with it and pick accordingly</AppText>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            <AppMultipleItemPicker addAsProficiency={true} resetList={this.state.resetClicked === "toolList" ? true : false}
                                list={toolList.tools} alreadyPickedItems={this.state.alreadyPickedSkills} listChange={(val: any[]) => { this.props.toolListChange(val) }} />
                        </View>
                    </View>
                }



                <View style={[styles.switchBox, { flexDirection: 'row', width: '50%', paddingLeft: 20 }]}>
                    <AppText fontSize={18} textAlign={'center'}>Does this feat add Saving Throw proficiencies?</AppText>
                    <Switch value={this.state.savingThrowsWindow} onValueChange={() => {
                        if (this.state.savingThrowsWindow) {
                            this.setState({ resetClicked: 'saveThrows' }, () => {
                                this.props.resetList('featToolList')
                                this.setState({ savingThrowsWindow: false }, () => {
                                    setTimeout(() => {
                                        this.setState({ resetClicked: "" })
                                    }, 500);
                                })
                            })
                            return;
                        }
                        this.setState({ savingThrowsWindow: true })
                    }} />
                </View>
                {this.state.savingThrowsWindow &&
                    <View>
                        <AppText textAlign={'center'} fontSize={17} padding={8}>You can add any Saving Throws you like here, if you are going by an official feat read what saving throws are provided with it and pick accordingly</AppText>
                        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                            <AppMultipleItemPicker addAsProficiency={false} resetList={this.state.resetClicked === "saveThrows" ? true : false}
                                list={abilityScores.abilityScores} alreadyPickedItems={this.state.alreadyPickedSavingThrows}
                                listChange={(val: any[]) => { this.props.savingThrowListChange(val) }} />
                        </View>
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
                                        <IconGen size={55} backgroundColor={Colors.shadowBlue} name={'plus'} iconColor={Colors.white} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ marginLeft: 33 }} onPress={() => { this.removeAbilityPoints(item[0], index) }}>
                                        <IconGen size={55} backgroundColor={Colors.orange} name={'minus'} iconColor={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.innerModifier, { backgroundColor: Colors.bitterSweetRed }]}>
                                    <AppText fontSize={18} color={Colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
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
        borderRadius: 120,
        justifyContent: "center"
    },
    switchBox: {
        paddingBottom: 25
    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});