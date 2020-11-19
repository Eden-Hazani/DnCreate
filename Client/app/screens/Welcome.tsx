import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Vibration, Image, Dimensions } from 'react-native';
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
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import Carousel from 'react-native-snap-carousel';


interface WelcomeState {
    newUserModal: boolean
    colorModal: boolean
    darkModeOn: boolean
    loading: boolean
    carouselItems: any[]
}


export class Welcome extends Component<{ navigation: any }, WelcomeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            newUserModal: false,
            colorModal: false,
            darkModeOn: store.getState().colorScheme,
            carouselItems: [
                {
                    title: "Creating fifth edition characters has never been easier!",
                    text: "Log in or Register to begin creating your own!",
                    image: { img: require('../../assets/welcomeDragon.png') }
                },
                {
                    title: "Start using DnCreate today and produce fully flushed out characters in minutes.",
                    text: "Level up and progress through your subclass choices and spellcasting abilities",
                    image: { img: require('../../assets/welcomeDragon2.png') }
                },
                {
                    title: "Connect with your friends using DnCreate's adventure mode.",
                    text: "What are you waiting for? start using DnCreate for FREE",
                    image: { img: require('../../assets/welcomeDragon3.png') }
                },
            ]
        }
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
    }

    async componentDidMount() {
        this.clearStorageJunk()
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
                                                this.props.navigation.navigate("Register")
                                            }} borderRadius={25} width={150} height={70} title={"Register"} />
                                        </View>
                                        <View style={{ paddingTop: 50 }}>
                                            <AppButton fontSize={25} color={Colors.totalWhite} backgroundColor={Colors.berries} onPress={() => this.setState({ newUserModal: false })} borderRadius={25} width={250} height={70} title={"Wait! I'm already a user"} />
                                        </View>
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
                            </View>
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