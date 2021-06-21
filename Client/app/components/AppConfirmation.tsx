import React, { Component } from 'react';
import LottieView from 'lottie-react-native';
import { store } from '../redux/store';

export class AppConfirmation extends Component<{ visible: boolean, width?: string | number }>{

    render() {
        if (!this.props.visible) return null;
        if (!store.getState().colorScheme) {
            return <LottieView style={{
                zIndex: 1,
                width: this.props.width ? this.props.width : 250,
                marginTop: "5%",
                alignSelf: 'center',
            }} resizeMode="cover" autoPlay loop={false} source={require('../../assets/lottieAnimations/ConfirmedAnimation.json')} />
        }
        if (store.getState().colorScheme) {
            return <LottieView style={{
                zIndex: 1,
                width: this.props.width ? this.props.width : 250,
                marginTop: "5%",
                alignSelf: 'center',
            }} resizeMode="cover" autoPlay loop={false} source={require('../../assets/lottieAnimations/ConfirmedAnimationDarkMode.json')} />
        }
    }
}

