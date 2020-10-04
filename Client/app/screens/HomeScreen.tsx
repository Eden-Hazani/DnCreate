import React, { Component, useState } from 'react';
import { View, TouchableOpacity, Animated, Button, StyleSheet, Text, Image, Easing, Platform } from 'react-native';
import colors from '../config/colors';
import * as Font from 'expo-font';
import { AppText } from '../components/AppText';
import { AppTextHeadline } from '../components/AppTextHeadline';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';
import { Unsubscribe } from 'redux';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';


interface HomeState {
}

export class HomeScreen extends Component<{ props: any, navigation: any }, HomeState>{
    navigationSubscription: any;
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.UnsubscribeStore = store.subscribe(() => { })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    onFocus = () => {
        store.dispatch({ type: ActionType.CleanCreator })
    }
    render() {
        return (
            <View>
                <AnimatedLogo></AnimatedLogo>
                <View style={styles.container}>
                    <AnimateContactUpwards>
                        <View style={{ alignItems: "center", flex: .5, padding: 20 }}>
                            <AppTextHeadline>DnCreate</AppTextHeadline>
                            <AppText textAlign={'center'} color={colors.text}>Creating fifth edition characters has never been easier</AppText>
                            <AppText color={colors.text}>Tap below to begin</AppText>
                        </View>
                        <View style={styles.buttonsView}>
                            <AppButton backgroundColor={colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("RaceList")} fontSize={18} borderRadius={100} width={120} height={120} title={"New Character"} />
                            <AppButton backgroundColor={colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("CharacterHall")} fontSize={18} borderRadius={100} width={120} height={120} title={"Character Hall"} />
                        </View>
                    </AnimateContactUpwards>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonsView: {
        flex: .3,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    container: {
        alignItems: "center",
        paddingTop: 20
    },

})