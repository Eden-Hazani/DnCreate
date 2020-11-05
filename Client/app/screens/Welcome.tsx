import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AppTextHeadline } from '../components/AppTextHeadline';
import { AppText } from '../components/AppText';
import colors from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AppButton } from '../components/AppButton';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';

interface WelcomeState {
    newUserModal: boolean
}


export class Welcome extends Component<{ navigation: any }, WelcomeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            newUserModal: false
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
                            <AppTextHeadline>Welcome to DnCreate</AppTextHeadline>
                            <AppText fontSize={20} textAlign={"center"} color={colors.text} padding={20}>Creating fifth edition characters has never been easier, register to begin!</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={colors.berries} padding={10}>Start using DnCreate today and produce fully flushed out characters in minutes.</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={colors.berries} padding={10}>Level up and progress through your subclass choices and spellcasting abilities</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={colors.berries} padding={10}>Connect with your friends using DnCreate's adventure mode, allowing your DM access to important party information.</AppText>
                            <AppText fontSize={20} textAlign={"center"} color={colors.text} padding={20}>Already a user? Login Now</AppText>
                        </View>
                        <View style={styles.buttonsView}>
                            <AppButton fontSize={20} color={colors.totalWhite} backgroundColor={colors.bitterSweetRed} onPress={() => this.props.navigation.navigate("Login")} borderRadius={100} width={100} height={100} title={"Login"} />
                            <AppButton fontSize={20} color={colors.totalWhite} backgroundColor={colors.bitterSweetRed} onPress={() => { this.setState({ newUserModal: true }) }} borderRadius={100} width={100} height={100} title={"New User?"} />
                        </View>
                        <Modal visible={this.state.newUserModal} animationType={"slide"}>
                            <View style={{ marginTop: 25 }}>
                                <AppText textAlign={'center'} color={colors.berries} fontSize={30}>Hi There!</AppText>
                                <View style={{ marginTop: 50 }}>
                                    <AppText textAlign={'center'} fontSize={22}>Welcome to DnCreate</AppText>
                                    <AppText textAlign={'center'} fontSize={22} >The app that makes creating and maintaining your 5th edition characters fast and easy.</AppText>
                                    <AppText textAlign={'center'} fontSize={22}>Let's start by making your first character!</AppText>
                                </View>
                                <View>
                                    <AppText textAlign={'center'} color={colors.bitterSweetRed} fontSize={25}>Ready?</AppText>
                                </View>
                                <AppButton fontSize={20} color={colors.totalWhite} backgroundColor={colors.bitterSweetRed} onPress={() => this.nonUserStart()} borderRadius={100} width={100} height={100} title={"Press Here!"} />
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
        backgroundColor: colors.bitterSweetRed
    },
})