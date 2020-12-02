import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Alert, Vibration } from 'react-native';
import { IconGen } from '../components/IconGen';
import { Colors } from '../config/colors';
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
import { AttackRollTutorial } from './charOptions/AttackRollTutorial';
import { charHasMagic } from './charOptions/helperFunctions/charHasMagic';
import { CompleteSkillList } from '../components/CompleteSkillList';
import { racialArmorBonuses } from './charOptions/helperFunctions/racialArmorBonuses';

/**
 * 
 * @param  image: image url-string || URI
 *   
 */
interface SelectCharacterState {
    attackRollTutorialModal: boolean
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
    completeSkillModel: boolean
    cashedSavingThrows: []
}

export class SelectCharacter extends Component<{ route: any, navigation: any }, SelectCharacterState>{
    private UnsubscribeStore: Unsubscribe;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            cashedSavingThrows: [],
            completeSkillModel: false,
            attackRollTutorialModal: false,
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
        })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
        this.UnsubscribeStore()
        this.setState({ loading: true })
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
        this.refreshData().then(() => {
            this.maxHpCheck();
            this.setState({ loading: false })
        })
    }


    componentDidMount() {
        let startCharInfo: CharacterModel = null;
        if (this.state.isDm) {
            startCharInfo = this.props.route.params.character;
        }
        if (!this.state.isDm) {
            startCharInfo = store.getState().character;
        }
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
        this.setState({ character: startCharInfo }, async () => {
            this.loadCashedSavingThrows()
            if (await AsyncStorage.getItem(`${this.state.character._id}FirstTimeOpened`) !== null && levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)) {
                const { operation, action } = await levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character);
                this.setState({ levelUpFunctionActive: operation, levelUpFunction: action });
            }
            this.maxHpCheck();
            this.setState({ currentLevel: this.state.character.level })
            this.setState({ currentProficiency: switchProficiency(this.state.character.level) })

        })
    }

    loadCashedSavingThrows = async () => {
        const cashedSavingThrows = await AsyncStorage.getItem(`${this.state.character._id}SavingThrows`);
        const savingThrows: any = cashedSavingThrows !== null ? getSpecialSaveThrows(this.state.character).concat(JSON.parse(cashedSavingThrows)) : getSpecialSaveThrows(this.state.character)
        this.setState({ cashedSavingThrows: savingThrows })
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
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: JSON.parse(character) })
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
                    const character = { ...this.state.character };
                    if (!character.path) {
                        character.path = null
                    }
                    await AsyncStorage.setItem(`current${this.state.character._id}level${this.state.character.level}`, JSON.stringify(character));
                    character.level = validLevel;
                    this.setState({ character, currentLevel: validLevel }, () => {
                        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
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
        if (this.state.character.path?.name === "Draconic Bloodline") {
            maxHp = maxHp + 1
        }
        character.maxHp = maxHp;
        this.setState({ character }, async () => {
            userCharApi.updateChar(this.state.character)
            const levelUpTreeFunc = await levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)
            if (levelUpTreeFunc) {
                const { operation, action } = levelUpTreeFunc;
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
            if (this.state.character.path?.name === "Draconic Bloodline") {
                maxHp = maxHp + 1
            }
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
                            <ScrollView style={{ backgroundColor: Colors.pageBackground }} keyboardShouldPersistTaps="always">
                                <LevelUpOptions options={this.state.levelUpFunction} character={this.state.character} close={this.handleLevelUpFunctionActiveCloser} refresh={this.refreshData} />
                            </ScrollView>
                        </Modal>
                        <View>
                            <View style={styles.imageContainer}>
                                <View style={styles.upperContainer}>
                                    <View style={{ flexDirection: "column", paddingLeft: 2 }}>
                                        <Image style={styles.image} source={{ uri: `${Config.serverUrl}/assets/${this.state.character.image}` }} />
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.name}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.race}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.characterClass}</AppText>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 10 }}>
                                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Initiative</AppText>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25} >{this.state.character.modifiers.dexterity}</AppText>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Level</AppText>
                                                <TouchableOpacity disabled={isDm} style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}
                                                    onPress={() => {
                                                        Vibration.vibrate(400)
                                                        this.setLevel(this.state.character.level + 1)
                                                    }}
                                                    onLongPress={() => {
                                                        Vibration.vibrate(400)
                                                        this.setLevel(this.state.character.level - 1)
                                                    }}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{this.state.character.level}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Max HP</AppText>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{`${this.state.character.maxHp}`}</AppText>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{`+${this.state.currentProficiency}`}</AppText>
                                                </View>
                                                <AppText textAlign={'center'}>Proficiency Bonus</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{this.state.character.equippedArmor.ac + racialArmorBonuses(this.state.character.race)}</AppText>
                                                </View>
                                                <AppText>AC</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <TouchableOpacity disabled={this.state.isDm} onPress={() => { this.setState({ setCurrentHpModal: true }) }} style={[styles.triContainer, { borderColor: Colors.whiteInDarkMode, backgroundColor: hpColors(parseInt(this.state.currentHp), this.state.character.maxHp) }]}>
                                                    <AppText color={Colors.black} fontSize={25}>{this.state.currentHp}</AppText>
                                                </TouchableOpacity>
                                                <AppText>Current Hp</AppText>
                                            </View>
                                            <Modal visible={this.state.setCurrentHpModal}>
                                                <View style={{ flex: 1, alignItems: "center", backgroundColor: Colors.pageBackground }}>
                                                    <AppText color={Colors.bitterSweetRed} fontSize={35}>Insert Current Hp</AppText>
                                                    <AppTextInput keyboardType={'numeric'} iconName={'plus'} onChangeText={(hp: string) => { this.setState({ currentHp: hp }) }} />
                                                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Ok'} onPress={() => { this.setCurrentHp() }} />
                                                </View>
                                            </Modal>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ backGroundStoryVisible: true })}>
                                <IconGen size={80} backgroundColor={Colors.primary} name={"book-open-page-variant"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Background Story</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.backGroundStoryVisible} animationType="slide">
                                <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                    <View style={{ flex: .8, padding: 25 }}>
                                        <AppText textAlign={"left"} fontSize={35} color={Colors.bitterSweetRed}>{`${this.state.character.name}'s Story`}</AppText>
                                        <AppText textAlign={"left"} fontSize={20}>{this.state.character.backStory}</AppText>
                                    </View>
                                    <View style={{ flex: .1, padding: 25 }}>
                                        <AppText textAlign={"left"} fontSize={25}>{this.state.character.background.backgroundName}</AppText>
                                        <View>
                                            {this.state.character.background.backgroundFeatureName === '' ?
                                                <View>
                                                    <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>No background feature.</AppText>
                                                </View>
                                                :
                                                <View>
                                                    <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>Background feature</AppText>
                                                    <AppText textAlign={"left"} fontSize={20}>{this.state.character.background.backgroundFeatureName}</AppText>
                                                    <AppText textAlign={"left"} fontSize={17}>{this.state.character.background.backgroundFeatureDescription}</AppText>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    <View style={{ flex: .1, flexDirection: "row", justifyContent: "space-evenly", alignContent: "center" }}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Close'} onPress={() => this.setState({ backGroundStoryVisible: false })} />
                                        <AppButton disabled={isDm} backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'Update Story'} onPress={() => {
                                            this.setState({ backGroundStoryVisible: false }, () => {
                                                this.props.navigation.navigate("CharBackstory", { updateStory: true, character: this.state.character })
                                            })
                                        }} />
                                    </View>
                                </ScrollView>
                            </Modal>

                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ statsVisible: true })}>
                                <IconGen size={80} backgroundColor={Colors.bitterSweetRed} name={"sword"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Ability Score &amp; Modifiers</AppText>
                                </View>
                            </TouchableOpacity>
                            <Modal visible={this.state.statsVisible} animationType="slide">
                                <View style={{ flex: .9, alignItems: "center", backgroundColor: Colors.pageBackground }}>
                                    <AppText color={Colors.bitterSweetRed} fontSize={35}>Stats</AppText>
                                    <AppText fontSize={30} >{`${this.state.character.race} ${this.state.character.characterClass}`}</AppText>
                                    <FlatList
                                        data={this.listStats()}
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
                                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} title={'close'} onPress={() => this.setState({ statsVisible: false })} />
                                </View>
                            </Modal>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharItems", { isDm: this.state.isDm ? this.props.route.params.character : null }) }}>
                                <IconGen size={80} backgroundColor={Colors.danger} name={"sack"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Items And Currency</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secRowIconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharFeatures", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.shadowBlue} name={"pentagon"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Features</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharFeats", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.orange} name={"atlassian"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Feats</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("Spells", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.berries} name={"fire"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Spell Book</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secRowIconContainer}>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("Armor", { char: this.state.character, isDm: this.state.isDm }) }}>
                                <IconGen size={80} backgroundColor={Colors.paleGreen} name={"tshirt-crew"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Armor</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("PathFeatures", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.metallicBlue} name={"chart-arc"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Path Features</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("RaceFeatures", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.pinkishSilver} name={"human-handsdown"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Race Features</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.secRowIconContainer}>
                            <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CreatePDF", { char: this.state.character, proficiency: this.state.currentProficiency }) }}>
                                <IconGen size={80} backgroundColor={Colors.burgundy} name={"file-pdf-box"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Generate Pdf</AppText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("PersonalNotes", { char: this.state.character }) }}>
                                <IconGen size={80} backgroundColor={Colors.primaryBackground} name={"feather"} iconColor={Colors.white} />
                                <View style={{ width: 90, marginTop: 10 }}>
                                    <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Personal notes</AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <UniqueCharStats character={this.state.character} proficiency={this.state.currentProficiency} isDm={this.state.isDm} />
                        </View>
                        <View>
                            <AppText textAlign={'center'}>Saving Throws</AppText>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                                {this.state.cashedSavingThrows.map(saveThrow =>
                                    <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, margin: 5 }} key={saveThrow}>
                                        <AppText fontSize={18}>{saveThrow} </AppText>
                                    </View>)}
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={[styles.list, { width: '40%' }]}>
                                    <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'center'}>Proficient skills:</AppText>
                                    {this.state.character.skills.map(skill =>
                                        <View key={skill} style={[styles.skill, { borderColor: Colors.bitterSweetRed }]}>
                                            <AppText textAlign={'center'}>{`${skill[0]}`}</AppText>
                                            <AppText fontSize={20} color={Colors.bitterSweetRed}
                                                textAlign={'center'}>{`${((this.skillCheck(skill) + this.state.currentProficiency) + skillExpertiseCheck(skill[1], this.state.currentProficiency) <= 0 ? "" : "+")} ${(this.skillCheck(skill) + this.state.currentProficiency) + skillExpertiseCheck(skill[1], this.state.currentProficiency)}`}</AppText>
                                        </View>
                                    )}
                                    <AppButton backgroundColor={Colors.bitterSweetRed} width={80} height={50} borderRadius={25} title={'complete skill list'}
                                        onPress={() => { this.setState({ completeSkillModel: true }) }} />
                                    <Modal visible={this.state.completeSkillModel} animationType={'slide'}>
                                        <View>
                                            <CompleteSkillList character={this.state.character} />
                                        </View>
                                        <View>
                                            <AppButton backgroundColor={Colors.bitterSweetRed} width={150} height={50} borderRadius={25} title={'close'}
                                                onPress={() => { this.setState({ completeSkillModel: false }) }} />
                                        </View>
                                    </Modal>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", width: "55%" }}>
                                    <AppText fontSize={25}>Hit Dice</AppText>
                                    <AppText fontSize={25} color={Colors.bitterSweetRed}>{`D${hitDiceSwitch(this.state.character.characterClass)}`}</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>Attack Modifiers {'\n'} (Add to damage roll)</AppText>
                                    <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers.strength > 0 ? '+' : null} {this.state.character.modifiers.strength} for melee weapons</AppText>
                                    </View>
                                    <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers.dexterity > 0 ? '+' : null} {this.state.character.modifiers.dexterity} for ranged weapons</AppText>
                                    </View>
                                    <AppText textAlign={'center'} fontSize={18}>Proficient weapons {'\n'} (add to attack roll)</AppText>
                                    <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                        <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                                            <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} + the fitting ability modifier for the weapon</AppText>
                                        </View>
                                        <AppText textAlign={'center'} fontSize={16}>Includes {this.state.character.characterClassId.weaponProficiencies.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
                                    </View>
                                    {this.state.character.addedWeaponProf.length > 0 &&
                                        <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                            <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                                                <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} + the fitting ability modifier for the weapon</AppText>
                                            </View>
                                            <AppText textAlign={'center'} fontSize={16}>Includes {this.state.character.addedWeaponProf.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
                                        </View>}
                                    <View>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} width={200} height={50} borderRadius={25} title={'Issues with bonuses?'} onPress={() => { this.setState({ attackRollTutorialModal: true }) }} />
                                        <Modal visible={this.state.attackRollTutorialModal} animationType={'slide'}>
                                            <AttackRollTutorial closeWindow={(boolean: boolean) => { this.setState({ attackRollTutorialModal: boolean }) }} />
                                        </Modal>
                                    </View>
                                </View>
                            </View>
                            {this.state.character.languages &&
                                <View style={[styles.list, { width: '100%' }]}>
                                    <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Languages:</AppText>
                                    {this.state.character.languages.map((lang, index) =>
                                        <View key={index} style={[styles.tools, { borderColor: Colors.bitterSweetRed }]}>
                                            <AppText>{lang}</AppText>
                                        </View>
                                    )}
                                </View>
                            }
                            <View style={[styles.list, { width: '100%' }]}>
                                <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Tools:</AppText>
                                {this.state.character.tools.map((tool, index) =>
                                    <View key={index} style={[styles.tools, { borderColor: Colors.bitterSweetRed }]}>
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
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Traits:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.personalityTraits.map((trait, index) => <AppText key={index}>{`${index + 1}. ${trait}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharIdeals", { updateIdeals: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Ideals:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.ideals.map((ideal, index) => <AppText key={index}>{`${index + 1}. ${ideal}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharFlaws", { updateFlaws: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Flaws:</AppText>
                                        {this.state.character.flaws.map((flaw, index) => <AppText key={index}>{`${index + 1}. ${flaw}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharBonds", { updateBonds: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Bonds:</AppText>
                                        {this.state.character.bonds.map((bond, index) => <AppText key={index}>{`${index + 1}. ${bond}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View>
                            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={30}>Magic</AppText>
                            {charHasMagic(this.state.character) ? <CharMagic isDm={this.state.isDm} reloadChar={() => {
                                this.setState({ character: store.getState().character })
                            }} character={this.state.character} currentProficiency={this.state.currentProficiency} /> :
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
        borderRadius: 70,
        height: 70,
        width: 70
    },
    skill: {
        borderRadius: 10,
        borderWidth: 1,
        width: 100,
        padding: 5,
        marginVertical: 2
    },
    tools: {
        borderRadius: 10,
        borderWidth: 1,
        width: 200,
        padding: 5,
        marginVertical: 2
    }

})