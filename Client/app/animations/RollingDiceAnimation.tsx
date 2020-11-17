import React, { Component } from 'react';
import { Animated, View, Image, StyleSheet, Easing } from 'react-native';


interface AnimatedLogoState {
    jiggleAnimationVal: Animated.Value;

}


export class RollingDiceAnimation extends Component<{ props: any }, AnimatedLogoState>{
    constructor(props: any) {
        super(props)
        this.state = {
            jiggleAnimationVal: new Animated.Value(0)
        }
    }

    componentDidMount() {
        this.jiggle();
    }

    jiggle = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state.jiggleAnimationVal, { toValue: 5.0, duration: 150, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(this.state.jiggleAnimationVal, { toValue: -5.0, duration: 300, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(this.state.jiggleAnimationVal, { toValue: 0.0, duration: 150, easing: Easing.linear, useNativeDriver: true })
            ])
        ).start();
    }
    render() {
        return (
            <Animated.View style={{
                transform: [{
                    rotate: this.state.jiggleAnimationVal.interpolate({
                        inputRange: [-1, 1],
                        outputRange: ['-0.1rad', '0.1rad']
                    })
                }]
            }}>
                <View>
                    <Image style={styles.icon} source={require('../../assets/logo.png')} />
                </View>
            </Animated.View>
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

})