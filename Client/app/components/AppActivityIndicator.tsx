import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

export class AppActivityIndicator extends Component<{ visible: boolean }>{

    render() {
        if (!this.props.visible) return null;
        return <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay loop source={require('../../assets/lottieAnimations/loadingAnimation.json')} />
    }
}


