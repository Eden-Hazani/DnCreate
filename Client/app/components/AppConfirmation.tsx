import React, { Component } from 'react';
import LottieView from 'lottie-react-native';

export class AppConfirmation extends Component<{ visible: boolean }>{

    render() {
        if (!this.props.visible) return null;
        return <LottieView style={{
            zIndex: 1,
            width: 250,
            marginTop: "5%",
            alignSelf: 'center',
        }} resizeMode="cover" autoPlay loop={false} source={require('../../assets/lottieAnimations/ConfirmedAnimation.json')} />
    }
}

