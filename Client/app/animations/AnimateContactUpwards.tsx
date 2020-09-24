import React, { Component } from 'react';
import { Animated, View } from 'react-native';


interface AnimateContactUpwardsState {
    positionElementsAnimation: Animated.ValueXY;

}


export class AnimateContactUpwards extends Component<any, AnimateContactUpwardsState>{
    constructor(props: any) {
        super(props)
        this.state = {
            positionElementsAnimation: new Animated.ValueXY({ x: 0, y: 500 })
        }
    }
    componentDidMount() {
        this.loadElementAnimation();
    }

    loadElementAnimation = () => {
        Animated.timing(this.state.positionElementsAnimation, {
            toValue: { x: 0, y: 0 },
            duration: 550,
            useNativeDriver: false
        }).start()
    }
    render() {
        return (
            <Animated.View style={this.state.positionElementsAnimation.getLayout()}>{this.props.children}</Animated.View>
        )
    }
}