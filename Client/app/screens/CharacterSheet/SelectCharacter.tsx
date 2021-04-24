import React, { Component } from 'react';
import { View, StyleSheet, Modal, ScrollView, Alert, Dimensions } from 'react-native';
import { Colors } from '../../config/colors';
import { AppText } from '../../components/AppText';
import { CharacterModel } from '../../models/characterModel';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import userCharApi from '../../api/userCharApi';
import switchProficiency from '../../../utility/ProficiencyBonusSwitch';
import skillModifier from '../../../utility/skillModifier';
import hitDiceSwitch from '../../../utility/hitDiceSwitch';
import { LevelUpOptions } from '../charOptions/LevelUpOptions';
import errorHandler from '../../../utility/errorHander';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UniqueCharStats } from '../charOptions/UniqueCharStats';
import { CharMagic } from '../charOptions/CharMagic';
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { charHasMagic } from '../charOptions/helperFunctions/charHasMagic';
import AuthContext from '../../auth/context';
import { CharEquipmentTree } from '../../components/characterEquipment/CharEquipmentTree';
import { TutorialScreen } from '../../components/TutorialScreen';
import { ExperienceCalculator } from '../../components/ExperienceCalculator';
import { killToolArrayDuplicates } from '../../../utility/killToolArrayDuplicates';
import { DiceRolling } from '../../animations/DiceRolling';
import { SheetBaseInfo } from './SheetBaseInfo';
import { SheetInformationCircles } from './SheetInformationCircles';
import { SheetInfoFirstRow } from './SheetInfoCircles/SheetInfoFirstRow';
import { SheetInfoSecondRow } from './SheetInfoCircles/SheetInfoSecondRow';
import { SheetInfoThirdRow } from './SheetInfoCircles/SheetInfoThirdRow';
import { SheetInfoForthRow } from './SheetInfoCircles/SheetInfoForthRow';
import { SheetInfoFifthRow } from './SheetInfoCircles/SheetInfoFifthRow';
import { SheetSavingThrows } from './SheetSavingThrows';
import { SheetSkillLists } from './SheetInfoCircles/SheetSkillLists';
import { SheetEquippedWeapon } from './SheetEquippedWeapon';
import { SheetHitDiceInfo } from './SheetHitDiceInfo';
import { SheetLanguages } from './SheetLanguages';
import { SheetTools } from './SheetTools';
import { SheetPersonality } from './SheetPersonality';
import { checkForFirstLevelStart, loadCashedSavingThrows } from './functions/startUpFunction';
import { levelUpByExperience, lowerLevel, upperLevel } from './functions/leveling';
import { maxHpCheck } from './functions/statisticFunctions';


interface SelectCharacterState {
    tutorialZIndex: boolean[]
    currentHp: string
    levelUpFunctionActive: boolean
    levelUpFunction: any
    character: CharacterModel
    loading: boolean
    currentLevel: number
    currentProficiency: number,
    isDm: boolean
    completeSkillModel: boolean
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
            completeSkillModel: false,
            currentHp: '',
            levelUpFunctionActive: false,
            levelUpFunction: null,
            currentProficiency: 0,
            currentLevel: 0,
            loading: true,
            character: this.props.route.params.isDm ? this.props.route.params.character : store.getState().character,
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
                loadCashedSavingThrows(this.state.character)
                if (stringChars) {
                    const characters = JSON.parse(stringChars);
                    const character = characters.find((char: CharacterModel) => char._id === this.state.character._id)
                    this.setState({ character }, () => {
                        this.setState({ loading: false })
                    });
                }
                return;
            }
            const response = await userCharApi.getChar(this.state.character._id || '');
            if (!response.ok) {
                errorHandler(response);
                return;
            }
            const character = response.data;
            loadCashedSavingThrows(this.state.character)
            if (character) {
                this.setState({ character }, () => {
                    this.setState({ loading: false, currentProficiency: switchProficiency(this.state.character.level || 0) })
                });
            }
        } catch (err) {
            errorHandler(err)
        }
    }

    onFocus = async () => {
        this.setState({ loading: true })
        this.refreshData().then(async () => {
            const currentHp = await maxHpCheck(this.state.character, this.context.user._id)
            this.setState({ loading: false, currentHp })
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
        let character: CharacterModel = { ...this.state.character };
        character.tools = killToolArrayDuplicates(character.tools || [])
        this.setState({ character: character }, async () => {
            this.startUp()
        })
    }

    startUp = async () => {
        const result = await checkForFirstLevelStart(this.state.character);
        if (result) {
            this.setState({ levelUpFunctionActive: result.levelUpFunctionActive, levelUpFunction: result.levelUpFunction })
        }
        loadCashedSavingThrows(this.state.character).then(async () => {
            const currentHp = await maxHpCheck(this.state.character, this.context.user._id)
            this.setState({
                currentHp,
                currentLevel: this.state.character.level || 0,
                currentProficiency: switchProficiency(this.state.character.level || 0),
                loading: false
            })
        })
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
        if (this.state.character.level && level < this.state.character.level) {
            Alert.alert("Lowering Level", "Are you sure you want to lower your level?", [{
                text: 'Yes', onPress: async () => {
                    const result = await lowerLevel(level, this.state.character, this.context.user._id, this.props.route.params.index)
                    if (result) {
                        this.setState({ currentHp: result })
                    }
                    this.refreshData()
                    return;
                }
            }, {
                text: 'No'
            }])
        } else {
            Alert.alert("Level Up", "Are you sure you wish to level up?", [{
                text: 'Yes', onPress: async () => {
                    const result = await upperLevel(level, this.state.character, this.context.user._id, this.props.route.params.index)
                    if (result) {
                        const { char, levelUpResult, currentHp } = result
                        if (levelUpResult.action) {
                            this.setState({ character: char, levelUpFunctionActive: levelUpResult.operation, levelUpFunction: levelUpResult.action, currentHp })
                        } else {
                            this.refreshData()
                        }
                    }
                }
            }, { text: 'No' }])
        }
    }


    levelUpByXpBar = async (level: number, updatedExperience: number) => {
        const result = await levelUpByExperience(level, this.state.character, this.context.user._id, this.props.route.params.index, updatedExperience)
        if (result) {
            const { char, levelUpResult, currentHp } = result
            if (levelUpResult.action) {
                this.setState({ character: char, levelUpFunctionActive: levelUpResult.operation, levelUpFunction: levelUpResult.action, currentHp })
            } else {
                this.refreshData()
            }
        }
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


    handleLevelUpFunctionActiveCloser = (closed: boolean) => {
        this.setState({ levelUpFunctionActive: closed })
    }


    endTutorial = async () => {
        await AsyncStorage.setItem('newPlayer', "true");
        this.setState({ tutorialOn: false })
    }


    render() {
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
                                    returnTutorialStatus={(tutorialOn: boolean) => this.setState({ tutorialOn })}
                                    characterClass={this.state.character}
                                    pageHeight={this.state.containerHeight} end={() => this.endTutorial()}
                                    changeScrollPosition={(val: any) => this.scrollView.scrollTo({ x: val.x, y: val.y, animated: true })} />
                            </>}

                        {this.state.diceRolling &&
                            <DiceRolling scrollHandle={this.state.scrollHandle} showResults={true} isClosedTimer={false} returnResultArray={() => { }} diceAmount={this.state.diceAmount} diceType={this.state.diceType}
                                rollValue={this.state.currentDiceRollValue} close={() => this.setState({ diceRolling: false, currentDiceRollValue: 0, diceType: 0, diceAmount: 0 })} />
                        }
                        <Modal visible={this.state.levelUpFunctionActive} animationType="slide">
                            <ScrollView style={{ backgroundColor: Colors.pageBackground }} keyboardShouldPersistTaps="always">
                                <LevelUpOptions index={this.props.route.params.index} options={this.state.levelUpFunction} character={this.state.character} close={this.handleLevelUpFunctionActiveCloser} refresh={this.refreshData} />
                            </ScrollView>
                        </Modal>

                        <View style={styles.upperContainer}>
                            <SheetBaseInfo character={this.state.character} />
                            <View pointerEvents={this.state.tutorialZIndex[0] ? "none" : "auto"}
                                style={{ flex: 1, marginLeft: 10, zIndex: this.state.tutorialZIndex[0] ? 10 : 0 }}>
                                <SheetInformationCircles
                                    rollDice={(currentDiceRollValue: number) => this.setState({ diceRolling: true, diceAmount: 1, diceType: 20, currentDiceRollValue })}
                                    changeLevel={(newLevel: number) => this.setLevel(newLevel)}
                                    character={this.state.character}
                                    currentHp={this.state.currentHp}
                                    currentProficiency={this.state.currentProficiency}
                                    isDm={this.state.isDm}
                                    returnCurrentHp={(currentHp: string) => this.setState({ currentHp })}
                                    returnMaxHp={() => this.refreshData()}
                                />
                            </View>
                        </View>

                        <ExperienceCalculator issueLevelUp={(updatedExperience: number) => {
                            this.levelUpByXpBar((this.state.character.level || 0) + 1, updatedExperience)
                        }}
                            character={this.state.character} currentExperience={this.state.character.currentExperience || 0}
                            goalLevel={(this.state.character.level || 0) + 1} />


                        <View pointerEvents={this.state.tutorialZIndex[1] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[1] ? 10 : 0 }}>
                            <SheetInfoFirstRow character={this.state.character} isDm={this.state.isDm} navigation={this.props.navigation} />
                            <SheetInfoSecondRow character={this.state.character} isDm={this.state.isDm} navigation={this.props.navigation} />
                            <SheetInfoThirdRow character={this.state.character} isDm={this.state.isDm} navigation={this.props.navigation} />
                            <SheetInfoForthRow character={this.state.character} isDm={this.state.isDm} navigation={this.props.navigation} proficiency={this.state.currentProficiency} />
                            <SheetInfoFifthRow character={this.state.character} isDm={this.state.isDm} navigation={this.props.navigation} />
                        </View>

                        <View pointerEvents={this.state.tutorialZIndex[2] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[2] ? 10 : 0 }}>
                            <CharEquipmentTree character={this.state.character} />
                            <UniqueCharStats character={this.state.character} proficiency={this.state.currentProficiency} isDm={this.state.isDm} />
                        </View>


                        <View pointerEvents={this.state.tutorialZIndex[3] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[3] ? 10 : 0 }}>
                            <SheetSavingThrows character={this.state.character}
                                currentProficiency={this.state.currentProficiency}
                                saveThrowDiceRoll={(currentDiceRollValue: number) =>
                                    this.setState({ diceRolling: true, diceAmount: 1, diceType: 20, currentDiceRollValue })} />
                            <AppText textAlign={'center'} fontSize={18} padding={15}>DnCreate can roll for you, just hit the skill, tool, save throw, or hit dice and let the dice roll!</AppText>
                            <View style={styles.infoContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <SheetSkillLists
                                        character={this.state.character}
                                        currentProficiency={this.state.currentProficiency}
                                        isDm={this.state.isDm}
                                        navigation={this.props.navigation}
                                        rollSkillDice={({ diceRolling, currentDiceRollValue }: any) => this.setState({ diceAmount: 1, diceRolling, diceType: 20, currentDiceRollValue })} />

                                    <View style={{ justifyContent: "center", alignItems: "center", width: "55%" }}>
                                        <SheetEquippedWeapon
                                            character={this.state.character}
                                            currentProficiency={this.state.currentProficiency}
                                            isDm={this.state.isDm}
                                            returnRoll={({ diceType, currentDiceRollValue, diceAmount, diceRolling }: any) =>
                                                this.setState({ diceType, currentDiceRollValue, diceAmount, diceRolling })}
                                        />
                                        <SheetHitDiceInfo
                                            character={this.state.character}
                                            currentProficiency={this.state.currentProficiency} />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[4] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[4] ? 10 : 0 }}>
                            <SheetLanguages
                                character={this.state.character}
                                navigation={this.props.navigation} />
                            <SheetTools
                                character={this.state.character}
                                navigation={this.props.navigation}
                                currentProficiency={this.state.currentProficiency}
                            />
                        </View>
                        <View pointerEvents={this.state.tutorialZIndex[5] ? "none" : "auto"} style={{ zIndex: this.state.tutorialZIndex[5] ? 10 : 0 }}>
                            <SheetPersonality
                                character={this.state.character}
                                navigation={this.props.navigation}
                                isDm={this.state.isDm} />
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
    container: {
        paddingTop: 10,
        flex: 1
    },
    infoContainer: {
        flex: .6
    },
    upperContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
})