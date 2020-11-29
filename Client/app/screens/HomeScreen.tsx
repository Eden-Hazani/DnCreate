import React, { Component, useState } from 'react';
import { View, TouchableOpacity, Animated, Button, StyleSheet, Text, Image, Easing, Platform, Dimensions, Modal, ScrollView } from 'react-native';
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
import errorHandler from '../../utility/errorHander';
import Carousel from 'react-native-snap-carousel';
import authApi from '../api/authApi';


interface HomeState {
    loading: boolean
    colorModal: boolean
    darkModeOn: boolean
    errorModal: boolean
    characters: CharacterModel[]
    carouselItems: any[]
    test: any
    activated: boolean
    emailSentTimer: number
}

export class HomeScreen extends Component<{ props: any, navigation: any }, HomeState>{
    navigationSubscription: any;
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            emailSentTimer: 0,
            activated: false,
            test: Colors.pageBackground,
            characters: [],
            errorModal: false,
            loading: true,
            colorModal: false,
            darkModeOn: store.getState().colorScheme,
            carouselItems: [
                {
                    title: "Welcome to DnCreate",
                    text: "Press New Character to create a new character",
                    image: { img: require('../../assets/homeDragon1.png') }
                },
                {
                    title: "Use the character hall to access all of your characters",
                    text: "Press on a character to use its character sheet.",
                    image: { img: require('../../assets/homeDragon2.png') }
                },
                {
                    title: "Use DnCreate's adventure mode to connect with friends",
                    text: "Show your DM all the information he needs to create the prefect adventure ",
                    image: { img: require('../../assets/welcomeDragon3.png') }
                },
            ]
        }
        this.UnsubscribeStore = store.subscribe(() => { })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }
    async componentDidMount() {
        try {
            if (store.getState().nonUser) {
                this.setState({ loading: true }, () => {
                    setTimeout(() => {
                        this.props.navigation.navigate("CharSkillPick", { nonUser: true });
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
            this.setState({ loading: false, characters: characters.data });
            this.context.user.activated ? this.setState({ activated: true }) : this.setState({ activated: false })
        } catch (err) {
            errorHandler(err)
        }
    }

    clearStorageJunk = async (characters: CharacterModel[]) => {
        await AsyncStorage.removeItem(`AttributeStage`);
        await AsyncStorage.removeItem(`DicePool`);
        for (let char of characters) {
            await AsyncStorage.removeItem(`${char.name}BackstoryStage`);
        }
    }

    onFocus = () => {
        this.setState({ characters: store.getState().characters })
        this.context.user.activated ? this.setState({ activated: true }) : this.setState({ activated: false })
        store.dispatch({ type: ActionType.CleanCreator })
    }

    _renderItem({ item, index }: any) {
        return (
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                padding: 10,
                width: Dimensions.get("screen").width
            }}>
                <View>
                    <Image style={{ width: 150, height: 150 }} source={item.image.img} />
                </View>
                <View style={{ padding: 0 }}>
                    <AppText fontSize={22} textAlign={'center'} color={Colors.berries}>{item.title}</AppText>
                    <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>{item.text}</AppText>
                </View>
            </View>

        )
    }


    resendEmail = async () => {
        try {
            this.setState({ emailSentTimer: 60 })
            const result = await authApi.resendActivationEmail(this.context.user);
            alert(result.data.message)
            const timer = setInterval(() => {
                this.setState({ emailSentTimer: this.state.emailSentTimer - 1 })
                if (this.state.emailSentTimer === 0) clearInterval(timer)
            }, 1000);
        } catch (err) {
            errorHandler(err)
        }
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                {this.state.loading ?
                    <AppActivityIndicator visible={this.state.loading} />
                    :
                    <View>
                        <AnimatedLogo></AnimatedLogo>
                        <View style={styles.container}>
                            <AnimateContactUpwards>
                                <View style={{ alignItems: "center", padding: 5, flex: .05 }}>
                                    <AppText color={Colors.whiteInDarkMode} fontSize={35}>DnCreate</AppText>
                                    <Carousel
                                        data={this.state.carouselItems}
                                        renderItem={this._renderItem}
                                        sliderWidth={Dimensions.get("screen").width}
                                        itemWidth={Dimensions.get("screen").width}
                                    />
                                </View>
                                <View style={styles.buttonsView}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => {
                                        console.log(this.context.user)
                                        if (!this.state.activated && this.state.characters.length >= 1) {
                                            this.setState({ errorModal: true })
                                            return
                                        }
                                        this.props.navigation.navigate("RaceList")
                                    }} fontSize={18} borderRadius={100} width={120} height={120} title={"New Character"} />
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("CharacterHall")} fontSize={18} borderRadius={100} width={120} height={120} title={"Character Hall"} />
                                </View>
                                <Modal visible={this.state.errorModal}>
                                    <View style={{ flex: .6, backgroundColor: Colors.pageBackground, justifyContent: "center", alignItems: "center" }}>
                                        <Image style={{ width: 200, height: 200 }} source={require("../../assets/errorDragon.png")} />
                                        <AppText color={Colors.berries} fontSize={27} textAlign={'center'}>Oops...</AppText>
                                        <AppText fontSize={18} textAlign={'center'}>If you wish to create more characters you need to confirm your email address
                                            {'\n'} via the email that was sent when you signed up.</AppText>
                                    </View>
                                    <View style={{ flex: .4, backgroundColor: Colors.pageBackground }}>
                                        {this.state.emailSentTimer > 0 ?
                                            <AppText fontSize={18} textAlign={'center'}>Email was sent, if it didn't reach you press to send again after the timer.</AppText>
                                            :
                                            <AppText fontSize={18} textAlign={'center'}>Need us to resend the activation email?
                                            {'\n'} No worries, just click</AppText>
                                        }
                                        <AppButton padding={10} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.resendEmail() }} disabled={this.state.emailSentTimer > 0}
                                            fontSize={18} borderRadius={100} width={100} height={100} title={this.state.emailSentTimer > 0 ? this.state.emailSentTimer.toString() : "Here"} />
                                    </View>
                                    <View style={{ flex: .3, backgroundColor: Colors.pageBackground }}>
                                        <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.setState({ errorModal: false })}
                                            fontSize={18} borderRadius={100} width={120} height={120} title={"Ok"} />
                                    </View>
                                </Modal>
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
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    buttonsView: {
        flex: .01,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    container: {
        alignItems: "center",
        paddingTop: 20
    },

})