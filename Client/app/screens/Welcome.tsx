import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Vibration } from 'react-native';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AppTextHeadline } from '../components/AppTextHeadline';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import AsyncStorage from '@react-native-community/async-storage';

interface WelcomeState {
    newUserModal: boolean
    colorModal: boolean
    darkModeOn: boolean
}


export class Welcome extends Component<{ navigation: any }, WelcomeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            newUserModal: false,
            colorModal: false,
            darkModeOn: store.getState().colorScheme
        }
    }
    async componentDidMount() {
        const colorScheme = await AsyncStorage.getItem("colorScheme");
        if (colorScheme === "firstUse") {
            this.setState({ colorModal: true })
        }
    }

    nonUserStart = () => {
        store.dispatch({ type: ActionType.StartAsNonUser, payload: true })
        this.setState({ newUserModal: false })
        this.props.navigation.navigate("RaceList")
    }

    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <AnimatedLogo></AnimatedLogo>
                <AnimateContactUpwards>
                    <View>
                        <View style={styles.textContainer}>
                            <AppText fontSize={27} textAlign={"center"}>Welcome to DnCreate</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={Colors.text} padding={20}>Creating fifth edition characters has never been easier, register to begin!</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={Colors.berries} padding={10}>Start using DnCreate today and produce fully flushed out characters in minutes.</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={Colors.berries} padding={10}>Level up and progress through your subclass choices and spellcasting abilities</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={Colors.berries} padding={10}>Connect with your friends using DnCreate's adventure mode, allowing your DM access to important party information.</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={Colors.text} padding={20}>Already a user? Login Now</AppText>
                        </View>
                        <View style={styles.buttonsView}>
                            <AppButton fontSize={20} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("Login")} borderRadius={100} width={100} height={100} title={"Login"} />
                            <AppButton fontSize={20} color={Colors.totalWhite} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ newUserModal: true }) }} borderRadius={100} width={100} height={100} title={"New User?"} />
                        </View>
                        <Modal visible={this.state.newUserModal} animationType={"slide"}>
                            <View style={{ flex: 1, paddingTop: 25, backgroundColor: Colors.pageBackground }} >
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
                                        this.props.navigation.navigate("Register", { jumpToHome: true })
                                    }} borderRadius={25} width={150} height={70} title={"Register"} />
                                </View>
                                <View style={{ paddingTop: 50 }}>
                                    <AppButton fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.berries} onPress={() => this.setState({ newUserModal: false })} borderRadius={25} width={250} height={70} title={"Wait! I'm already a user"} />
                                </View>
                            </View>
                        </Modal>
                        <Modal visible={this.state.colorModal}>
                            <View style={{ backgroundColor: Colors.pageBackground }}>
                                <AppText textAlign={'center'} fontSize={22} >Pick your style.</AppText>
                                <AppButton disabled={!this.state.darkModeOn} fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.berries} onPress={() => {
                                    this.setState({ darkModeOn: false }, async () => {
                                        await AsyncStorage.setItem('colorScheme', "light").then(() => {
                                            Colors.InitializeAsync().then(() => {
                                                store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                            })
                                        });
                                    })
                                }}
                                    borderRadius={25} width={250} height={70} title={"Let there be LIGHT!"} />
                                <AppButton disabled={this.state.darkModeOn} fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.berries} onPress={() => {
                                    this.setState({ darkModeOn: true }, async () => {
                                        await AsyncStorage.setItem('colorScheme', "dark").then(() => {
                                            Colors.InitializeAsync().then(() => {
                                                store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                            })
                                        });
                                    })
                                }}
                                    borderRadius={25} width={250} height={70} title={"To the darkness we descend..."} />
                            </View>
                        </Modal>
                    </View>
                </AnimateContactUpwards>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    textContainer: {
        marginTop: 5,
        padding: 20
    },
    buttonsView: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: 20

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