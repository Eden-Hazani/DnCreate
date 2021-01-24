import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Modal, ScrollView, Switch } from 'react-native';
import { Unsubscribe } from 'redux';
import switchModifier from '../../../utility/abillityModifierSwitch';
import { attributeColorCodedGuide } from '../../../utility/attributeColorCodedGuide';
import logger from '../../../utility/logger';
import { RollingDiceAnimation } from '../../animations/RollingDiceAnimation';
import { VibrateAnimation } from '../../animations/vibrateAnimation';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ModifiersModel } from '../../models/modifiersModel';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { AttributeHelp } from './AttributeHelp';
import { ManualAttribute } from './ManualAttribute';
import { StandardStatArray } from './StandardStatArray';

interface AttributePickingState {
    finishRolls: boolean
    dicePool: number[]
    diceResults: number[]
    rollingDice: boolean
    sumOfDice: number
    diceI: boolean
    diceII: boolean
    diceIII: boolean
    diceIV: boolean
    numberOfPickedDice: number
    characterInfo: CharacterModel
    jiggleOn: boolean
    pickedRace: RaceModel;
    rollDisabled: boolean[]
    confirmed: boolean
    colorCodedGuide: boolean
    colorCodedGuideArray: any[]
    diceRollOrStatArray: boolean
    firstPick: boolean
    placedResult: number
    returnScoreToAverageList: number
}

export class AttributePicking extends Component<{ route: any, navigation: any }, AttributePickingState> {
    private unsubscribeStore: Unsubscribe;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            returnScoreToAverageList: 0,
            placedResult: -1,
            firstPick: false,
            diceRollOrStatArray: false,
            colorCodedGuideArray: [],
            colorCodedGuide: false,
            confirmed: false,
            rollDisabled: [
                false,
                false,
                false,
                false,
                false,
                false,
            ],
            finishRolls: false,
            dicePool: [],
            pickedRace: store.getState().race,
            jiggleOn: false,
            diceResults: [],
            rollingDice: false,
            sumOfDice: 0,
            diceI: false,
            diceII: false,
            diceIII: false,
            diceIV: false,
            numberOfPickedDice: 0,
            characterInfo: store.getState().character
        }
        this.unsubscribeStore = store.subscribe(() => {
            store.getState().character
        })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    componentDidMount() {
        let colorCodedGuideArray = this.state.colorCodedGuideArray;
        colorCodedGuideArray = attributeColorCodedGuide(this.state.characterInfo.characterClass);
        this.setState({ colorCodedGuideArray })
    }
    onFocus = async () => {
        try {
            let attributes = ["strength", "constitution", "dexterity", "intelligence", "wisdom", "charisma"]
            let characterInfo = { ...this.state.characterInfo };
            let dicePool = this.state.dicePool;
            const rollDisabled = this.state.rollDisabled;
            const diceStorage = await AsyncStorage.getItem(`DicePool`)
            if (diceStorage) {
                dicePool = JSON.parse(diceStorage)
            }
            const item = await AsyncStorage.getItem(`AttributeStage`)
            if (item) {
                characterInfo = JSON.parse(item)
            }
            for (let att of attributes) {
                if (this.state.pickedRace.abilityBonus && characterInfo[att] !== this.state.pickedRace.abilityBonus[att]) {
                    let diceScore = characterInfo[att] - this.state.pickedRace.abilityBonus[att];
                    let indexes = dicePool.map((dice, i) => dice === diceScore ? i : -1)
                        .filter(index => index !== -1);
                    for (let index of indexes) {
                        if (rollDisabled[index] !== true) {
                            rollDisabled[index] = true;
                            break;
                        }
                    }
                    rollDisabled[dicePool.indexOf(diceScore)] = true;
                }
            }
            if (dicePool.length === 6) {
                this.setState({ finishRolls: true })
            }
            if (this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.strength !== undefined
                && this.state.characterInfo.modifiers.constitution !== undefined
                && this.state.characterInfo.modifiers.dexterity !== undefined
                && this.state.characterInfo.modifiers.intelligence !== undefined
                && this.state.characterInfo.modifiers.wisdom !== undefined
                && this.state.characterInfo.modifiers.charisma !== undefined
            ) { this.setState({ finishRolls: true }) }
            this.setState({ characterInfo, dicePool, rollDisabled })
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    componentWillUnmount() {
        this.unsubscribeStore()
    }
    addDice = (diceNumber: number, diceState: any) => {
        if (this.state.diceResults) {
            if (diceState) {
                const sumOfDice = this.state.sumOfDice - diceNumber;
                this.setState({ sumOfDice })
                const numberOfPickedDice = this.state.numberOfPickedDice - 1;
                this.setState({ numberOfPickedDice }, () => {
                    if (this.state.numberOfPickedDice === 3) {
                        this.updatePool()
                        this.resetRoll()
                        if (this.state.dicePool.length === 6) {
                            this.setState({ finishRolls: true })
                        }
                    }
                })
            }
            if (!diceState) {
                const sumOfDice = this.state.sumOfDice + diceNumber;
                this.setState({ sumOfDice })
                const numberOfPickedDice = this.state.numberOfPickedDice + 1;
                this.setState({ numberOfPickedDice }, () => {
                    if (this.state.numberOfPickedDice === 3) {
                        this.updatePool()
                        this.resetRoll()
                        if (this.state.dicePool.length === 6) {
                            this.setState({ finishRolls: true })
                        }
                    }
                })
            }
        }
    }
    resetRoll = () => {
        this.setState({ numberOfPickedDice: 0, diceResults: [], sumOfDice: 0, diceI: false, diceII: false, diceIII: false, diceIV: false })
    }

    rollDice = () => {
        if (this.state.dicePool.length === 6) {
            return;
        }
        this.setState({ rollingDice: true })
        this.resetRoll();
        const diceResults = []
        for (let i = 1; i <= 4; i++) {
            let number = Math.floor(Math.random() * 6) + 1;
            diceResults.push(number)
        }
        this.setState({ diceResults }, () => {
            setTimeout(() => {
                this.setState({ rollingDice: false })
            }, 800);
        })
    }
    updateStat = (attribute: any) => {
        const characterInfo = { ...this.state.characterInfo }
        const baseAtt = characterInfo[attribute]
        characterInfo[attribute] = characterInfo[attribute] + this.state.sumOfDice;
        if (characterInfo.modifiers) {
            characterInfo.modifiers[attribute] = (switchModifier(characterInfo[attribute]));
            this.setState({ characterInfo }, () => {
                AsyncStorage.setItem(`AttributeStage`, JSON.stringify(this.state.characterInfo))
                this.setState({ jiggleOn: false, sumOfDice: 0, placedResult: this.state.sumOfDice })
            })
        }
    }
    updatePool = () => {
        let dicePool = this.state.dicePool;
        dicePool.push(this.state.sumOfDice);
        this.setState({ dicePool }, () => {
            AsyncStorage.setItem(`DicePool`, JSON.stringify(this.state.dicePool))
        });
    }
    setSumAndDisableRoll = (sum: number, roll: number) => {
        let rollDisabled = this.state.rollDisabled;
        rollDisabled[roll] = true;
        this.setState({ sumOfDice: sum, rollDisabled }, () => {
            this.setState({ jiggleOn: true })
        })
    }

    insertInfoAndContinue = () => {
        if (this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.strength !== undefined
            && this.state.characterInfo.modifiers.constitution !== undefined
            && this.state.characterInfo.modifiers.dexterity !== undefined
            && this.state.characterInfo.modifiers.intelligence !== undefined
            && this.state.characterInfo.modifiers.wisdom !== undefined
            && this.state.characterInfo.modifiers.charisma !== undefined
        ) {
            this.setState({ confirmed: true })
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
            AsyncStorage.setItem(`AttributeStage`, JSON.stringify(this.state.characterInfo))
            setTimeout(() => {
                this.props.navigation.navigate("CharBackground");
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        } else {
            alert("Please roll for all attribute points before continuing")
        }
    }



    returnScores = (attribute: any) => {
        const characterInfo = { ...this.state.characterInfo }
        const rollDisabled = this.state.rollDisabled;
        if (this.state.pickedRace.abilityBonus && characterInfo.modifiers) {
            if (this.state.diceRollOrStatArray) {
                this.setState({ returnScoreToAverageList: characterInfo[attribute] - this.state.pickedRace.abilityBonus[attribute] });
            }
            const diceScore = characterInfo[attribute] - this.state.pickedRace.abilityBonus[attribute];
            characterInfo[attribute] = this.state.pickedRace.abilityBonus[attribute];
            characterInfo.modifiers[attribute] = undefined;
            let indexes = this.state.dicePool.map((dice, i) => dice === diceScore ? i : -1)
                .filter(index => index !== -1);
            for (let index of indexes) {
                if (rollDisabled[index] !== false) {
                    rollDisabled[index] = false;
                    break;
                }
            }
            this.setState({ characterInfo, rollDisabled }, () => {
                AsyncStorage.setItem(`AttributeStage`, JSON.stringify(this.state.characterInfo))
                this.setState({ jiggleOn: false, sumOfDice: 0 })
            })
        }
    }

    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always" >
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={[styles.rollingDice, { backgroundColor: this.state.rollingDice ? Colors.softBlack : Colors.pageBackground }]} pointerEvents={this.state.rollingDice ? "none" : "auto"}>
                            {this.state.rollingDice && <View style={{
                                position: 'absolute', top: 0, left: 0,
                                right: 0,
                                bottom: Dimensions.get('screen').height / 2,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <View style={[styles.animationContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                                    <RollingDiceAnimation props />
                                    <View style={{ width: '100%', marginLeft: 50, transform: [{ rotateX: '15deg' }, { rotateY: '30deg' }] }}>
                                        <AppText fontSize={50} color={Colors.whiteInDarkMode}>Rolling Dice</AppText>
                                    </View>
                                </View>
                            </View>}
                            <View style={styles.container}>
                                <View style={styles.attributeContainer} >
                                    <AppText>Strength</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.strength}
                                            isOn={this.state.jiggleOn}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[0] : null}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.strength !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('strength');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.strength ? this.updateStat('strength') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.strength}</AppText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.attributeContainer}>
                                    <AppText>Constitution</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.constitution}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[1] : null}
                                            isOn={this.state.jiggleOn}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.constitution !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('constitution');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.constitution ? this.updateStat('constitution') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.constitution}</AppText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.attributeContainer}>
                                    <AppText>Dexterity</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.dexterity}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[2] : null}
                                            isOn={this.state.jiggleOn}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.dexterity !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('dexterity');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.dexterity ? this.updateStat('dexterity') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.dexterity}</AppText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.attributeContainer}>
                                    <AppText>Intelligence</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.intelligence}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[3] : null}
                                            isOn={this.state.jiggleOn}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.intelligence !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('intelligence');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.intelligence ? this.updateStat('intelligence') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.intelligence}</AppText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.attributeContainer}>
                                    <AppText>Wisdom</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.wisdom}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[4] : null}
                                            isOn={this.state.jiggleOn}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.wisdom !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('wisdom');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.wisdom ? this.updateStat('wisdom') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.wisdom}</AppText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.attributeContainer}>
                                    <AppText>Charisma</AppText>
                                    <View style={styles.stat}>
                                        <VibrateAnimation text={this.state.characterInfo.charisma}
                                            colorCode={this.state.colorCodedGuide ? this.state.colorCodedGuideArray[5] : null}
                                            isOn={this.state.jiggleOn}
                                            onPress={() => {
                                                if ((this.state.characterInfo.modifiers && this.state.characterInfo.modifiers.charisma !== undefined) && this.state.sumOfDice === 0) {
                                                    this.returnScores('charisma');
                                                    return;
                                                }
                                                this.state.sumOfDice > 0 && this.state.finishRolls && this.state.characterInfo.modifiers && !this.state.characterInfo.modifiers.charisma ? this.updateStat('charisma') : null
                                            }} />
                                        <View style={[styles.modifierBox, { backgroundColor: Colors.lightGray }]}>
                                            <AppText textAlign="center">Modifier</AppText>
                                            <AppText textAlign="center">{this.state.characterInfo.modifiers?.charisma}</AppText>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 25 }}>
                                <AppText textAlign={'center'} color={Colors.berries}>Activate color coded help</AppText>
                                <AppText textAlign={'center'} color={Colors.berries}>(recommended for new players)</AppText>
                                <Switch value={this.state.colorCodedGuide} onValueChange={() => {
                                    if (this.state.colorCodedGuide) {
                                        this.setState({ colorCodedGuide: false })
                                        return;
                                    }
                                    this.setState({ colorCodedGuide: true })
                                }} />
                            </View>
                            <View >
                                <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} title={"Roll Dice!"} height={50} borderRadius={25}
                                        width={Dimensions.get('screen').width / 3.2} fontSize={18} onPress={() => {
                                            this.setState({ firstPick: true })
                                            this.state.finishRolls ? alert("No rolls left!") : this.rollDice()
                                        }} />
                                    <AttributeHelp mode={this.state.diceRollOrStatArray} />
                                    <ManualAttribute character={this.state.characterInfo} race={this.props.route.params.race}
                                        finishedRollsAndInsertInfo={(rolls: boolean, characterInfo: CharacterModel) => { this.setState({ finishRolls: rolls, characterInfo }) }} />
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center" }}>
                                    <AppText padding={20} textAlign={'center'}>Switch between average list and Dice rolls (help menu will change accordingly)</AppText>
                                    <Switch disabled={this.state.firstPick} value={this.state.diceRollOrStatArray} onValueChange={() => {
                                        if (this.state.diceRollOrStatArray) {
                                            this.setState({ diceRollOrStatArray: false })
                                            return;
                                        }
                                        this.setState({ diceRollOrStatArray: true })
                                    }} />
                                </View>
                                {this.state.diceRollOrStatArray ?
                                    <StandardStatArray
                                        resetPickedResult={() => { this.setState({ placedResult: -1 }) }}
                                        resetReturnValues={() => { this.setState({ returnScoreToAverageList: -1 }) }}
                                        returnScore={this.state.returnScoreToAverageList}
                                        placedResult={this.state.placedResult}
                                        onCancel={() => {
                                            this.setState({ jiggleOn: false })
                                        }}
                                        onPress={(val: number) => {
                                            this.setState({ sumOfDice: val, finishRolls: true, jiggleOn: true, firstPick: true })
                                        }} />
                                    :
                                    <View>
                                        <View style={styles.dicePool}>
                                            <AppText fontSize={25} color={Colors.bitterSweetRed}>Dice Pool</AppText>
                                            <View style={{ flexDirection: "row" }}>
                                                {this.state.dicePool.map((result, index) =>
                                                    <View key={index} style={{ padding: 5 }}>
                                                        <AppButton disabled={this.state.rollDisabled[index] || !this.state.finishRolls || this.state.sumOfDice > 0}
                                                            borderRadius={10} backgroundColor={Colors.bitterSweetRed} title={result.toString()}
                                                            onPress={() => { this.setSumAndDisableRoll(result, index) }}
                                                            width={50} height={40} fontSize={15} key={result} />
                                                    </View>

                                                )}
                                            </View>
                                        </View>
                                        <View style={styles.diceSumContainer}>
                                            <AppText>Sum Of Dice</AppText>
                                            <TouchableOpacity style={styles.rolledDice} >
                                                <AppText fontSize={35} textAlign={"center"} >{this.state.sumOfDice}</AppText>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.container} pointerEvents={this.state.diceResults.length === 0 ? "none" : "auto"}>
                                            <View style={styles.rolledDiceContainer} >
                                                <AppText>Dice I</AppText>
                                                <TouchableOpacity style={[styles.rolledDice, {
                                                    borderColor: this.state.diceResults.length > 0 ? Colors.pinkishSilver : Colors.whiteInDarkMode,
                                                    borderWidth: this.state.diceResults.length > 0 ? 5 : 1,
                                                    backgroundColor: this.state.diceI ? Colors.berries : Colors.pageBackground
                                                }]}
                                                    disabled={!this.state.diceI && this.state.numberOfPickedDice === 3 ? true : false}
                                                    onPress={() => {
                                                        this.addDice(this.state.diceResults[0], this.state.diceI);
                                                        this.state.diceI ? this.setState({ diceI: false }) : this.setState({ diceI: true })
                                                    }}>
                                                    <AppText fontSize={35} textAlign={"center"} >{this.state.diceResults[0]}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.rolledDiceContainer}>
                                                <AppText>Dice II</AppText>
                                                <TouchableOpacity style={[styles.rolledDice, {
                                                    borderColor: this.state.diceResults.length > 0 ? Colors.pinkishSilver : Colors.whiteInDarkMode,
                                                    borderWidth: this.state.diceResults.length > 0 ? 5 : 1,
                                                    backgroundColor: this.state.diceII ? Colors.berries : Colors.pageBackground
                                                }]}
                                                    disabled={!this.state.diceII && this.state.numberOfPickedDice === 3 ? true : false}
                                                    onPress={() => {
                                                        this.addDice(this.state.diceResults[1], this.state.diceII);
                                                        this.setState({ diceII: true })
                                                        this.state.diceII ? this.setState({ diceII: false }) : this.setState({ diceII: true })
                                                    }}>
                                                    <AppText fontSize={35} textAlign={"center"} >{this.state.diceResults[1]}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.rolledDiceContainer}>
                                                <AppText>Dice III</AppText>
                                                <TouchableOpacity style={[styles.rolledDice, {
                                                    borderColor: this.state.diceResults.length > 0 ? Colors.pinkishSilver : Colors.whiteInDarkMode,
                                                    borderWidth: this.state.diceResults.length > 0 ? 5 : 1,
                                                    backgroundColor: this.state.diceIII ? Colors.berries : Colors.pageBackground
                                                }]}
                                                    disabled={!this.state.diceIII && this.state.numberOfPickedDice === 3 ? true : false}
                                                    onPress={() => {
                                                        this.addDice(this.state.diceResults[2], this.state.diceIII);
                                                        this.setState({ diceIII: true })
                                                        this.state.diceIII ? this.setState({ diceIII: false }) : this.setState({ diceIII: true })
                                                    }}>
                                                    <AppText fontSize={35} textAlign={"center"} >{this.state.diceResults[2]}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.rolledDiceContainer}>
                                                <AppText>Dice IV</AppText>
                                                <TouchableOpacity style={[styles.rolledDice, {
                                                    borderColor: this.state.diceResults.length > 0 ? Colors.pinkishSilver : Colors.whiteInDarkMode,
                                                    borderWidth: this.state.diceResults.length > 0 ? 5 : 1,
                                                    backgroundColor: this.state.diceIV ? Colors.berries : Colors.pageBackground
                                                }]}
                                                    disabled={!this.state.diceIV && this.state.numberOfPickedDice === 3 ? true : false}
                                                    onPress={() => {
                                                        this.addDice(this.state.diceResults[3], this.state.diceIV);
                                                        this.setState({ diceIV: true })
                                                        this.state.diceIV ? this.setState({ diceIV: false }) : this.setState({ diceIV: true })
                                                    }}>
                                                    <AppText fontSize={35} textAlign={"center"} >{this.state.diceResults[3]}</AppText>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                            height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                    </View>}
            </ScrollView>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        flexDirection: 'row',

    },
    dicePool: {
        paddingTop: 25,
        alignItems: "center"
    },
    stat: {
        alignItems: "center",
        flexDirection: "row"
    },
    modifierBox: {
        borderWidth: 1,
        borderRadius: 5
    },

    rollingDice: {
        width: Dimensions.get('screen').width,
    },
    rolledDice: {
        width: 80,
        height: 80,
        borderRadius: 25,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    rolledDiceContainer: {
        paddingVertical: 2,
        paddingHorizontal: 10,
        alignItems: 'center',
        width: "25%"
    },
    diceSumContainer: {
        paddingHorizontal: 10,
        alignItems: 'center',
        width: "100%"
    },
    attributeContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        width: "33%"
    },
    animationContainer: {
        width: 200,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 300,
        zIndex: 1
    }
});