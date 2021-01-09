import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView, Platform, Dimensions } from 'react-native';
import switchModifier from '../../utility/abillityModifierSwitch';
import logger from '../../utility/logger';
import skillModifier from '../../utility/skillModifier';
import userCharApi from '../api/userCharApi';
import AuthContext from '../auth/context';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { CompanionModel } from '../models/companionModel';
import { ModifiersModel } from '../models/modifiersModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppTextInput } from './forms/AppTextInput';

interface AppCompanionState {
    character: CharacterModel
    loading: boolean
    textModal: boolean
    textInEdit: any
    textValue: any
    skillPickModal: boolean
    clickedSkills: boolean[]
}

const skillList: string[] = ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival', 'Acrobatics', 'Sleight of Hand'
    , 'Stealth', 'Arcana', 'History', 'Investigation', 'Religion', 'Insight', 'Medicine', 'Deception', 'Performance', 'Persuasion'];

export class AppCompanion extends Component<{ isDm: boolean, closeModal: any, character: CharacterModel, proficiency: any, pickedIndex: number }, AppCompanionState> {
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            clickedSkills: [],
            skillPickModal: false,
            textValue: null,
            textInEdit: null,
            textModal: false,
            loading: true,
            character: this.props.character
        }
    }
    listStats = () => {
        try {
            const char = this.state.character;
            if (this.state.character.charSpecials && this.state.character.charSpecials.companion) {
                const modifiersLists = this.state.character.charSpecials.companion[this.props.pickedIndex].modifiers;
                if (char && char.charSpecials?.companion && modifiersLists) {
                    const modifiers: any[] = Object.entries(modifiersLists);
                    modifiers[0].push(char.charSpecials.companion[this.props.pickedIndex].strength);
                    modifiers[1].push(char.charSpecials.companion[this.props.pickedIndex].constitution);
                    modifiers[2].push(char.charSpecials.companion[this.props.pickedIndex].dexterity);
                    modifiers[3].push(char.charSpecials.companion[this.props.pickedIndex].intelligence);
                    modifiers[4].push(char.charSpecials.companion[this.props.pickedIndex].wisdom);
                    modifiers[5].push(char.charSpecials.companion[this.props.pickedIndex].charisma);
                    return modifiers;
                }
            }
            return []
        } catch (err) {
            logger.log(new Error(err))
            return []
        }
    }

    setModifiers = () => {
        try {
            const character = { ...this.state.character }
            if (character.charSpecials && character.charSpecials.companion && this.state.character.charSpecials && this.state.character.charSpecials.companion) {
                const attributePoints: any = [character.charSpecials.companion[this.props.pickedIndex].strength,
                character.charSpecials.companion[this.props.pickedIndex].constitution, character.charSpecials.companion[this.props.pickedIndex].dexterity,
                character.charSpecials.companion[this.props.pickedIndex].intelligence,
                character.charSpecials.companion[this.props.pickedIndex].wisdom, character.charSpecials.companion[this.props.pickedIndex].charisma];
                const modifiersLists = this.state.character.charSpecials.companion[this.props.pickedIndex].modifiers;
                let characterModifiers = character.charSpecials.companion[this.props.pickedIndex].modifiers;
                if (modifiersLists && characterModifiers) {
                    const modifiers = Object.values(modifiersLists);
                    attributePoints.forEach((item: number, index: number) => {
                        modifiers[index] = switchModifier(item);
                    })
                    characterModifiers.strength = modifiers[0];
                    characterModifiers.constitution = modifiers[1];
                    characterModifiers.dexterity = modifiers[2];
                    characterModifiers.intelligence = modifiers[3];
                    characterModifiers.wisdom = modifiers[4];
                    characterModifiers.charisma = modifiers[5];

                }
            }
            this.setState({ character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                if (this.context.user._id === "Offline") {
                    this.updateOfflineCharacter();
                    return;
                }
                userCharApi.updateChar(this.state.character)
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    updateOfflineCharacter = async () => {
        try {
            const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
            if (stringifiedChars) {
                const characters = JSON.parse(stringifiedChars);
                for (let index in characters) {
                    if (characters[index]._id === this.state.character._id) {
                        characters[index] = this.state.character;
                        break;
                    }
                }
                await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    componentDidMount() {
        try {
            const character = { ...this.state.character };
            const clickedSkills = { ...this.state.clickedSkills };
            if (this.state.character.charSpecials && this.state.character.charSpecials.companion
                && character.charSpecials && character.charSpecials.companion) {
                if (this.state.character.charSpecials.companion[this.props.pickedIndex]) {
                    const skills = this.state.character.charSpecials.companion[this.props.pickedIndex].skills;
                    const companionLength = this.state.character.charSpecials.companion[this.props.pickedIndex]?.skills?.length;
                    if (skills && companionLength && companionLength > 0) {
                        for (let skill of skills) {
                            skillList.forEach((item, index) => {
                                if (item === skill[0]) {
                                    clickedSkills[index] = true
                                }
                            });
                        }
                    }
                }
                if (!this.state.character.charSpecials.companion[this.props.pickedIndex] && character.charSpecials && character.charSpecials.companion) {
                    this.state.character.charSpecials.companion[this.props.pickedIndex] = new CompanionModel()
                    character.charSpecials.companion[this.props.pickedIndex].name = `new Companion ${this.props.pickedIndex + 1}`;
                    character.charSpecials.companion[this.props.pickedIndex].animalType = 'Type';
                    character.charSpecials.companion[this.props.pickedIndex].maxHp = 0;
                    character.charSpecials.companion[this.props.pickedIndex].charisma = 0;
                    character.charSpecials.companion[this.props.pickedIndex].strength = 0;
                    character.charSpecials.companion[this.props.pickedIndex].constitution = 0;
                    character.charSpecials.companion[this.props.pickedIndex].wisdom = 0;
                    character.charSpecials.companion[this.props.pickedIndex].intelligence = 0;
                    character.charSpecials.companion[this.props.pickedIndex].dexterity = 0;
                    character.charSpecials.companion[this.props.pickedIndex].skills = [];
                    character.charSpecials.companion[this.props.pickedIndex].trait = '';
                    character.charSpecials.companion[this.props.pickedIndex].flaw = '';
                    character.charSpecials.companion[this.props.pickedIndex].modifiers = new ModifiersModel();
                    const attributePoints: any = [character.charSpecials.companion[this.props.pickedIndex].strength,
                    character.charSpecials.companion[this.props.pickedIndex].constitution, character.charSpecials.companion[this.props.pickedIndex].dexterity,
                    character.charSpecials.companion[this.props.pickedIndex].intelligence,
                    character.charSpecials.companion[this.props.pickedIndex].wisdom, character.charSpecials.companion[this.props.pickedIndex].charisma];
                    const newModifierList = this.state.character.charSpecials.companion[this.props.pickedIndex].modifiers;
                    const newCharacterModifiers = character.charSpecials.companion[this.props.pickedIndex].modifiers;
                    if (newModifierList && newCharacterModifiers) {
                        const modifiers = Object.values(newModifierList);
                        attributePoints.forEach((item: number, index: number) => {
                            modifiers[index] = switchModifier(item);
                        })
                        newCharacterModifiers.strength = modifiers[0];
                        newCharacterModifiers.constitution = modifiers[1];
                        newCharacterModifiers.dexterity = modifiers[2];
                        newCharacterModifiers.intelligence = modifiers[3];
                        newCharacterModifiers.wisdom = modifiers[4];
                        newCharacterModifiers.charisma = modifiers[5];
                    }
                }
            }
            this.setState({ loading: false, character, clickedSkills }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                if (this.context.user._id === "Offline") {
                    this.updateOfflineCharacter();
                    return;
                }
                userCharApi.updateChar(this.state.character)
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addSkill = (pickedSkill: string, index: number) => {
        try {
            const character = { ...this.state.character };
            const clickedSkills = { ...this.state.clickedSkills };
            const skills = (this.state.character.charSpecials && this.state.character.charSpecials.companion) && this.state.character.charSpecials.companion[this.props.pickedIndex].skills;
            const newSkills = (character.charSpecials && character.charSpecials.companion) && character.charSpecials.companion[this.props.pickedIndex].skills;
            if (!clickedSkills[index] && skills && newSkills) {
                if (skills.length === 2) {
                    alert('Your companion can possess 2 skills at max.')
                    return;
                }
                newSkills.push([pickedSkill, 0]);
                clickedSkills[index] = true;
                this.setState({ clickedSkills, character }, () => {
                    this.setModifiers()
                })
                return
            }
            if (clickedSkills[index] && character.charSpecials && character.charSpecials.companion && newSkills) {
                character.charSpecials.companion[this.props.pickedIndex].skills = newSkills.filter(item => item[0] !== pickedSkill)
                clickedSkills[index] = false;
                this.setState({ clickedSkills, character }, () => {
                    this.setModifiers()
                })
                return
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    skillCheck = (skill: string) => {
        try {
            const modifierList = (this.state.character.charSpecials && this.state.character.charSpecials.companion) && this.state.character.charSpecials.companion[this.props.pickedIndex].modifiers;
            if (modifierList) {
                const modifiers = Object.entries(modifierList)
                const skillGroup = skillModifier(skill);
                for (let item of modifiers) {
                    if (item[0] === skillGroup) {
                        return item[1]
                    }
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    handleDelete = async () => {
        try {
            const character = { ...this.state.character };
            const companion = this.state.character.charSpecials && this.state.character.charSpecials.companion;
            if (companion && character.charSpecials && character.charSpecials.companion) {
                for (let item of companion) {
                    character.charSpecials.companion = character.charSpecials.companion.filter(m => m.name !== companion[this.props.pickedIndex].name)
                }
                this.props.closeModal(false)
                this.setState({ character }, () => {
                    if (this.context.user._id === "Offline") {
                        this.updateOfflineCharacter();
                        return;
                    }
                    userCharApi.updateChar(this.state.character)
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    render() {
        let companion = new CompanionModel();
        if (this.state.character.charSpecials && this.state.character.charSpecials.companion) {
            companion = this.state.character.charSpecials.companion[this.props.pickedIndex];
        }
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={[styles.container, { backgroundColor: Colors.pageBackground }]} >
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View>
                        <View style={{ marginBottom: 15, marginTop: 10 }}>
                            <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                borderRadius={25} title={'Close'} onPress={() => { this.props.closeModal(false) }} />
                        </View>
                        <AppText padding={5} fontSize={16}>*click on any prop to edit it.</AppText>
                        <View style={{ justifyContent: "space-evenly", flexDirection: 'row', marginVertical: 10 }}>
                            <TouchableOpacity disabled={this.props.isDm} style={{ backgroundColor: Colors.pinkishSilver, padding: 10, borderRadius: 25 }} onPress={() => { this.setState({ textModal: true, textInEdit: 'animalType' }) }}>
                                <AppText fontSize={18}>Animal Type</AppText>
                                <AppText fontSize={20} color={Colors.berries} textAlign={'center'}>{companion.animalType}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.props.isDm} style={{ backgroundColor: Colors.pinkishSilver, padding: 10, borderRadius: 25 }} onPress={() => { this.setState({ textModal: true, textInEdit: 'name' }) }}>
                                <AppText fontSize={18} >Companion Name</AppText>
                                <AppText fontSize={20} color={Colors.berries} textAlign={'center'}>{companion.name}</AppText>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity disabled={this.props.isDm} onPress={() => { this.setState({ textModal: true, textInEdit: 'maxHp' }) }}>
                            <AppText fontSize={25} textAlign={'center'}>Max HP {companion.maxHp}</AppText>
                        </TouchableOpacity>
                        <View>
                            <View>
                                <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>Proficiency bonus +{this.props.proficiency}</AppText>
                                <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>Your companion is proficient in all saving throws</AppText>
                            </View>
                        </View>
                        <View>
                            {companion.skills && companion?.skills.length === 0 ?
                                <TouchableOpacity disabled={this.props.isDm} style={{ justifyContent: "center", alignItems: "center", padding: 15 }} onPress={() => { this.setState({ skillPickModal: true }) }}>
                                    <AppText fontSize={22} textAlign={'center'}>Your companion has no skills, you can pick up to 2 skills.</AppText>
                                    <AppText fontSize={22} textAlign={'center'}>Click here to pick</AppText>
                                </TouchableOpacity>
                                :
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: 30, marginBottom: 30 }}>
                                    <AppText fontSize={22} textAlign={'center'}>Skills:</AppText>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: .5 }}>
                                            {companion.skills && companion.skills.map((skill, index) =>
                                                <View key={index}>
                                                    <AppText fontSize={20} color={Colors.berries}>{skill[0]} {((this.skillCheck(skill) + this.props.proficiency) <= 0 ? "" : "+")} {(this.skillCheck(skill) + this.props.proficiency)}</AppText>
                                                </View>)}
                                        </View>
                                        <View style={{ flex: .4 }}>
                                            <AppButton disabled={this.props.isDm} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={80} height={80}
                                                borderRadius={25} title={'Edit skills'} onPress={() => { this.setState({ skillPickModal: true }) }} />
                                        </View>
                                    </View>
                                </View>
                            }
                            <Modal visible={this.state.skillPickModal}>
                                <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                    <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>Pick up to 2 skills for your companion:</AppText>
                                    <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                                        {skillList.map((skill, index) =>
                                            <TouchableOpacity style={{
                                                justifyContent: "center", alignItems: "center", padding: 15,
                                                width: '43%',
                                                margin: 10,
                                                borderRadius: 25,
                                                borderColor: Colors.berries,
                                                borderWidth: 1,
                                                backgroundColor: this.state.clickedSkills[index] ? Colors.bitterSweetRed : Colors.lightGray
                                            }}
                                                key={skill} onPress={() => { this.addSkill(skill, index) }}>
                                                <AppText>{skill}</AppText>
                                            </TouchableOpacity>)}
                                    </View>
                                    <View style={{ marginBottom: 15 }}>
                                        <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                            borderRadius={25} title={'Close'} onPress={() => { this.setState({ skillPickModal: false }) }} />
                                    </View>
                                </ScrollView>
                            </Modal>
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity disabled={this.props.isDm} style={styles.traitFlawCont} onPress={() => { this.setState({ textModal: true, textInEdit: 'trait' }) }}>
                                <AppText fontSize={18}>Trait</AppText>
                                <AppText fontSize={16} color={Colors.berries} textAlign={'center'}>{companion.trait}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.props.isDm} style={styles.traitFlawCont} onPress={() => { this.setState({ textModal: true, textInEdit: 'flaw' }) }}>
                                <AppText fontSize={18} >Flaw</AppText>
                                <AppText fontSize={16} color={Colors.berries} textAlign={'center'}>{companion.flaw}</AppText>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: "center", flexDirection: "row", flexWrap: "wrap", marginHorizontal: Dimensions.get('screen').width / 50 }}>
                            {this.listStats().map((item, index) =>
                                <View key={index}>
                                    <TouchableOpacity disabled={this.props.isDm} style={styles.modifier} onPress={() => { this.setState({ textModal: true, textInEdit: `${item[0]}` }) }}>
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
                                    </TouchableOpacity>
                                </View>)}
                        </View>
                        <Modal visible={this.state.textModal}>
                            {this.state.textModal &&
                                <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                    <View style={{ marginTop: 35, padding: 25 }}>
                                        <AppText textAlign={'center'} fontSize={20}>Change your companions</AppText>
                                        <AppText textAlign={'center'} fontSize={20}>{this.state.textInEdit.replace(/([A-Z])/g, ' $1').trim().toLocaleLowerCase()}</AppText>
                                        <AppTextInput
                                            keyboardType={this.state.textInEdit === 'strength' || this.state.textInEdit === 'constitution' || this.state.textInEdit === 'intelligence' ||
                                                this.state.textInEdit === 'dexterity' || this.state.textInEdit === 'wisdom' || this.state.textInEdit === 'charisma' ||
                                                this.state.textInEdit === 'maxHp' ? 'numeric' : 'default'}
                                            width={this.state.textInEdit === 'strength' || this.state.textInEdit === 'constitution' || this.state.textInEdit === 'intelligence' ||
                                                this.state.textInEdit === 'dexterity' || this.state.textInEdit === 'wisdom' || this.state.textInEdit === 'charisma' ? '45%' : '95%'}
                                            textAlignVertical={"top"} multiline={true} numberOfLines={this.state.textInEdit === "flaw" || this.state.textInEdit === "trait" ? 3 : 1}
                                            placeholder={this.state.textInEdit.replace(/([A-Z])/g, ' $1').trim().toLocaleLowerCase()}
                                            onChangeText={(txt: any) => {
                                                if (this.state.textInEdit === 'maxHp') {
                                                    if (parseInt(txt) < 0) {
                                                        txt = 0
                                                    }
                                                    this.setState({ textValue: parseInt(txt) })
                                                    return
                                                }
                                                if (this.state.textInEdit === 'strength' || this.state.textInEdit === 'constitution' || this.state.textInEdit === 'intelligence' ||
                                                    this.state.textInEdit === 'dexterity' || this.state.textInEdit === 'wisdom' || this.state.textInEdit === 'charisma') {
                                                    if (parseInt(txt) > 20) {
                                                        txt = 20;
                                                    }
                                                    if (parseInt(txt) < 0) {
                                                        txt = 0;
                                                    }
                                                    this.setState({ textValue: parseInt(txt) })
                                                    return;
                                                }
                                                this.setState({ textValue: txt })
                                            }} />
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                        <AppButton disabled={this.props.isDm} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={100} height={100}
                                            borderRadius={100} title={'Cancel'} onPress={() => { this.setState({ textValue: '', textModal: false, textInEdit: '' }) }} />
                                        <AppButton disabled={this.props.isDm} fontSize={20} backgroundColor={Colors.metallicBlue} width={100} height={100}
                                            borderRadius={100} title={'O.K'} onPress={() => {
                                                if (!this.state.textValue || this.state.textValue.length === 0) {
                                                    alert('Cannot leave field empty!')
                                                    return;
                                                }
                                                const character = { ...this.state.character };
                                                if (character.charSpecials && character.charSpecials.companion) {
                                                    character.charSpecials.companion[this.props.pickedIndex][this.state.textInEdit] = this.state.textValue;
                                                    this.setState({ textValue: '', textModal: false, textInEdit: '', character }, () => {
                                                        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
                                                        this.setModifiers()
                                                    })
                                                }
                                            }} />
                                    </View>
                                </View>
                            }
                        </Modal>
                    </View>
                }

                <View style={{ marginBottom: 15 }}>
                    <AppButton fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                        borderRadius={25} title={'Close'} onPress={() => { this.props.closeModal(false) }} />
                </View>
                <View style={{ marginBottom: 15 }}>
                    <AppButton disabled={this.props.isDm} fontSize={20} backgroundColor={Colors.danger} width={180} height={50}
                        borderRadius={25} title={'Delete Companion'} onPress={() => { this.handleDelete() }} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, modifier: {
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
    },
    traitFlawCont: {
        backgroundColor: Colors.pinkishSilver,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.berries,
        padding: 20,
        margin: 15
    }
});