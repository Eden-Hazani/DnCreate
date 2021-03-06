import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Vibration, Image, Dimensions } from 'react-native';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import Carousel from 'react-native-snap-carousel';
import AuthContext from '../auth/context';
import Modal from 'react-native-modal';
import { Config } from '../../config';
import { UpdateMessage } from '../components/UpdateMessage';
import { ColorSchemeModal } from '../components/ColorSchemeModal';


Modal
interface WelcomeState {
    newUserModal: boolean
    colorModal: boolean
    darkModeOn: boolean
    loading: boolean
    carouselItems: any[]
    firstUseModal: boolean
}


export class Welcome extends Component<{ navigation: any }, WelcomeState> {
    static contextType = AuthContext;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            firstUseModal: false,
            loading: false,
            newUserModal: false,
            colorModal: false,
            darkModeOn: store.getState().colorScheme,
            carouselItems: [
                {
                    title: "Welcome to DnCreate!",
                    text: "Please scroll down and choose how you want to experience the app!",
                    image: `${Config.serverUrl}/assets/specificDragons/welcomeDragon.png`
                },
                {
                    title: "DnCreate allows you to produce fully flushed out characters in minutes.",
                    text: "Level up and progress through your subclass choices and spellcasting abilities",
                    image: `${Config.serverUrl}/assets/specificDragons/welcomeDragon2.png`
                },
                {
                    title: "Connect with your friends using DnCreate's adventure mode.",
                    text: "Sign up now and unlock DnCreate's full potential",
                    image: `${Config.serverUrl}/assets/specificDragons/welcomeDragon3.png`
                },
            ]
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
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
                    <AppText fontSize={22} textAlign={'center'}>{item.title}</AppText>
                    <AppText fontSize={18} textAlign={'center'}>{item.text}</AppText>
                </View>
            </View>

        )
    }

    clearStorageJunk = async () => {
        await AsyncStorage.removeItem(`AttributeStage`);
        await AsyncStorage.removeItem(`DicePool`);
        store.dispatch({ type: ActionType.CleanCreator })
    }

    onFocus = () => {
        store.dispatch({ type: ActionType.ChangeCreationProgressBar, payload: -1 })
        this.clearStorageJunk()
    }

    componentDidMount() {
        this.checkForNews()
        this.clearStorageJunk()
    }

    nonUserStart = () => {
        store.dispatch({ type: ActionType.StartAsNonUser, payload: true })
        this.setState({ newUserModal: false })
        this.props.navigation.navigate("RaceList")
    }

    checkForNews = async () => {
        const newsFlag = await AsyncStorage.getItem('newsFlag');
        const isFirstUse = await AsyncStorage.getItem('isFirstUse');
        if (!newsFlag || newsFlag !== '2.07' || !isFirstUse) {
            this.setState({ firstUseModal: true })
        }
    }



    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View>
                        <AnimatedLogo></AnimatedLogo>
                        <AnimateContactUpwards>
                            <View>
                                <View style={styles.textContainer}>
                                    <Carousel
                                        data={this.state.carouselItems}
                                        renderItem={this._renderItem}
                                        sliderWidth={Dimensions.get("screen").width}
                                        itemWidth={Dimensions.get("screen").width}
                                    />
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, margin: 10, padding: 10 }}>
                                    <AppText fontSize={18} textAlign={'center'}>If you wish to fully utilize DnCreate's abilities please create a new user or log into your existing one</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>It's completely FREE</AppText>
                                    <View style={styles.buttonsView}>
                                        <AppButton fontSize={20} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("Login")} borderRadius={100} width={100} height={100} title={"Login"} />
                                        <AppButton fontSize={20} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ newUserModal: true }) }} borderRadius={100} width={100} height={100} title={"New User?"} />
                                    </View>
                                </View>
                                <View style={{ justifyContent: "center", alignItems: "center", borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, margin: 10, padding: 10 }}>
                                    <AppText fontSize={18} textAlign={'center'}>If you only wish to create characters for yourself and not use DnCreate online features</AppText>
                                    <View style={styles.buttonsView}>
                                        <AppButton fontSize={20} color={Colors.totalWhite} backgroundColor={Colors.berries}
                                            onPress={() => this.context.offlineLogin()} borderRadius={100} width={100} height={100} title={"Use Offline"} />
                                    </View>
                                </View>

                                <Modal
                                    style={{
                                        backgroundColor: Colors.pageBackground,
                                        margin: 0,
                                        marginTop: 30,
                                        alignItems: undefined,
                                        justifyContent: undefined,
                                    }}
                                    isVisible={this.state.newUserModal}>
                                    <ScrollView style={{ flex: 1, paddingTop: 25, backgroundColor: Colors.pageBackground }} >
                                        <AppText textAlign={'center'} color={Colors.berries} fontSize={30}>Hi There!</AppText>
                                        <View style={{ paddingTop: 25 }}>
                                            <AppText textAlign={'center'} fontSize={22}>Welcome to DnCreate</AppText>
                                            <AppText textAlign={'center'} fontSize={22} >The app that makes creating and maintaining your 5th edition characters fast and easy.</AppText>
                                            <AppText textAlign={'center'} fontSize={22}>Let's start by making your first character!</AppText>
                                        </View>
                                        <View>
                                            <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={25}>Ready?</AppText>
                                        </View>
                                        <View style={{ paddingTop: 20 }}>
                                            <AppButton fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => this.nonUserStart()} borderRadius={25} width={150} height={70} title={"Press Here!"} />
                                        </View>
                                        <View style={{ padding: 10 }}>
                                            <AppText textAlign={'center'} fontSize={22}>Want to open your first character later?</AppText>
                                            <AppText textAlign={'center'} fontSize={22} >No worries, just register below and skip the first character part.</AppText>
                                        </View>
                                        <View style={{ paddingTop: 20 }}>
                                            <AppButton fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => {
                                                this.setState({ newUserModal: false })
                                                this.props.navigation.navigate("Register")
                                            }} borderRadius={25} width={150} height={70} title={"Register"} />
                                        </View>
                                        <View style={{ paddingTop: 50 }}>
                                            <AppButton fontSize={15} color={Colors.totalWhite} backgroundColor={Colors.berries} onPress={() => this.setState({ newUserModal: false })}
                                                borderRadius={25} width={250} height={70} title={"Wait! I'm already a user"} />
                                        </View>
                                    </ScrollView>
                                </Modal>
                                <Modal
                                    style={{
                                        backgroundColor: Colors.pageBackground,
                                        margin: 0,
                                        marginTop: 30,
                                        alignItems: undefined,
                                        justifyContent: undefined,
                                    }}
                                    isVisible={this.state.colorModal}>
                                    <ColorSchemeModal closeModal={() => this.setState({ colorModal: false })} />
                                </Modal>
                            </View>

                            <Modal
                                style={{
                                    backgroundColor: Colors.pageBackground,
                                    margin: 0,
                                    alignItems: undefined,
                                    justifyContent: undefined,
                                }}
                                isVisible={this.state.firstUseModal}>
                                <UpdateMessage close={(val: boolean) => {
                                    this.setState({ firstUseModal: val }, async () => {
                                        await AsyncStorage.setItem('newsFlag', '2.07');
                                        await AsyncStorage.setItem('isFirstUse', "false");
                                        const colorScheme = await AsyncStorage.getItem("colorScheme");
                                        if (colorScheme === "firstUse") {
                                            this.setState({ colorModal: true })
                                        }
                                    })
                                }} />

                            </Modal>
                        </AnimateContactUpwards>
                    </View>
                }
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    textContainer: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonsView: {
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 10,
        paddingBottom: 10

    }, button: {
        elevation: 10,
        justifyContent: "center",
        height: 112,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 200,
        backgroundColor: Colors.bitterSweetRed
    },
})