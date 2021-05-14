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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterModel } from '../models/characterModel';
import errorHandler from '../../utility/errorHander';
import Carousel from 'react-native-snap-carousel';
import authApi from '../api/authApi';
import { Image as CashedImage, CacheManager } from 'react-native-expo-image-cache';
import logger from '../../utility/logger';
import { FeedBack } from '../components/FeedBack';
import { UpdateMessage } from '../components/UpdateMessage';
import { Config } from '../../config';
import { IconGen } from '../components/IconGen';
import { serverDice } from '../../utility/getDiceFromServer';
import * as Linking from 'expo-linking';

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
    homeMessageModal: boolean
    updateNews: boolean
}

export class HomeScreen extends Component<{ props: any, navigation: any }, HomeState>{
    navigationSubscription: any;
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            updateNews: false,
            homeMessageModal: false,
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
                    title: "DnCreate is hard work",
                    text: "Any donation is highly appreciated and will go towards making DnCreate better each update",
                    patreonImage: `${Config.serverUrl}/assets/specificDragons/patreonDragon.png`
                },
                {
                    title: "Send Us Your Feedback!",
                    message: true,
                    image: `${Config.serverUrl}/assets/specificDragons/homeDragon1.png`
                },
                {
                    title: "Use DnCreate's adventure mode to connect with friends",
                    text: "Show your DM all the information he needs to create the prefect adventure ",
                    image: `${Config.serverUrl}/assets/specificDragons/welcomeDragon3.png`
                },
            ]
        }
        this.UnsubscribeStore = store.subscribe(() => { })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    checkForNews = async () => {
        const newsFlag = await AsyncStorage.getItem('newsFlag');
        if (!newsFlag || newsFlag !== '2.02') {
            this.setState({ updateNews: true })
        }
    }


    async componentDidMount() {
        try {
            serverDice()
            this.checkForNews();
            if (store.getState().nonUser && this.checkValidNonUserChar()) {
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
            this.loadCharacters()
        } catch (err) {
            this.setState({ loading: false })
            logger.log(new Error(err))
        }
    }

    checkValidNonUserChar = () => {
        const char: CharacterModel = store.getState().beforeRegisterChar;
        console.log(char)
        if (!char.background?.backgroundName) {
            store.dispatch({ type: ActionType.StartAsNonUser, payload: false })
            store.dispatch({ type: ActionType.ClearInfoBeforeRegisterChar })
            return false
        } else {
            return true
        }
    }

    loadCharacters = async () => {
        try {
            if (this.context.user._id === "Offline") {
                const characters = await AsyncStorage.getItem('offLineCharacterList');
                if (!characters) {
                    this.setState({ loading: false })
                    return;
                }
                store.dispatch({ type: ActionType.SetCharacters, payload: JSON.parse(characters) });
                this.setState({ loading: false })
            } else {
                const characters = await userCharApi.getChars(this.context.user._id);
                if (characters.data) {
                    this.clearStorageJunk(characters.data)
                    store.dispatch({ type: ActionType.SetCharacters, payload: characters.data })
                    this.setState({ loading: false, characters: characters.data });
                    this.context.user.activated ? this.setState({ activated: true }) : this.setState({ activated: false })
                }
            }
        } catch (err) {
            this.setState({ loading: false })
            logger.log(err)
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
        this.setState({ characters: store.getState().characters }, () => {
            this.clearStorageJunk(this.state.characters)
        })
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
                {item.patreonImage ?
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://www.patreon.com/Edenhazani?fan_landing=true')}>
                        <CashedImage uri={item.patreonImage} style={{ width: 150, height: 150 }} />
                    </TouchableOpacity>
                    :
                    <View>
                        <CashedImage uri={item.image} style={{ width: 150, height: 150 }} />
                    </View>
                }
                <View style={{ padding: 0 }}>
                    <AppText fontSize={22} textAlign={'center'} color={Colors.berries}>{item.title}</AppText>
                    <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>{item.text}</AppText>
                    {item.message &&
                        <AppButton fontSize={18} title={'Feedback'} onPress={() => { this.setState({ homeMessageModal: true }) }}
                            backgroundColor={Colors.berries} width={120} height={50} borderRadius={25} />
                    }
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
                                    <View style={{ flexDirection: 'row' }}>
                                        <IconGen name={'chevron-left'} size={50} iconColor={Colors.whiteInDarkMode} />
                                        <IconGen name={'chevron-right'} size={50} iconColor={Colors.whiteInDarkMode} />
                                    </View>
                                    <Carousel
                                        autoplay
                                        loop
                                        autoplayInterval={3000}
                                        data={this.state.carouselItems}
                                        renderItem={this._renderItem.bind(this)}
                                        sliderWidth={Dimensions.get("screen").width}
                                        itemWidth={Dimensions.get("screen").width}
                                    />
                                </View>
                                <View style={styles.buttonsView}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={async () => {
                                        const isActive = await authApi.isActivated();
                                        if (isActive.data === 'false' && this.state.characters.length >= 1) {
                                            this.setState({ errorModal: true })
                                            return;
                                        }
                                        this.props.navigation.navigate("RaceList")
                                    }} fontSize={15} borderRadius={100} width={120} height={120} title={"New Character"} />
                                    <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("CharacterHall")}
                                        fontSize={15} borderRadius={100} width={120} height={120} title={"Character Hall"} />
                                </View>
                                <Modal visible={this.state.homeMessageModal} animationType="slide">
                                    <FeedBack close={(val: boolean) => { this.setState({ homeMessageModal: val }) }} />
                                </Modal>
                                <Modal visible={this.state.updateNews} animationType="slide">
                                    <UpdateMessage close={(val: boolean) => {
                                        this.setState({ updateNews: val }, async () => {
                                            AsyncStorage.setItem('newsFlag', '2.02')
                                        })
                                    }} />
                                </Modal>
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
                                            <AppButton disabled={!this.state.darkModeOn} fontSize={10} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={async () => {
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
                                            <AppButton disabled={this.state.darkModeOn} fontSize={10} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={async () => {
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
    },

})