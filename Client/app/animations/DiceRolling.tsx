import React, { Component } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-community/async-storage';

interface DiceRollingState {
    currentImages: string[]
    showResults: boolean
    animatedVal: Animated.Value
    animatedXYVal: Animated.ValueXY[]
    animatedPopVal: Animated.Value
    diceResultArray: number[]
    diceResult: {
        result: number,
        mainDice: number
    }
}
const animateOption1: any[] = [[-30, -120], [100, 500], [220, +250], [-30, 300], [0, 0]];
const animateOption2: any[] = [[100, 0], [100, -300], [220, 350], [-30, -60], [0, 0]];
const animateOption3: any[] = [[200, -100], [50, 300], [220, 460], [-30, 250], [0, 0]];
const animateOption4: any[] = [[-50, 120], [50, 300], [-220, -50], [-50, 120], [0, 0]];
const animateOption5: any[] = [[-10, 160], [50, 60], [220, -50], [-30, 130], [0, 0]];
const animateOption6: any[] = [[-30, 400], [50, -60], [100, -150], [-30, 200], [0, 0]];
const animateOption7: any[] = [[30, 200], [50, -160], [120, -250], [-10, -150], [0, 0]];
const animateOption8: any[] = [[30, 150], [-50, -300], [120, -120], [60, 365], [0, 0]];
const animateOption9: any[] = [[30, 220], [-50, -175], [20, -220], [20, 165], [0, 0]];
const animateOption10: any[] = [[30, 130], [-50, -225], [20, 220], [-50, 465], [0, 0]];

const test = (diceAmount: number, diceType: number) => {
    let currentImages = [];
    let animatedXYVal = [];
    for (let i = 0; i < diceAmount; i++) {
        currentImages.push(`${Config.serverUrl}/assets/misc/diceRollsD${diceType}/diceRollAni.gif`)
        animatedXYVal.push(new Animated.ValueXY({ x: 0, y: 0 }))
    }
    return { currentImages, animatedXYVal }
}

export class DiceRolling extends Component<{ diceAmount: number, diceType: number, rollValue: number, close: any }, DiceRollingState>{
    constructor(props: any) {
        super(props)
        this.state = {
            diceResultArray: [],
            animatedPopVal: new Animated.Value(0),
            diceResult: { result: 0, mainDice: 0 },
            animatedXYVal: test(this.props.diceAmount, this.props.diceType).animatedXYVal,
            animatedVal: new Animated.Value(0),
            showResults: false,
            currentImages: test(this.props.diceAmount, this.props.diceType).currentImages
        }
    }
    animatePop = () => {
        Animated.timing(this.state.animatedPopVal, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false
        }).start();
    }

    animateRoll = () => {
        Animated.loop(Animated.timing(this.state.animatedVal, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
        }), { iterations: 4 }).start();
    }

    animateMovement = (arrayOutPut: any[], index: number) => {
        Animated.sequence([
            Animated.timing(this.state.animatedXYVal[index], {
                toValue: { x: arrayOutPut[0][0], y: arrayOutPut[0][1] },
                duration: 270,
                useNativeDriver: false
            }),
            Animated.timing(this.state.animatedXYVal[index], {
                toValue: { x: arrayOutPut[1][0], y: arrayOutPut[1][1] },
                duration: 270,
                useNativeDriver: false
            }),
            Animated.timing(this.state.animatedXYVal[index], {
                toValue: { x: arrayOutPut[2][0], y: arrayOutPut[2][1] },
                duration: 270,
                useNativeDriver: false
            }),
            Animated.timing(this.state.animatedXYVal[index], {
                toValue: { x: arrayOutPut[3][0], y: arrayOutPut[3][1] },
                duration: 270,
                useNativeDriver: false
            }),
            Animated.timing(this.state.animatedXYVal[index], {
                toValue: { x: arrayOutPut[4][0], y: arrayOutPut[4][1] },
                duration: 270,
                useNativeDriver: false
            }),
        ]).start()
    }


    componentDidMount() {
        setTimeout(() => {
            let currentImages = [...this.state.currentImages];
            currentImages = currentImages.map((item, index) => item = `${Config.serverUrl}/assets/misc/diceRollsD${this.props.diceType}/startingDice.png`)
            this.setState({ currentImages })
            this.animateRoll()
            for (let i = 0; i < this.props.diceAmount; i++) {
                let random = Math.floor((Math.random() * 10) + 1);
                this.animateMovement(eval(`animateOption${random}`), i)
            }
            this.calculateResult()
        }, 450);
        setTimeout(() => {
            this.setState({ showResults: true }, () => this.animatePop())
        }, 2000);
    }
    calculateResult = () => {
        const diceResult = { ...this.state.diceResult }
        const diceResultArray = [...this.state.diceResultArray]
        let result: number = 0
        for (let i = 0; i < this.props.diceAmount; i++) {
            let math = Math.floor((Math.random() * this.props.diceType) + 1);
            result = result + math;
            diceResultArray.push(math)
        }
        diceResult.mainDice = result;
        diceResult.result = result + this.props.rollValue;
        this.setState({ diceResult, diceResultArray }, () => {
            let currentImages = [...this.state.currentImages];
            let index: number = 0;
            currentImages = currentImages.map((item, index) => item = `${Config.serverUrl}/assets/misc/diceRollsD${this.props.diceType}/${this.state.diceResultArray[index]}.png`)
            this.setState({ currentImages })
        })
    }
    diceColor = () => {
        if (this.props.diceType === 20 && this.state.diceResultArray.includes(20)) return 'green';
        if (this.props.diceType === 20 && this.state.diceResultArray.includes(1)) return Colors.danger
        return Colors.totalWhite
    }
    render() {
        return (
            <TouchableOpacity style={styles.container} onPress={() => {
                if (this.state.showResults) {
                    this.props.close()
                }
            }}>
                <Animated.View style={{ justifyContent: "center", alignItems: "center" }}>
                    {this.state.currentImages.map((item, index) => {
                        if (index === 0 && this.state.currentImages.length === 1) {
                            return <Animated.View key={index} style={[this.state.animatedXYVal[index].getLayout(), {
                                width: 150,
                                height: 150,
                                transform: [
                                    {
                                        rotate: this.state.animatedVal.interpolate({
                                            inputRange: [0, 1, 1],
                                            outputRange: ['0deg', '360deg', '0deg']
                                        })
                                    }
                                ]
                            }]}>
                                <Image uri={this.state.currentImages[index]} style={{ height: 150, width: 150 }} />
                            </Animated.View>
                        }
                        if (index === 0 && this.state.currentImages.length > 1) {
                            return <View key={index} style={{ flexDirection: 'row' }}>
                                <Animated.View style={[this.state.animatedXYVal[index].getLayout(), {
                                    width: 150,
                                    height: 150,
                                    transform: [
                                        {
                                            rotate: this.state.animatedVal.interpolate({
                                                inputRange: [0, 1, 1],
                                                outputRange: ['0deg', '360deg', '0deg']
                                            })
                                        }
                                    ]
                                }]}>
                                    <Image uri={this.state.currentImages[index]} style={{ height: 150, width: 150 }} />
                                </Animated.View>
                                <Animated.View style={[this.state.animatedXYVal[index + 1].getLayout(), {
                                    width: 150,
                                    height: 150,
                                    transform: [
                                        {
                                            rotate: this.state.animatedVal.interpolate({
                                                inputRange: [0, 1, 1],
                                                outputRange: ['0deg', '360deg', '0deg']
                                            })
                                        }
                                    ]
                                }]}>
                                    <Image uri={this.state.currentImages[index + 1]} style={{ height: 150, width: 150 }} />
                                </Animated.View>
                            </View>
                        }
                        if (index > 1 && index % 2 !== 0) {
                            return <View key={index} style={{ flexDirection: 'row' }}>
                                <Animated.View style={[this.state.animatedXYVal[index - 1].getLayout(), {
                                    width: 150,
                                    height: 150,
                                    transform: [
                                        {
                                            rotate: this.state.animatedVal.interpolate({
                                                inputRange: [0, 1, 1],
                                                outputRange: ['0deg', '360deg', '0deg']
                                            })
                                        }
                                    ]
                                }]}>
                                    <Image uri={this.state.currentImages[index - 1]} style={{ height: 150, width: 150 }} />
                                </Animated.View>
                                <Animated.View style={[this.state.animatedXYVal[index].getLayout(), {
                                    width: 150,
                                    height: 150,
                                    transform: [
                                        {
                                            rotate: this.state.animatedVal.interpolate({
                                                inputRange: [0, 1, 1],
                                                outputRange: ['0deg', '360deg', '0deg']
                                            })
                                        }
                                    ]
                                }]}>
                                    <Image uri={this.state.currentImages[index]} style={{ height: 150, width: 150 }} />
                                </Animated.View>
                            </View>
                        }
                        if (index === this.state.currentImages.length - 1 && index % 2 === 0) {
                            return <Animated.View key={index} style={[this.state.animatedXYVal[index].getLayout(), {
                                width: 150,
                                height: 150,
                                transform: [
                                    {
                                        rotate: this.state.animatedVal.interpolate({
                                            inputRange: [0, 1, 1],
                                            outputRange: ['0deg', '360deg', '0deg']
                                        })
                                    }
                                ]
                            }]}>
                                <Image uri={this.state.currentImages[index]} style={{ height: 150, width: 150 }} />
                            </Animated.View>
                        }
                    })}
                </Animated.View>
                {this.state.showResults && <Animated.View style={{
                    position: "absolute", top: this.props.diceAmount > 2 ? Dimensions.get('window').height / 3 : Dimensions.get('window').height / 5,
                    alignSelf: "center", transform: [{
                        scale: this.state.animatedPopVal.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 1.5, 1]
                        })
                    }]
                }}>
                    <View style={{
                        backgroundColor: Colors.softWhiteInDarkMode, padding: 10, borderRadius: 15, flexDirection: "row",
                    }}>
                        <AppText fontSize={35}
                            color={this.diceColor()} >{this.state.diceResult.mainDice}</AppText>
                        <AppText fontSize={35} color={Colors.totalWhite}>({this.props.rollValue >= 0 ? '+' : '-'}{this.props.rollValue})</AppText>
                        <AppText fontSize={35} color={Colors.totalWhite}> | {this.state.diceResult.result <= 0 && '-'}{this.state.diceResult.result}</AppText>
                    </View>
                    <AppText color={Colors.totalWhite} fontSize={16} textAlign={'center'}>Press To Close</AppText>
                </Animated.View>}
                {this.props.diceType === 20 && this.state.diceResultArray.includes(20) &&
                    <View >
                        <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../assets/lottieAnimations/confeetiAnimation.json')} />
                    </View>}
            </TouchableOpacity>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});