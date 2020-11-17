import React, { Component } from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../config/colors'
import { Dimensions } from 'react-native';

interface AnimatedLogoState {
    jiggleAnimationVal: Animated.ValueXY;

}

export class AnimatedLogo extends Component<any, AnimatedLogoState>{
    constructor(props: any) {
        super(props)
        this.state = {
            jiggleAnimationVal: new Animated.ValueXY({ x: 0, y: 0 }),
        }
    }

    componentDidMount() {
        this.jiggle();
    }
    jiggle = () => {
        Animated.sequence([
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: -12 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: 0 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: -10 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: -0 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: -7 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(this.state.jiggleAnimationVal, {
                toValue: { x: 0, y: 0 },
                duration: 100,
                useNativeDriver: false
            }),
        ]).start()
    }
    render() {
        return (
            <TouchableOpacity style={styles.logoContainer} onPress={this.jiggle}>
                <View style={[styles.innerContainer, { backgroundColor: Colors.bitterSweetRed }]}>
                    <Animated.View style={this.state.jiggleAnimationVal.getLayout()}>
                        <Image style={styles.icon} source={require('../../assets/logo.png')} />
                    </Animated.View>
                </View>
            </TouchableOpacity>
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
        paddingTop: 5,
        borderWidth: 5,
        borderColor: "black",
        width: 120,
        alignItems: "center",
        borderRadius: 100
    }
})