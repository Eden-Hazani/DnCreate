import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, FlatList, ScrollView, Alert, Vibration, Animated, Dimensions } from 'react-native';
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
import { armorBonusCalculator } from './charOptions/helperFunctions/armorBonusCalculator';
import AuthContext from '../auth/context';
import * as modifierNameList from '../../jsonDump/modifierNamingList.json'
import { CharEquipmentTree } from '../components/characterEquipment/CharEquipmentTree';
import logger from '../../utility/logger';
import { Easing } from 'react-native-reanimated';
import { PersonalInfo } from '../components/PersonalInfo';
import { RaceModel } from '../models/raceModel';
import { ChangeMaxHp } from '../components/ChangeMaxHp';
import { TutorialScreen } from '../components/TutorialScreen';
import { ExperienceCalculator } from '../components/ExperienceCalculator';
import { killToolArrayDuplicates } from '../../utility/killToolArrayDuplicates';
import { Image as CashImage } from 'react-native-expo-image-cache'
import { ProficientSkillList } from './charOptions/ProficiantSkillList';
import { DiceRolling } from '../animations/DiceRolling';
const { height, width } = Dimensions.get('window');

/**
 * 
 * @param  image: image url-string || URI
 *   
 */
interface SelectCharacterState {
    tutorialZIndex: boolean[]
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
    startingAnimations: Animated.ValueXY[]
    personalInfoModal: boolean
    maxHpChangeModal: boolean
    tutorialOn: boolean
    containerHeight: number
    diceRolling: boolean
    scrollHandle: number
    currentDiceRollValue: number
    diceType: number
    diceAmount: number
}

export class SelectCharacter extends Component<{ route: any, navigation: any }, SelectCharacterState>{
    private UnsubscribeStore: Unsubscribe;
    navigationSubscription: any;
    private scrollView: any
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            diceAmount: 0,
            diceType: 0,
            currentDiceRollValue: 0,
            diceRolling: false,
            tutorialZIndex: [],
            containerHeight: 0,
            tutorialOn: false,
            maxHpChangeModal: false,
            personalInfoModal: false,
            startingAnimations: [],
            completeSkillModel: false,
            attackRollTutorialModal: false,
            setCurrentHpModal: false,
            currentHp: '',
            levelUpFunctionActive: false,
            levelUpFunction: null,
            currentProficiency: 0,
            currentLevel: 0,
            loading: true,
            backGroundStoryVisible: false,
            statsVisible: false,
            character: new CharacterModel(),
            resetHpModal: false,
            isDm: this.props.route.params.isDm,
            scrollHandle: 0
        }
        this.UnsubscribeStore = store.subscribe(() => {
            this.setState({ character: store.getState().character })
        })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
        this.scrollView
    }

    componentWillUnmount() {
        this.navigationSubscription()
        this.UnsubscribeStore()
        this.setState({ loading: true })
    }

    refreshData = async () => {
        try {
            this.setState({ loading: true })
            if (await AsyncStorage.getItem('isOffline')) {
                const stringChars = await AsyncStorage.getItem('offLineCharacterList');
                this.loadCashedSavingThrows()
                if (stringChars) {
                    const characters = JSON.parse(stringChars);
                    const character = characters.find((char: CharacterModel) => char._id === this.state.character._id)
                    this.setState({ character }, () => {
                        this.setState({ loading: false })
                    });
                }
                return;
            }
            const response = await userCharApi.getChar(this.state.character._id ? this.state.character._id : "");
            if (!response.ok) {
                errorHandler(response);
                return;
            }
            const character = response.data;
            this.loadCashedSavingThrows()
            if (character) {
                this.setState({ character }, () => {
                    this.setState({ loading: false })
                });
            }
        } catch (err) {
            errorHandler(err)
        }
    }

    onFocus = async () => {
        this.setState({ loading: true })
        this.refreshData().then(() => {
            this.maxHpCheck();
            this.setState({ loading: false })
        })
    }


    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            if (this.props.route.params.isDm) {
                this.setState({ loading: true })
                setTimeout(() => {
                    this.props.navigation.navigate("Adventures")
                }, 400);
                return
            }
            e.preventDefault()
            this.setState({ loading: true }, () => this.props.navigation.dispatch(e.data.action))
        })
        let startingAnimations: Animated.ValueXY[] = []
        for (let i = 0; i < 7; i++) {
            startingAnimations.push(new Animated.ValueXY({ x: 0, y: -900 }));
        }
        this.setState({ startingAnimations })
        let startCharInfo: CharacterModel = new CharacterModel();
        if (this.state.isDm) {
            startCharInfo = this.props.route.params.character;
        }
        if (!this.state.isDm) {
            startCharInfo = store.getState().character;
        }
        startCharInfo.tools = killToolArrayDuplicates(startCharInfo.tools || [])
        this.setState({ character: startCharInfo }, async () => {
            this.loadCashedSavingThrows().then(async () => {
                if (!await AsyncStorage.getItem('newPlayer')) {
                    Alert.alert("Tutorial?", "We see you are a new player, would you like a short tutorial of DnCreate's character sheet?",
                        [{
                            text: 'Yes', onPress: () => {
                                this.setState({ tutorialOn: true })
                            }
                        }, { text: 'No', onPress: async () => await AsyncStorage.setItem('newPlayer', "true") }])
                }
                if (await AsyncStorage.getItem(`${this.state.character._id}FirstTimeOpened`) !== null && levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)) {
                    const { operation, action } = await levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character);
                    this.setState({ levelUpFunctionActive: operation, levelUpFunction: action });
                }
                this.maxHpCheck();
                if (this.state.character.level) {
                    this.setState({ currentLevel: this.state.character.level })
                    this.setState({ currentProficiency: switchProficiency(this.state.character.level) })
                }
                this.setState({ loading: false }, () => {
                    setTimeout(() => {
                        this.startAnimations()
                    }, 150);
                })
            })
        })
    }

    startAnimations = () => {
        let index: number = 200;
        for (let item in this.state.startingAnimations) {
            Animated.timing(this.state.startingAnimations[item], {
                toValue: { x: 0, y: 0 },
                duration: index,
                useNativeDriver: false,
            }).start()
            index = index + 100
        }
    }

    loadCashedSavingThrows = async () => {
        if (!this.state.character.savingThrows || this.state.character.savingThrows.length === 0) {
            const character = { ...this.state.character };
            const cashedSavingThrows = await AsyncStorage.getItem(`${this.state.character._id}SavingThrows`);
            const savingThrows: any = cashedSavingThrows !== null ? getSpecialSaveThrows(this.state.character).concat(JSON.parse(cashedSavingThrows)) : getSpecialSaveThrows(this.state.character)
            character.savingThrows = savingThrows;
            this.setState({ character }, () => userCharApi.updateChar(this.state.character))
        }
    }


    listStats = () => {
        const char = this.state.character;
        if (this.state.character.modifiers) {
            const modifiers: any[] = Object.entries(this.state.character.modifiers);
            modifiers[0].push(char.strength);
            modifiers[1].push(char.constitution);
            modifiers[2].push(char.dexterity);
            modifiers[3].push(char.intelligence);
            modifiers[4].push(char.wisdom);
            modifiers[5].push(char.charisma);
            return modifiers;
        }
        return []
    }

    updateOfflineChar = async (character: CharacterModel) => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === character._id) {
                    characters[index] = character;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }

    setLevel = (level: number) => {
        let validLevel: number = level;
        if (this.state.character.level && level < this.state.character.level) {
            if (level === 0) {
                return;
            }
            Alert.alert("Lowering Level", "Are you sure you want to lower your level?", [{
                text: 'Yes', onPress: async () => {
                    if (level < 0 || level.toString() === '') {
                        validLevel = 1;
                    }
                    const character = await AsyncStorage.getItem(`current${this.state.character._id}level${level}`);
                    if (character) {
                        store.dispatch({ type: ActionType.SetInfoToChar, payload: JSON.parse(character) })
                        this.setState({ character: JSON.parse(character), currentLevel: validLevel }, () => {
                            this.setState({ currentProficiency: switchProficiency(this.state.currentLevel) })
                            if (this.context.user._id === "Offline") {
                                this.updateOfflineChar(this.state.character);
                                this.setState({ currentHp: this.state.character.maxHp ? this.state.character.maxHp.toString() : "0" });
                                this.refreshData();
                                return;
                            }
                            userCharApi.updateChar(this.state.character).then(() => {
                                this.setState({ currentHp: this.state.character.maxHp ? this.state.character.maxHp.toString() : "0" });
                                this.refreshData();
                            })
                        })
                    }
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

    levelUpByExperience = async (level: number) => {
        let validLevel: number = level;
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

    skillCheck = (skill: string) => {
        if (this.state.character.modifiers) {
            const modifiers = Object.entries(this.state.character.modifiers)
            const skillGroup = skillModifier(skill);
            for (let item of modifiers) {
                if (item[0] === skillGroup) {
                    return item[1]
                }
            }
        }
    }


    levelUp = async () => {
        const character = { ...this.state.character };
        const hitDice = hitDiceSwitch(this.state.character.characterClass);
        let maxHp: number = this.state.character.maxHp ? this.state.character.maxHp : 0;
        maxHp = (maxHp + Math.floor(Math.random() * hitDice) + 1) + (this.state.character.modifiers && this.state.character.modifiers.constitution ? this.state.character.modifiers.constitution : 0);
        if (this.state.character.path?.name === "Draconic Bloodline") {
            maxHp = maxHp + 1
        }
        if (this.state.character.characterClass === "Paladin" && character.level) {
            let layOnHandsAmount = 5 * character.level;
            await AsyncStorage.setItem(`layOnHands${character._id}`, JSON.stringify(layOnHandsAmount));
        }
        character.maxHp = maxHp;
        this.setState({ character }, async () => {
            this.context.user._id === "Offline" ? this.updateOfflineChar(this.state.character) : userCharApi.updateChar(this.state.character);
            const levelUpTreeFunc = await levelUpTree[this.state.character.characterClass](this.state.character.level, this.state.character)
            if (levelUpTreeFunc) {
                const { operation, action } = levelUpTreeFunc;
                this.setState({ levelUpFunctionActive: operation, levelUpFunction: action });
            }
            this.setState({ currentHp: this.state.character.maxHp ? this.state.character.maxHp.toString() : "0" }, async () => {
                await AsyncStorage.setItem(`${this.state.character._id}currentHp`, this.state.currentHp);
            });
        })
    }




    maxHpCheck = async () => {
        if (!this.state.character.maxHp) {
            const character = { ...this.state.character };
            let maxHp = hitDiceSwitch(this.state.character.characterClass) + (this.state.character.modifiers && this.state.character.modifiers.constitution ? this.state.character.modifiers.constitution : 0);
            if (this.state.character.path?.name === "Draconic Bloodline") {
                maxHp = maxHp + 1
            }
            character.maxHp = maxHp;
            this.setState({ character }, async () => {
                const currentHp = await AsyncStorage.getItem(`${this.state.character._id}currentHp`);
                currentHp ? this.setState({ currentHp: currentHp }) : this.setState({ currentHp: this.state.character.maxHp ? this.state.character.maxHp.toString() : "0" });
                this.context.user._id === "Offline" ? this.updateOfflineChar(this.state.character) : userCharApi.updateChar(this.state.character);
            })
        }
        const currentHp = await AsyncStorage.getItem(`${this.state.character._id}currentHp`);
        currentHp ? this.setState({ currentHp: currentHp }) : this.setState({ currentHp: this.state.character.maxHp ? this.state.character.maxHp.toString() : "0" });
        return this.state.character.maxHp;
    }


    handleLevelUpFunctionActiveCloser = (closed: boolean) => {
        this.setState({ levelUpFunctionActive: closed })
    }

    setCurrentHp = async () => {
        await AsyncStorage.setItem(`${this.state.character._id}currentHp`, this.state.currentHp);
        this.setState({ setCurrentHpModal: false })
    }


    setSavingThrows = () => {
        try {
            const list = modifierNameList.list.map((modifierName, index) => {
                let midRes = '';
                if (this.state.character.savingThrows) {
                    if (this.state.character.savingThrows.includes(modifierName) && this.state.character.modifiers) {
                        midRes = `${modifierName} ${parseInt(this.state.character.modifiers[modifierName.toLowerCase()]) + this.state.currentProficiency > 0 ? '+' : ""} ${parseInt(this.state.character.modifiers[modifierName.toLowerCase()]) + this.state.currentProficiency}`
                    }
                    if ((!this.state.character.savingThrows.includes(modifierName)) && this.state.character.modifiers) {
                        midRes = `${modifierName} ${parseInt(this.state.character.modifiers[modifierName.toLowerCase()]) > 0 ? '+' : ""} ${parseInt(this.state.character.modifiers[modifierName.toLowerCase()])}`
                    }
                }
                return <TouchableOpacity onPress={() => {
                    let number = midRes.match(/\d/g);
                    if (number) {
                        this.setState({ diceRolling: true, diceAmount: 1, diceType: 20, currentDiceRollValue: parseInt(number.join("")) })
                    }
                }}
                    key={index} style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, margin: 5, width: 150 }} >
                    <AppText textAlign={'center'} fontSize={18}>{midRes}</AppText>
                </TouchableOpacity>
            })
            return list
        } catch (err) {
            logger.log
            return []
        }
    }

    endTutorial = async () => {
        await AsyncStorage.setItem('newPlayer', "true");
        this.setState({ tutorialOn: false })
    }

    rollDamageWithWeapon = () => {
        if (!this.state.character.currentWeapon?.modifier) {
            alert('Using DnCreate to roll for damage is only available if your weapon has an assigned modifier, go to the weapons circle and edit your weapon with the modifier you want then try again :)')
            return;
        }
        if (this.state.character.modifiers && this.state.character.currentWeapon.dice) {
            this.setState({
                diceAmount: this.state.character.currentWeapon.diceAmount || 1, diceType: parseInt(this.state.character.currentWeapon.dice.split('D')[1] || '0'), diceRolling: true,
                currentDiceRollValue: this.state.character.modifiers[this.state.character.currentWeapon.modifier.toLowerCase()]
            })
        }
    }

    rollHitWithWeapon = () => {
        if (this.state.character.modifiers && this.state.character.currentWeapon?.isProficient && this.state.character.currentWeapon.modifier) {
            this.setState({
                diceAmount: 1, diceType: 20, diceRolling: true,
                currentDiceRollValue: this.state.character.modifiers[this.state.character.currentWeapon.modifier.toLowerCase()] + this.state.currentProficiency
            })
        } else {
            this.setState({
                diceAmount: 1, diceType: 20, diceRolling: true,
                currentDiceRollValue: this.state.currentProficiency
            })
        }
    }

    render() {
        const isDm = this.state.isDm;
        return (
            <ScrollView
                scrollEnabled={!this.state.diceRolling}
                onScroll={(event) => {
                    this.setState({ scrollHandle: event.nativeEvent.contentOffset.y })
                }}
                onLayout={(evt) => {
                    const { height } = evt.nativeEvent.layout;
                    const { containerHeight } = this.state;
                    if (!containerHeight || containerHeight !== height) {
                        this.setState({ containerHeight: height })
                    }
                }}
                style={{ flex: 1 }} keyboardShouldPersistTaps="always" ref={view => this.scrollView = view}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={styles.container}>
                        {this.state.tutorialOn &&
                            <>
                                <TutorialScreen
                                    zIndex={(val: number) => {
                                        let tutorialZIndex = { ...this.state.tutorialZIndex };
                                        tutorialZIndex = []
                                        tutorialZIndex[val] = true
                                        this.setState({ tutorialZIndex })
                                    }}
                                    pageHeight={this.state.containerHeight} end={() => this.endTutorial()}
                                    changeScrollPosition={(val: any) => this.scrollView.scrollTo({ x: val.x, y: val.y, animated: true })} />
                            </>}

                        {this.state.tutorialOn || this.state.diceRolling && <View style={[StyleSheet.absoluteFillObject, { position: "absolute", backgroundColor: Colors.black, opacity: .7, zIndex: 3 }]}></View>}
                        {this.state.diceRolling && <View style={[{
                            zIndex: 10, position: 'absolute', top: this.state.scrollHandle + (this.state.diceAmount > 2 ? 50 : height / 3),
                            left: 0, right: 0, bottom: 0
                        }]}>
                            <DiceRolling diceAmount={this.state.diceAmount} diceType={this.state.diceType} rollValue={this.state.currentDiceRollValue} close={() => this.setState({ diceRolling: false, currentDiceRollValue: 0, diceType: 0, diceAmount: 0 })} />
                        </View>}
                        <Modal visible={this.state.levelUpFunctionActive} animationType="slide">
                            <ScrollView style={{ backgroundColor: Colors.pageBackground }} keyboardShouldPersistTaps="always">
                                <LevelUpOptions options={this.state.levelUpFunction} character={this.state.character} close={this.handleLevelUpFunctionActiveCloser} refresh={this.refreshData} />
                            </ScrollView>
                        </Modal>
                        <Modal visible={this.state.personalInfoModal} animationType="slide">
                            <PersonalInfo character={this.state.character} close={(val: boolean) => { this.setState({ personalInfoModal: val }) }} />
                        </Modal>
                        <View>
                            <View style={styles.imageContainer}>
                                <View style={styles.upperContainer}>
                                    <Animated.View style={[this.state.startingAnimations[6].getLayout(), { flexDirection: "column", paddingLeft: 2 }]}>
                                        <TouchableOpacity onPress={() => { this.setState({ personalInfoModal: true }) }}>
                                            <Image style={styles.image} source={{ uri: this.state.character.image ? `${Config.serverUrl}/assets/races/${this.state.character.image}` : `${Config.serverUrl}/assets/backgroundDragons/blankDragon.png` }} />
                                        </TouchableOpacity>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.name}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.race}</AppText>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.characterClass}</AppText>
                                    </Animated.View>
                                    <View pointerEvents={this.state.tutorialZIndex[0] ? "none" : "auto"}
                                        style={{ flex: 1, marginLeft: 10, zIndex: this.state.tutorialZIndex[0] ? 10 : 0 }}>
                                        <Animated.View style={[this.state.startingAnimations[6].getLayout(), { flexDirection: "row", alignItems: "center" }]}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Initiative</AppText>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25} >{this.state.character.modifiers && this.state.character.modifiers.dexterity}</AppText>
                                                </View>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Level</AppText>
                                                <TouchableOpacity disabled={isDm} style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}
                                                    onPress={() => {
                                                        Vibration.vibrate(400)
                                                        if (this.state.character.level) {
                                                            this.setLevel(this.state.character.level + 1)
                                                        }
                                                    }}
                                                    onLongPress={() => {
                                                        Vibration.vibrate(400)
                                                        if (this.state.character.level) {
                                                            this.setLevel(this.state.character.level - 1)
                                                        }
                                                    }}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{this.state.character.level}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <AppText>Max HP</AppText>
                                                <TouchableOpacity onPress={() => this.setState({ maxHpChangeModal: true })}
                                                    style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{`${this.state.character.maxHp}`}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <Modal visible={this.state.maxHpChangeModal} animationType="slide">
                                                <ChangeMaxHp character={this.state.character}
                                                    sendNewMax={(val: number) => {
                                                        const character = this.state.character;
                                                        character.maxHp = val;
                                                        this.setState({ character }, () => this.setState({ maxHpChangeModal: false }))
                                                    }}
                                                    currentMax={this.state.character.maxHp} />
                                            </Modal>
                                        </Animated.View>
                                        <Animated.View style={[this.state.startingAnimations[5].getLayout(), { flexDirection: "row" }]}>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{`+${this.state.currentProficiency}`}</AppText>
                                                </View>
                                                <AppText textAlign={'center'}>Proficiency Bonus</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <View style={[styles.triContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                                    <AppText color={Colors.totalWhite} fontSize={25}>{
                                                        armorBonusCalculator(this.state.character, this.state.character.equippedArmor && this.state.character.equippedArmor.ac ? this.state.character.equippedArmor.ac : 0,
                                                            this.state.character.equippedArmor ? this.state.character.equippedArmor.armorBonusesCalculationType : "") + racialArmorBonuses(this.state.character.raceId ? this.state.character.raceId : new RaceModel())}</AppText>
                                                </View>
                                                <AppText>AC</AppText>
                                            </View>
                                            <View style={{ alignItems: "center", flex: .3 }}>
                                                <TouchableOpacity disabled={this.state.isDm} onPress={() => { this.setState({ setCurrentHpModal: true }) }} style={[styles.triContainer, { borderColor: Colors.whiteInDarkMode, backgroundColor: hpColors(parseInt(this.state.currentHp), this.state.character.maxHp ? this.state.character.maxHp : 0) }]}>
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
                                        </Animated.View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Animated.View style={this.state.startingAnimations[5].getLayout()}>
                            <View style={{ position: 'relative', marginTop: 10, marginBottom: 10 }}>
                                <ExperienceCalculator issueLevelUp={() => {
                                    this.levelUpByExperience((this.state.character.level || 0) + 1)
                                }}
                                    character={this.state.character} currentExperience={this.state.character.currentExperience || 0}
                                    goalLevel={(this.state.character.level || 0) + 1} />

                            </View>
                        </Animated.View>
                        <View pointerEvents={this.state.tutorialZIndex[1] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[1] ? 10 : 0 }}>
                            <Animated.View style={[this.state.startingAnimations[4].getLayout(), styles.secRowIconContainer]}>
                                <TouchableOpacity style={{ alignItems: "center" }} onPress={() => this.setState({ backGroundStoryVisible: true })}>
                                    <IconGen size={80} backgroundColor={Colors.primary} name={"book-open-page-variant"} iconColor={Colors.white} />
                                    <View style={{ width: 90, marginTop: 10 }}>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>{this.state.character.name}'s Story</AppText>
                                    </View>
                                </TouchableOpacity>
                                <Modal visible={this.state.backGroundStoryVisible} animationType="slide">
                                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                        <CashImage uri={`${Config.serverUrl}/assets/specificDragons/backstoryDragon.png`} style={{ width: 150, height: 150, alignSelf: "center" }} />
                                        <View style={{ flex: .8, padding: 25 }}>
                                            <AppText textAlign={"left"} fontSize={35} color={Colors.bitterSweetRed}>{`${this.state.character.name}'s Story`}</AppText>
                                            <AppText textAlign={"left"} fontSize={20}>{this.state.character.backStory}</AppText>
                                        </View>
                                        <View style={{ flex: .1, padding: 25 }}>
                                            <AppText textAlign={"left"} fontSize={25}>{this.state.character.background && this.state.character.background.backgroundName}</AppText>
                                            <View>
                                                {this.state.character.background && this.state.character.background.backgroundFeatureName === '' ?
                                                    <View>
                                                        <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>No background feature.</AppText>
                                                    </View>
                                                    :
                                                    <View>
                                                        <AppText textAlign={"left"} fontSize={20} color={Colors.berries}>Background feature</AppText>
                                                        <AppText textAlign={"left"} fontSize={20}>{this.state.character.background && this.state.character.background.backgroundFeatureName}</AppText>
                                                        <AppText textAlign={"left"} fontSize={17}>{this.state.character.background && this.state.character.background.backgroundFeatureDescription}</AppText>
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
                            </Animated.View>
                            <Animated.View style={[this.state.startingAnimations[3].getLayout(), styles.secRowIconContainer]}>
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
                            </Animated.View>
                            <Animated.View style={[this.state.startingAnimations[2].getLayout(), styles.secRowIconContainer]}>
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
                            </Animated.View>
                            <Animated.View style={[this.state.startingAnimations[1].getLayout(), styles.secRowIconContainer]}>
                                <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CreatePDF", { char: this.state.character, proficiency: this.state.currentProficiency }) }}>
                                    <IconGen size={80} backgroundColor={Colors.burgundy} name={"file-pdf-box"} iconColor={Colors.white} />
                                    <View style={{ width: 90, marginTop: 10 }}>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Generate Pdf</AppText>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharWeapons", { char: this.state.character }) }}>
                                    <IconGen size={80} backgroundColor={Colors.pastelPink} name={"sword-cross"} iconColor={Colors.white} />
                                    <View style={{ width: 90, marginTop: 10 }}>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Weapons</AppText>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("CharEquipment", { char: this.state.character }) }}>
                                    <IconGen size={80} backgroundColor={Colors.earthYellow} name={"necklace"} iconColor={Colors.white} />
                                    <View style={{ width: 90, marginTop: 10 }}>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Wearable Equipment</AppText>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={[this.state.startingAnimations[0].getLayout(), styles.secRowIconContainer]}>
                                <TouchableOpacity disabled={this.state.isDm} style={{ alignItems: "center" }} onPress={() => { this.props.navigation.navigate("PersonalNotes", { char: this.state.character }) }}>
                                    <IconGen size={80} backgroundColor={Colors.primaryBackground} name={"feather"} iconColor={Colors.white} />
                                    <View style={{ width: 90, marginTop: 10 }}>
                                        <AppText textAlign="center" fontSize={15} color={Colors.whiteInDarkMode}>Personal notes</AppText>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        <View pointerEvents={this.state.tutorialZIndex[2] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[2] ? 10 : 0 }}>
                            <View>
                                <CharEquipmentTree character={this.state.character} />
                            </View>
                            <View>
                                <UniqueCharStats character={this.state.character} proficiency={this.state.currentProficiency} isDm={this.state.isDm} />
                            </View>
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[3] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[3] ? 10 : 0 }}>
                            <View>
                                <AppText fontSize={20} textAlign={'center'}>Saving Throws</AppText>
                                <View style={{ borderWidth: 1, borderRadius: 15, borderColor: Colors.bitterSweetRed, margin: 20, padding: 15 }}>
                                    <AppText fontSize={18} padding={5} textAlign={'center'}>Proficient Saving Throws</AppText>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center', flexWrap: 'wrap' }}>
                                        {this.state.character.savingThrows && this.state.character.savingThrows.map((sThrow, index) => <View key={index} style={{ padding: 5 }}>
                                            <AppText>{sThrow}</AppText>
                                        </View>)}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", alignItems: 'center', flexWrap: 'wrap' }}>
                                    {this.setSavingThrows()}
                                </View>
                            </View>
                            <View>
                                <AppText textAlign={'center'} fontSize={18} padding={15}>DnCreate can roll for you, just hit the skill, tool, save throw, or hit dice and let the dice roll!</AppText>
                            </View>
                            <View style={styles.infoContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={[styles.list, { width: '40%' }]}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} fontSize={30} width={100} height={50} borderRadius={25} title={'complete skill list'}
                                            onPress={() => { this.setState({ completeSkillModel: true }) }} />
                                        <ProficientSkillList isDm={this.state.isDm}
                                            diceRolling={(val: any) => this.setState({ diceAmount: 1, diceRolling: val.diceRolling, currentDiceRollValue: val.rollValue, diceType: 20 })}
                                            character={this.state.character} currentProficiency={this.state.currentProficiency} />
                                        <View style={{ paddingTop: 15 }}>
                                            <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                                                width={110} height={60} borderRadius={25} title={'Replace skill proficiencies'}
                                                onPress={() => { this.props.navigation.navigate("ReplaceProficiencies", { char: this.state.character, profType: "skills" }) }} />
                                        </View>
                                        <Modal visible={this.state.completeSkillModel} animationType={'slide'}>
                                            <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                                <CompleteSkillList close={(val: boolean) => this.setState({ completeSkillModel: val })} onPress={(val: number) => this.setState({ diceAmount: 1, diceRolling: true, diceType: 20, currentDiceRollValue: val })} character={this.state.character} />
                                            </ScrollView>
                                        </Modal>
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center", width: "55%" }}>
                                        {this.state.character.currentWeapon && this.state.character.currentWeapon.name ?
                                            <View style={{ borderColor: Colors.whiteInDarkMode, borderRadius: 15, borderWidth: 1 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                                    <TouchableOpacity style={{ backgroundColor: Colors.bitterSweetRed, width: '40%', borderRadius: 10, margin: 2 }}
                                                        disabled={this.state.isDm} onPress={() => this.rollDamageWithWeapon()}>
                                                        <AppText textAlign={'center'}>Roll{`\n`}Damage</AppText>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={{ backgroundColor: Colors.bitterSweetRed, width: '40%', borderRadius: 10, margin: 2 }}
                                                        disabled={this.state.isDm} onPress={() => this.rollHitWithWeapon()}>
                                                        <AppText textAlign={'center'}>Roll{`\n`}Hit Chance</AppText>
                                                    </TouchableOpacity>
                                                </View>
                                                <AppText fontSize={25} textAlign={'center'}>Weapon Hit Dice</AppText>
                                                <AppText fontSize={15} textAlign={'center'}>Your currently equipped weapon does the following damage</AppText>
                                                <AppText fontSize={25} textAlign={'center'} color={Colors.bitterSweetRed}>{this.state.character.currentWeapon.diceAmount}-{this.state.character.currentWeapon.dice}</AppText>
                                            </View>
                                            : null}
                                        <AppText fontSize={25}>Base Hit Dice</AppText>
                                        <AppText fontSize={25} color={Colors.bitterSweetRed}>{`D${hitDiceSwitch(this.state.character.characterClass)}`}</AppText>
                                        <AppText textAlign={'center'} fontSize={18}>Attack Modifiers {'\n'} (Add to damage roll)</AppText>
                                        <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                            <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers && this.state.character.modifiers.strength && this.state.character.modifiers.strength > 0 ? '+' : null} {this.state.character.modifiers && this.state.character.modifiers.strength} for melee weapons</AppText>
                                        </View>
                                        <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                            <AppText textAlign={'center'} fontSize={16}>{this.state.character.modifiers && this.state.character.modifiers.dexterity && this.state.character.modifiers.dexterity > 0 ? '+' : null} {this.state.character.modifiers && this.state.character.modifiers.dexterity} for ranged weapons</AppText>
                                        </View>
                                        <AppText textAlign={'center'} fontSize={18}>Proficient weapons {'\n'} (add to attack roll)</AppText>
                                        <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                            <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                                                <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} + the fitting ability modifier for the weapon</AppText>
                                            </View>
                                            <AppText textAlign={'center'} fontSize={16}>Includes {this.state.character.characterClassId && this.state.character.characterClassId.weaponProficiencies &&
                                                this.state.character.characterClassId.weaponProficiencies.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
                                        </View>
                                        {this.state.character.addedWeaponProf && this.state.character.addedWeaponProf.length > 0 &&
                                            <View style={{ borderColor: Colors.bitterSweetRed, borderWidth: 1, borderRadius: 15, padding: 5, marginBottom: 10 }}>
                                                <View style={{ borderWidth: 1, borderColor: Colors.berries, borderRadius: 15, backgroundColor: Colors.pinkishSilver }}>
                                                    <AppText textAlign={'center'} fontSize={16}>+{this.state.currentProficiency} + the fitting ability modifier for the weapon</AppText>
                                                </View>
                                                <AppText textAlign={'center'} fontSize={16}>Includes {this.state.character.addedWeaponProf.map((v, index) => <AppText key={index}>{`\n`} - {v} - </AppText>)}</AppText>
                                            </View>}
                                        <View>
                                            <AppButton backgroundColor={Colors.bitterSweetRed} width={120} height={60} borderRadius={25} title={'Issues with bonuses?'} onPress={() => { this.setState({ attackRollTutorialModal: true }) }} />
                                            <Modal visible={this.state.attackRollTutorialModal} animationType={'slide'}>
                                                <AttackRollTutorial closeWindow={(boolean: boolean) => { this.setState({ attackRollTutorialModal: boolean }) }} />
                                            </Modal>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[4] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[4] ? 10 : 0 }}>
                            <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Languages:</AppText>
                            {this.state.character.languages &&
                                <View style={[styles.list, { width: '100%', flexDirection: 'row', justifyContent: "space-evenly" }]}>
                                    <View>
                                        {this.state.character.languages.map((lang, index) =>
                                            <View key={index} style={[styles.tools, { borderColor: Colors.bitterSweetRed, maxHeight: 30 }]}>
                                                <AppText>{lang}</AppText>
                                            </View>
                                        )}
                                    </View>
                                    <View style={{ paddingLeft: 15 }}>
                                        <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                                            width={110} height={60} borderRadius={25} title={'Change Languages'}
                                            onPress={() => { this.props.navigation.navigate("ReplaceLanguages", { char: this.state.character }) }} />
                                    </View>
                                </View>
                            }
                            <View style={[styles.list, { width: '100%' }]}>
                                <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Tools:</AppText>
                                {this.state.character.tools && this.state.character.tools.map((tool, index) =>
                                    <View key={index} style={[styles.tools, { borderColor: Colors.bitterSweetRed }]}>
                                        <AppText>{`${tool[0]} +${(this.state.currentProficiency) + skillExpertiseCheck(tool[1], this.state.currentProficiency)}`}</AppText>
                                    </View>
                                )}
                            </View>
                            <View style={{ paddingTop: 5, alignSelf: "flex-start", paddingBottom: 10, paddingLeft: 25 }}>
                                <AppButton backgroundColor={Colors.earthYellow} fontSize={20}
                                    width={110} height={60} borderRadius={25} title={'Replace tool proficiencies'}
                                    onPress={() => { this.props.navigation.navigate("ReplaceProficiencies", { char: this.state.character, profType: "tools" }) }} />
                            </View>
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[5] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[5] ? 10 : 0 }}>
                            <View style={styles.personality}>
                                <View style={{ width: '30%', paddingLeft: 18 }}>
                                    <AppText textAlign={'center'}>To change any your personality traits, alignment, or appearance long press on the text you wish to change.</AppText>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharPersonalityTraits", { updateTraits: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Traits:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.personalityTraits && this.state.character.personalityTraits.map((trait, index) => <AppText key={index}>{`${index + 1}. ${trait}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharIdeals", { updateIdeals: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Ideals:</AppText>
                                    </TouchableOpacity>
                                    {this.state.character.ideals && this.state.character.ideals.map((ideal, index) => <AppText key={index}>{`${index + 1}. ${ideal}`}</AppText>)}
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharFlaws", { updateFlaws: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Flaws:</AppText>
                                        {this.state.character.flaws && this.state.character.flaws.map((flaw, index) => <AppText key={index}>{`${index + 1}. ${flaw}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.list}>
                                    <TouchableOpacity disabled={isDm} onLongPress={() => { this.props.navigation.navigate("CharBonds", { updateBonds: true, character: this.state.character }) }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20} textAlign={'left'}>Bonds:</AppText>
                                        {this.state.character.bonds && this.state.character.bonds.map((bond, index) => <AppText key={index}>{`${index + 1}. ${bond}`}</AppText>)}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity disabled={isDm} onLongPress={() => this.props.navigation.navigate("CharacterAlignment", { updateAlignment: true, character: this.state.character })}
                                style={{ alignItems: "center", marginBottom: 20 }}>
                                <AppText fontSize={26} color={Colors.bitterSweetRed} textAlign={"center"}>Alignment</AppText>
                                {this.state.character.characterAlignment ?
                                    <View>
                                        {this.state.character.characterAlignment.alignment && this.state.character.characterAlignment.alignment.length > 0 ?
                                            <AppText fontSize={20}>{this.state.character.characterAlignment.alignment}</AppText>
                                            :
                                            null}
                                        {this.state.character.characterAlignment.alignmentDescription && this.state.character.characterAlignment.alignmentDescription.length > 0 ?
                                            <AppText fontSize={16}>{this.state.character.characterAlignment?.alignmentDescription}</AppText>
                                            :
                                            null}
                                    </View>
                                    : null}
                            </TouchableOpacity>
                            <TouchableOpacity disabled={isDm} onLongPress={() => this.props.navigation.navigate("CharacterAppearance", { updateAppearance: true, character: this.state.character })}
                                style={{ alignItems: "center", marginBottom: 20 }}>
                                <AppText fontSize={26} color={Colors.bitterSweetRed} textAlign={"center"}>Appearance</AppText>
                                {this.state.character.characterAppearance && <AppText fontSize={15}>{this.state.character.characterAppearance}</AppText>}
                            </TouchableOpacity>
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[6] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[6] ? 10 : 0 }}>
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