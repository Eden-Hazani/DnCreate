import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import { store } from '../redux/store';

export class ConfirmFormPart extends Component<{ visible: boolean }>{

    render() {
        if (!this.props.visible) return null;
        if (!store.getState().colorScheme) {
            return <LottieView style={{
                zIndex: 1,
                width: 150,
                marginTop: "5%",
                alignSelf: 'center',
            }} resizeMode="cover" autoPlay loop={false} source={require('../../assets/lottieAnimations/ConfirmedAnimation.json')} />
        }
        if (store.getState().colorScheme) {
            return <LottieView style={{
                zIndex: 1,
                width: 150,
                marginTop: "5%",
                alignSelf: 'center',
            }} resizeMode="cover" autoPlay loop={false} source={require('../../assets/lottieAnimations/ConfirmedAnimationDarkMode.json')} />
        }
    }
}

