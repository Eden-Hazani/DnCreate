import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Alert } from 'react-native';
import { IconGen } from '../components/IconGen';
import colors from '../config/colors';
import { AppText } from '../components/AppText';
import { AppButton } from '../components/AppButton';
import { CharacterModel } from '../models/characterModel';
import { Config } from '../../config';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { AppTextInput } from '../components/forms/AppTextInput';
import userCharApi from '../api/userCharApi';
import switchProficiency from '../../utility/ProficiencyBonusSwitch';
import skillModifier from '../../utility/skillModifier';
import hitDiceSwitch from '../../utility/hitDiceSwitch';
import * as levelUpTree from '../classFeatures/levelUpTree'
import { LevelUpOptions } from './charOptions/LevelUpOptions';
import errorHandler from '../../utility/errorHander';
import AsyncStorage from '@react-native-community/async-storage';
import { hpColors } from '../../utility/hpColors';
import { skillExpertiseCheck } from '../../utility/skillExpertiseCheck';
import { UniqueCharStats } from './charOptions/UniqueCharStats';
import { ClassModel } from '../models/classModel';
import switchModifier from '../../utility/abillityModifierSwitch';
import { CharMagic } from './charOptions/CharMagic';
import { getSpecialSaveThrows } from '../../utility/getSpecialSaveThrows';
import { Unsubscribe } from 'redux';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';

/**
 * 
 * @param  image: image url-string || URI
 *   
 */
interface SelectCharacterState {
    currentHp: string
    levelUpFunctionActive: boolean
    levelUpFunction: any
    backGroundStoryVisible: boolean
    statsVisible: boolean
    character: CharacterModel
    loading: boolean
    currentLevel: number
    currentProficiency: number,
    resetHpModal: boolean
    isDm: boolean
    setCurrentHpModal: boolean
}

export class SelectCharacter extends Component<{ route: any, navigation: any }, SelectCharacterState>{
    private UnsubscribeStore: Unsubscribe;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            setCurrentHpModal: false,
            currentHp: '',
            levelUpFunctionActive: false,
            levelUpFunction: null,
            currentProficiency: null,
            currentLevel: null,
            loading: true,
            backGroundStoryVisible: false,
            statsVisible: false,
            character: new CharacterModel(),
            resetHpModal: false,
            isDm: this.props.route.params.isDm
        }
        this.UnsubscribeStore = store.subscribe(() => {
            this.setState({ character: store.getState().character })
        })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    refreshData = async () => {
        this.setState({ loading: true })
        const response = await userCharApi.getChar(this.state.character._id);
        if (!response.ok) {
            errorHandler(response);
            return;
        }
        const character = response.data;
        this.setState({ character }, () => {
            this.setState({ loading: false })
        });
    }

    onFocus = async () => {
        this.setState({ loading: true })
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
        this.refreshData().then(() => {
            this.maxHpCheck();
        })
    }

    componentDidMount() {
        let startCharInfo: CharacterModel = null;
        if (this.state.isDm) {
            startCharInfo = this.props.route.params.character;
            this.props.navigation.addListener('beforeRemove', (e: any) => {
                this.props.navigation.navigate("Adventures")
            })
        }
        if (!this.state.isDm) {
            startCharInfo = store.getState().character;
            this.props.navigation.addListener('beforeRemove', (e: any) => {
                if (this.state.loading) {
                    e.preventDefault();
                    return;
                }
                this.setState({ loading: true })
                store.dispatch({ type: ActionType.CleanCreator })
            })
        }
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
        this.setState({ character: startCharInfo }, async () => {
            if (await AsyncStorage.getItem(`${this.state.character._id}FirstTimeOpened`) !== null && levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)) {
                const { operation, action } = levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character);
                this.setState({ levelUpFunctionActive: operation, levelUpFunction: action });
            }
            this.maxHpCheck();
            this.setState({ currentLevel: this.state.character.level })
            this.setState({ currentProficiency: switchProficiency(this.state.character.level) })

        })
    }




    listStats = () => {
        const char = this.state.character;
        const modifiers: any[] = Object.entries(this.state.character.modifiers);
        modifiers[0].push(char.strength);
        modifiers[1].push(char.constitution);
        modifiers[2].push(char.dexterity);
        modifiers[3].push(char.intelligence);
        modifiers[4].push(char.wisdom);
        modifiers[5].push(char.charisma);
        return modifiers;
    }

    setLevel = (level: number) => {
        let validLevel: number = level;
        if (level < this.state.character.level) {
            if (level === 0) {
                return;
            }
            Alert.alert("Lowering Level", "Are you sure you want to lower your level?", [{
                text: 'Yes', onPress: async () => {
                    if (level < 0 || level.toString() === '') {
                        validLevel = 1;
                    }
                    const character = await AsyncStorage.getItem(`current${this.state.character._id}level${level}`);
                    this.setState({ character: JSON.parse(character), currentLevel: validLevel }, () => {
                        this.setState({ currentProficiency: switchProficiency(this.state.currentLevel) })
                        userCharApi.updateChar(this.state.character).then(() => {
                            this.setState({ currentHp: this.state.character.maxHp.toString() });
                            this.refreshData();
                        })
                    })
                }
            }, {
                text: 'No'
            }])
        } else {
            Alert.alert("Level Up", "Are you sure you wish to level up?", [{
                text: 'Yes', onPress: async () => {
                    if (level > 20) {
                        validLevel = 20;
                        const character = { ...this.state.character };
                        character.level = validLevel;
                        this.setState({ character })
                        return;
                    }
                    if (level < 0) {
                        validLevel = 1;
                        const character = { ...this.state.character };
                        character.level = validLevel;
                        this.setState({ character })
                        return;
                    }
                    await AsyncStorage.setItem(`current${this.state.character._id}level${this.state.character.level}`, JSON.stringify(this.state.character));
                    const character = { ...this.state.character };
                    character.level = validLevel;
                    this.setState({ character, currentLevel: validLevel }, () => {
                        this.levelUp();
                        this.setState({ currentProficiency: switchProficiency(this.state.currentLevel) })
                    })
                }
            }, { text: 'No' }])
        }
    }

    skillCheck = (skill: string) => {
        const modifiers = Object.entries(this.state.character.modifiers)
        const skillGroup = skillModifier(skill);
        for (let item of modifiers) {
            if (item[0] === skillGroup) {
                return item[1]
            }
        }
    }


    levelUp = () => {
        const character = { ...this.state.character };
        const hitDice = hitDiceSwitch(this.state.character.characterClass);
        let maxHp: number = this.state.character.maxHp;
        maxHp = (maxHp + Math.floor(Math.random() * hitDice) + 1) + this.state.character.modifiers.constitution;
        character.maxHp = maxHp;
        this.setState({ character }, () => {
            userCharApi.updateChar(this.state.character)
            if (levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)) {
                const { operation, action } = levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character);
                this.setState({ levelUpFunctionActive: operation, levelUpFunction: action });
            }
            this.setState({ currentHp: this.state.character.maxHp.toString() }, async () => {
                await AsyncStorage.setItem(`${this.state.character._id}currentHp`, this.state.currentHp);
            });
        })
    }


    maxHpCheck = async () => {
        if (!this.state.character.maxHp) {
            const character = { ...this.state.character };
            let maxHp = hitDiceSwitch(this.state.character.characterClass) + this.state.character.modifiers.constitution;
            character.maxHp = maxHp;
            this.setState({ character }, async () => {
                const currentHp = await AsyncStorage.getItem(`${this.state.character._id}currentHp`);
                currentHp ? this.setState({ currentHp: currentHp }) : this.setState({ currentHp: this.state.character.maxHp.toString() });
                userCharApi.updateChar(this.state.character)
            })
        }
        const currentHp = await AsyncStorage.getItem(`${this.state.character._id}currentHp`);
        currentHp ? this.setState({ currentHp: currentHp }) : this.setState({ currentHp: this.state.character.maxHp.toString() });
        return this.state.character.maxHp;
    }


    handleLevelUpFunctionActiveCloser = (closed: boolean) => {
        this.setState({ levelUpFunctionActive: closed })
    }

    setCurrentHp = async () => {
        await AsyncStorage.setItem(`${this.state.character._id}currentHp`, this.state.currentHp);
        this.setState({ setCurrentHpModal: false })
    }

    render() {
        const isDm = this.state.isDm;
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={styles.container}>
                        <Modal visible={this.state.levelUpFunctionActive} >
                            <ScrollView>
                                <LevelUpOptions options={this.state.levelUpFunction} character={this.state.character} close={this.handleLevelUpFunctionActiveCloser} refresh={this.refreshData} />
                            </ScrollView>
                        </Modal>
                        <View>
                            <View style={styles.imageContainer}>
                                <View style={styles.upperContainer}>
                                    <View style={{ flexDirection: "column", paddingLeft: 2 }}>
                                        <Image style={styles.image} source={{ uri: `${Config.serverUrl}/assets/${this.state.character.image}` }} />
                                        <AppText textAlign="center" fontSize={15} color={colors.text}>{this.state.character.name}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={colors.text}>{this.state.character.race}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={colors.text}>{this.state.character.characterClass}</AppText>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Initiative</AppText>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25} >{this.state.character.modifiers.dexterity}</AppText>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Level</AppText>
                                                <TouchableOpacity disabled={isDm} style={styles.triContainer}
                                                    onPress={() => { this.setLevel(this.state.character.level + 1) }}
                                                    onLongPress={() => { this.setLevel(this.state.character.level - 1) }}>
                                                    <AppText fontSize={25}>{this.state.character.level}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Max HP</AppText>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25}>{`${this.state.character.maxHp}`}</AppText>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25}>{`+${this.state.currentProficiency}`}</AppText>
                                                </View>
                                                <AppText textAlign={'center'}>Proficiency Bonus</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={styles.triContainer}>
                                                    <AppText fontSize={25}>{this.state.character.equippedArmor.ac}</AppText>
                                                </View>
                                                <AppText>AC</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <TouchableOpacity onPress={() => { this.setState({ setCurrentHpModal: true }) }} style={[styles.triContainer, { borderColor: colors.black, backgroundColor: hpColors(parseInt(this.state.currentHp), this.state.character.maxHp) }]}>
                                                    <AppText fontSize={25}>{this.state.currentHp}</AppText>
                                                </TouchableOpacity>
                                                <AppText>Current Hp</AppText>
                                            </View>
                                            <Modal visible={this.state.setCurrentHpModal}>
                                                <View style={{ flex: .9, alignItems: "center" }}>
                                                    <AppText color={colors.bitterSweetRed} fontSize={35}>Insert Current Hp</AppText>
                                                    <AppTextInput keyboardType={'numeric'} iconName={'plus'} onChangeText={(hp: string) => { this.setState({ currentHp: hp }) }} />
                                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Ok'} onPress={() => { this.setCurrentHp() }} />
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ backGroundStoryVisible: true })}>
                                <IconGen size={80} backgroundColor={colors.primary} name={"book-open-page-variant"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Background Story</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.backGroundStoryVisible} animationType="slide">
                                <View style={{ flex: .9, padding: 25 }}>
                                    <AppText textAlign={"left"} fontSize={35} color={colors.bitterSweetRed}>{`${this.state.character.name}'s Story`}</AppText>
                                    <AppText textAlign={"left"} fontSize={20}>{this.state.character.backStory}</AppText>
                                </View>
                                <View style={{ flex: .1, flexDirection: "row", justifyContent: "space-evenly", alignContent: "center" }}>
                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Close'} onPress={() => this.setState({ backGroundStoryVisible: false })} />
                                    <AppButton disabled={isDm} backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Update Story'} onPress={() => {
                                        this.setState({ backGroundStoryVisible: false }, () => {
                                            this.props.navigation.navigate("CharBackstory", { updateStory: true, character: this.state.character })
                                        })
                                    }} />
                                </View>
                            </Modal>

                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ statsVisible: true })}>
                                <IconGen size={80} backgroundColor={colors.bitterSweetRed} name={"sword"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Ability Score &amp; Modifiers</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.statsVisible} animationType="slide">
                                <View style={{ flex: .9, alignItems: "center" }}>
                                    <AppText color={colors.bitterSweetRed} fontSize={35}>Stats</AppText>
                                    <AppText fontSize={30} >{`${this.state.character.race} ${this.state.character.characterClass}`}</AppText>
                                    <FlatList
                                        data={this.listStats()}
                                        keyExtractor={(stats: [string, number, number]) => stats[0].toString()}
                                        numColumns={2}
                                        renderItem={({ item }) =>
                                            <View style={styles.modifier}>
                                                <View style={styles.innerModifier}>
                                                    <AppText fontSize={18} color={colors.totalWhite} textAlign={"center"}>{item[0]}</AppText>
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
                                <View style={{ flex: .1 }}>
                                    <AppButton backgroundColor={colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'close'} onPress={() => this.setState({ statsVisible: false })} />
                                </View>
                            </Modal>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharItems") }}>
                                <IconGen size={80} backgroundColor={colors.danger} name={"sack"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Items And Currency</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secRowIconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharFeatures", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={colors.shadowBlue} name={"pentagon"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Features</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharFeats", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={colors.strongOrange} name={"atlassian"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Feats</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("Spells", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={colors.berries} name={"fire"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Spell Book</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secRowIconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("Armor", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={colors.shadowBlue} name={"tshirt-crew"} iconColor={colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={colors.black}>Armor</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <UniqueCharStats character={this.state.character} />
                        </View>
                        <View>
                            <AppText textAlign={'center'}>Saving Throws</AppText>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                {getSpecialSaveThrows(this.state.character).map(saveThrow =>
                                    <View style={{ borderColor: colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, margin: 5 }} key={saveThrow}>
                                        <AppText fontSize={18}>{saveThrow} </AppText>
                                    </View>)}
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.list, { width: '35%' }]}>
                                    <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Skills:</AppText>
                                    {this.state.character.skills.map(skill =>
                                        <View key={skill} style={styles.skill}>
                                            <AppText textAlign={'center'}>{`${skill[0]}`}</AppText>
                                            <AppText fontSize={20} color={colors.bitterSweetRed}
                                                textAlign={'center'}>{`+${(this.skillCheck(skill) + this.state.currentProficiency) + skillExpertiseCheck(skill[1], this.state.currentProficiency)}`}</AppText>
                                        </View>
                                    )}
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", width: "65%" }}>
                                    <AppText fontSize={25}>Hit Dice</AppText>
                                    <AppText fontSize={25} color={colors.bitterSweetRed}>{`D${hitDiceSwitch(this.state.character.characterClass)}`}</AppText>
                                    <AppText textAlign={'center'}>You add these bonuses to both your attack hit rolls and for your damage rolls with the proficient weapon.</AppText>
                                    <View style={{ borderColor: colors.black, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers.strength > 0 ? '+' : null} {this.state.character.modifiers.strength + this.state.currentProficiency} for melee weapons</AppText>
                                    </View>
                                    <View style={{ borderColor: colors.black, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers.dexterity > 0 ? '+' : null} {this.state.character.modifiers.dexterity + this.state.currentProficiency} for ranged weapons</AppText>
                                    </View>
                                    <View style={{ borderColor: colors.black, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} for {this.state.character.characterClassId.weaponProficiencies.map(v => <AppText key={v}>{`\n`} - {v} - </AppText>)}</AppText>
                                    </View>
                                    {this.state.character.addedWeaponProf.length > 0 &&
                                        <View style={{ borderColor: colors.black, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                            <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} for {this.state.character.addedWeaponProf.map(v => <AppText key={v}>{`\n`} - {v} - </AppText>)}</AppText>
                                        </View>}
                                </View>
                            </View>
                            <View style={[styles.list, { width: '100%' }]}>
                                <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Tools:</AppText>
                                {this.state.character.tools.map(tool =>
                                    <View key={tool} style={styles.tools}>
                                        {}
                                        <AppText>{`${tool[0]} +${(this.state.currentProficiency) + skillExpertiseCheck(tool[1], this.state.currentProficiency)}`}</AppText>
                                    </View>
                                )}
                            </View>
                            <View style={styles.personality}>
                                <View style={{ width: '30%', paddingLeft: 18 }}>
                                    <AppText textAlign={'center'}>To change a personality feature press and hold on its title.</AppText>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharPersonalityTraits", { updateTraits: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Traits:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.personalityTraits.map((trait, index) => <AppText key={index}>{`${index + 1}. ${trait}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharIdeals", { updateIdeals: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Ideals:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.ideals.map((ideal, index) => <AppText key={index}>{`${index + 1}. ${ideal}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharFlaws", { updateFlaws: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Flaws:</AppText>
                                        {this.state.character.flaws.map((flaw, index) => <AppText key={index}>{`${index + 1}. ${flaw}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharBonds", { updateBonds: true, character: this.state.character }) }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Bonds:</AppText>
                                        {this.state.character.bonds.map((bond, index) => <AppText key={index}>{`${index + 1}. ${bond}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View>
                            <AppText textAlign={'center'} color={colors.bitterSweetRed} fontSize={30}>Magic</AppText>
                            {this.state.character.magic ? <CharMagic character={this.state.character} currentProficiency={this.state.currentProficiency} /> :
                                <AppText padding={15} fontSize={18} textAlign={'center'}>You do not posses magical abilities right now.</AppText>
                            }
                        </View>
                    </View>}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    itemModal: {
        position: 'absolute',
        zIndex: 1,
        height: '100%',
        width: '100%'
    },
    image: {
        height: 100,
        width: 100,
        borderRadius: 100,
        resizeMode: "cover",
    },
    iconContainer: {
        flex: .2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    secRowIconContainer: {
        flex: .2,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    imageContainer: {
        paddingBottom: 15
    },
    container: {
        paddingTop: 10,
        flex: 1
    },
    infoContainer: {
        flex: .6
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
        backgroundColor: colors.bitterSweetRed,
        borderRadius: 110,
        justifyContent: "center"
    },
    personality: {
        justifyContent: "flex-start",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    list: {
        paddingHorizontal: 25,
        paddingVertical: 15,
        width: "100%"
    }, upperContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    triContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        borderRadius: 70,
        height: 70,
        width: 70
    },
    skill: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        width: 100,
        padding: 5,
        marginVertical: 2
    },
    tools: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.bitterSweetRed,
        width: 200,
        padding: 5,
        marginVertical: 2
    }

})