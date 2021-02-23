import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Keyboard } from 'react-native';
import * as Progress from 'react-native-progress';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { experienceCalculator } from '../screens/charOptions/helperFunctions/experienceCalculator';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppTextInput } from './forms/AppTextInput';
import * as xpChart from '../../jsonDump/experienceLevelChart.json'
import userCharApi from '../api/userCharApi';
import { toHsv } from 'react-native-color-picker';
import { IconGen } from './IconGen';
import AsyncStorage from '@react-native-community/async-storage';

interface ExperienceCalculatorState {
    xpTextVal: string
    error: boolean
    character: CharacterModel
    animatedPosition: Animated.ValueXY;
    visible: boolean
}
export class ExperienceCalculator extends Component<{ issueLevelUp: any, character: CharacterModel, currentExperience: number, goalLevel: number }, ExperienceCalculatorState>{
    position: any
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false,
            animatedPosition: new Animated.ValueXY({ x: xpChart[this.props.goalLevel] >= 100000 ? -235 : -215, y: 0 }),
            error: false,
            xpTextVal: '',
            character: this.props.character
        }
        this.position = {
            position: 'absolute',
            bottom: -50
        }
    }

    moveAnimation = () => {
        Animated.timing(this.state.animatedPosition, {
            toValue: { x: this.state.visible ? 10 : xpChart[this.props.goalLevel] >= 100000 ? -235 : -215, y: 0 },
            duration: 100,
            useNativeDriver: false
        }).start()
    }
    async componentDidMount() {
        if (!await AsyncStorage.getItem('firstTimeXPBar')) {
            this.setState({ visible: true }, async () => {
                this.moveAnimation();
                await AsyncStorage.setItem('firstTimeXPBar', 'true')
            })
        }
    }

    render() {
        return (
            <View style={!this.state.visible && this.position}>
                <Animated.View style={[styles.container, this.state.animatedPosition.getLayout()]}>
                    <View style={{ flexDirection: "row" }}>
                        <View>
                            <View style={{ flexDirection: 'row' }}>
                                <AppText>Current Experience </AppText>
                                <AppText> {this.props.currentExperience} / {xpChart[this.props.goalLevel]}</AppText>
                            </View>
                            <Progress.Bar color={Colors.bitterSweetRed} progress={experienceCalculator(this.props.currentExperience, this.props.goalLevel)} width={200} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ alignSelf: "baseline", top: 5 }}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} height={30} width={70} fontSize={14} borderRadius={50} title={"Update XP"}
                                        onPress={() => {
                                            Keyboard.dismiss()
                                            const character = { ...this.state.character };
                                            if (character.currentExperience) {
                                                character.currentExperience = character.currentExperience + parseInt(this.state.xpTextVal)
                                            }
                                            if (!character.currentExperience) {
                                                character.currentExperience = 0 + parseInt(this.state.xpTextVal)
                                            }
                                            this.setState({ character }, () => {
                                                this.setState({ xpTextVal: '' })
                                                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                                                userCharApi.updateChar(this.state.character).then(() => {
                                                    if (experienceCalculator(this.props.currentExperience, this.props.goalLevel) >= 1) {
                                                        this.props.issueLevelUp()
                                                    }
                                                })
                                            })
                                        }} />
                                </View>
                                <View style={{ width: 150, right: 10 }}>
                                    <AppTextInput
                                        defaultValue={this.state.xpTextVal.toString()}
                                        placeholder={'new XP'}
                                        keyboardType="numeric" onChangeText={(xpTextVal: string) => {
                                            const regex = new RegExp("^[0-9]+$")
                                            if (!regex.test(xpTextVal) && xpTextVal.length !== 0) {
                                                this.setState({ error: true })
                                                return;
                                            }
                                            this.setState({ xpTextVal: xpTextVal, error: false })
                                        }} />
                                </View>
                                {this.state.error && <View style={{ width: 150 }}>
                                    <AppText color={Colors.danger}>Can only contain numbers!</AppText>
                                </View>}
                            </View>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: "baseline" }} onPress={() => {
                            if (this.state.visible) {
                                this.setState({ visible: false }, () => this.moveAnimation())
                                return
                            }
                            this.setState({ visible: true }, () => this.moveAnimation())
                        }}>
                            <AppText color={Colors.bitterSweetRed} fontSize={17}>XP</AppText>
                            <View style={{ top: 5 }}>
                                <IconGen name={this.state.visible ? 'chevron-left' : 'chevron-right'} size={70} iconColor={Colors.bitterSweetRed} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});