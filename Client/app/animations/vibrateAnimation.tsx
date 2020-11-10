import React, { Component } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../config/colors'
import { Dimensions } from 'react-native';
import { AppText } from '../components/AppText';

interface VibrateAnimationState {
    jiggleAnimationVal: Animated.ValueXY;

}

export class VibrateAnimation extends Component<{ onPress: any, text: any, isOn: boolean, colorCode: string }, VibrateAnimationState>{
    constructor(props: any) {
        super(props)
        this.state = {
            jiggleAnimationVal: new Animated.ValueXY({ x: 0, y: 0 }),
        }
    }



    stopJiggle = () => {
        this.state.jiggleAnimationVal.stopAnimation()
    }

    // componentDidUpdate() {
    //     this.props.isOn ? this.jiggle() : this.stopJiggle()
    // }

    jiggle = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: -5 },
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: -5 },
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: -5 },
                    duration: 100,
                    useNativeDriver: false
                }),
                Animated.timing(this.state.jiggleAnimationVal, {
                    toValue: { x: 0, y: 0 },
                    duration: 100,
                    useNativeDriver: false
                }),
            ])).start()
    }
    render() {
        return (
            <>
                {this.props.isOn ? this.jiggle() : this.stopJiggle()}
                <Animated.View style={this.state.jiggleAnimationVal.getLayout()}>
                    <TouchableOpacity style={[styles.attribute, { backgroundColor: this.props.colorCode }]} onPress={this.props.onPress}>
                        <AppText textAlign={"center"} >{this.props.text}</AppText>
                    </TouchableOpacity>
                </Animated.View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    icon: {
        height: 90,
        marginTop: 5,
        marginBottom: 10,
        resizeMode: "contain"
    },
    logoContainer: {
        marginTop: 20,
        alignItems: "center",
        marginBottom: 20,
    },
    innerContainer: {
        backgroundColor: colors.bitterSweetRed,
        paddingTop: 5,
        borderWidth: 5,
        borderColor: "black",
        width: 120,
        alignItems: "center",
        borderRadius: 100
    }, attribute: {
        marginTop: 5,
        width: 50,
        height: 50,
        borderRadius: 15,
        borderColor: colors.black,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
    },
})