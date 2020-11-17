import React, { Component, useState } from 'react';
import { View, TouchableOpacity, Animated, Button, StyleSheet, Text, Image, Easing, Platform, Dimensions, Modal } from 'react-native';
import { Colors } from '../config/colors';
import * as Font from 'expo-font';
import { AppText } from '../components/AppText';
import { AppTextHeadline } from '../components/AppTextHeadline';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';
import { Unsubscribe } from 'redux';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import userCharApi from '../api/userCharApi';
import AuthContext from '../auth/context';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import AsyncStorage from '@react-native-community/async-storage';
import { CharacterModel } from '../models/characterModel';


interface HomeState {
    loading: boolean
    colorModal: boolean
    darkModeOn: boolean
}

export class HomeScreen extends Component<{ props: any, navigation: any }, HomeState>{
    navigationSubscription: any;
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: true,
            colorModal: false,
            darkModeOn: store.getState().colorScheme
        }
        this.UnsubscribeStore = store.subscribe(() => { })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }
    async componentDidMount() {
        if (store.getState().nonUser) {
            this.setState({ loading: true }, () => {
                setTimeout(() => {
                    this.props.navigation.navigate("CharSkillPick");
                    this.setState({ loading: false })
                }, 1000);
            })
            return;
        }
        const colorScheme = await AsyncStorage.getItem("colorScheme");
        if (colorScheme === "firstUse") {
            this.setState({ colorModal: true })
        }
        const characters = await userCharApi.getChars(this.context.user._id);
        this.clearStorageJunk(characters.data)
        store.dispatch({ type: ActionType.SetCharacters, payload: characters.data })
        this.setState({ loading: false });
    }

    clearStorageJunk = async (characters: CharacterModel[]) => {
        for (let char of characters) {
            await AsyncStorage.removeItem(`${char.name}AttributeStage`);
            await AsyncStorage.removeItem(`${char.name}DicePool`);
            await AsyncStorage.removeItem(`${char.name}BackstoryStage`);
        }
    }

    onFocus = () => {
        store.dispatch({ type: ActionType.CleanCreator })
    }
    render() {
        return (
            <View style={{ backgroundColor: Colors.pageBackground }}>
                {this.state.loading ?
                    <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View>
                        <AnimatedLogo></AnimatedLogo>
                        <View style={styles.container}>
                            <AnimateContactUpwards>
                                <View style={{ alignItems: "center", flex: .5, padding: 20 }}>
                                    <AppText color={Colors.whiteInDarkMode} fontSize={35}>DnCreate</AppText>
                                    <AppText textAlign={'center'} color={Colors.whiteInDarkMode}>Creating fifth edition characters has never been easier</AppText>
                                    <AppText color={Colors.whiteInDarkMode}>Tap below to begin</AppText>
                                </View>
                                <View style={styles.buttonsView}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("RaceList")} fontSize={18} borderRadius={100} width={120} height={120} title={"New Character"} />
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("CharacterHall")} fontSize={18} borderRadius={100} width={120} height={120} title={"Character Hall"} />
                                </View>
                                <Modal visible={this.state.colorModal}>
                                    <View style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                                        <View style={{ flex: 0.1, paddingTop: 150 }}>
                                            <AppText textAlign={'center'} fontSize={22} color={Colors.whiteInDarkMode}>Pick your style.</AppText>
                                        </View>
                                        <View style={{ flex: 0.2 }}>
                                            <AppButton disabled={!this.state.darkModeOn} fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={async () => {
                                                this.setState({ darkModeOn: false, loading: true }, async () => {
                                                    await AsyncStorage.setItem('colorScheme', "light").then(() => {
                                                        Colors.InitializeAsync().then(() => {
                                                            store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                                            this.setState({ loading: false })
                                                        })
                                                    });
                                                })
                                            }}
                                                borderRadius={25} width={250} height={100} title={"Let there be LIGHT!"} />
                                        </View>
                                        <View style={{ flex: 0.2 }}>
                                            <AppButton disabled={this.state.darkModeOn} fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={async () => {
                                                this.setState({ darkModeOn: true, loading: true }, async () => {
                                                    await AsyncStorage.setItem('colorScheme', "dark").then(() => {
                                                        Colors.InitializeAsync().then(() => {
                                                            store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                                            this.setState({ loading: false })
                                                        })
                                                    });
                                                })
                                            }}
                                                borderRadius={25} width={250} height={100} title={"To the darkness we descend..."} />
                                        </View>
                                        <View style={{ flex: 0.2 }}>
                                            <AppButton backgroundColor={Colors.bitterSweetRed} onPress={async () => {
                                                const colorScheme = await AsyncStorage.getItem("colorScheme");
                                                if (colorScheme === "firstUse") {
                                                    this.setState({ darkModeOn: false, loading: true }, async () => {
                                                        await AsyncStorage.setItem('colorScheme', "light").then(() => {
                                                            Colors.InitializeAsync().then(() => {
                                                                store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                                                this.setState({ loading: false, colorModal: false })
                                                            })
                                                        });
                                                    })
                                                    return;
                                                }
                                                this.setState({ colorModal: false })
                                            }}
                                                fontSize={18} borderRadius={70} width={70} height={70} title={"O.K"} />
                                        </View>
                                    </View>
                                </Modal>
                            </AnimateContactUpwards>
                        </View>
                    </View>
                }
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