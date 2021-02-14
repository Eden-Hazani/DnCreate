import React, { Component } from 'react';
import { View, StyleSheet, Image, Linking, Alert, Switch, Dimensions, ScrollView } from 'react-native';
import { Unsubscribe } from 'redux';
import { Config } from '../../config';
import authApi from '../api/authApi';
import AuthContext from '../auth/context';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { AppForm } from '../components/forms/AppForm';
import { FormImagePicker } from '../components/forms/FormImagePicker';
import { SubmitButton } from '../components/forms/SubmitButton';
import { Colors } from '../config/colors';
import { UserModel } from '../models/userModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import errorHandler from '../../utility/errorHander';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image as CashImage } from 'react-native-expo-image-cache';
import Modal from 'react-native-modal';
import { IconGen } from '../components/IconGen';
import { ListItemSeparator } from '../components/ListItemSeparator';
import * as Updates from 'expo-updates';
import logger from '../../utility/logger';
import { CheckForUpdates } from '../components/CheckForUpdates';


const ValidationSchema = Yup.object().shape({
    profileImg: Yup.string().required().label("Profile Image").typeError("Must Choose A picture, Press on the camera Icon"),
})

interface AccountState {
    homebrewSubClasses: boolean
    isUserOffline: boolean
    userInfo: UserModel
    changeProfileModal: boolean
    darkModeOn: boolean
    loading: boolean
    settingsModal: boolean
    lookingForUpdates: boolean
    homebrewRaces: boolean
    currentImgUri: string
}

export class Account extends Component<{ props: any, navigation: any }, AccountState> {
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            homebrewSubClasses: false,
            homebrewRaces: false,
            isUserOffline: false,
            loading: false,
            darkModeOn: store.getState().colorScheme,
            changeProfileModal: false,
            userInfo: store.getState().user,
            settingsModal: false,
            lookingForUpdates: false,
            currentImgUri: `${Config.serverUrl}/uploads/profile-imgs/${store.getState().user.profileImg}` || ''
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentDidMount() {
        this.setHomeBrew()
        if (store.getState().user._id === "Offline") {
            this.setState({ isUserOffline: true })
        }
    }

    setHomeBrew = async () => {
        const homebrewSubClasses = await AsyncStorage.getItem('showPublicSubClasses')
        const showPublicRaces = await AsyncStorage.getItem('showPublicRaces')
        if (showPublicRaces === 'true') {
            this.setState({ homebrewRaces: true })
        }
        if (homebrewSubClasses === 'true') {
            this.setState({ homebrewSubClasses: true })
        }
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    logout = () => {
        AsyncStorage.multiRemove(['classList', 'raceList']);
        store.dispatch({ type: ActionType.Logout })
        const { user, setUser } = this.context
        setUser(null);
    }

    exitOffline = () => {
        AsyncStorage.multiRemove(['classList', 'raceList']);
        AsyncStorage.removeItem('isOffline');
        store.dispatch({ type: ActionType.Logout })
        const { user, setUser } = this.context
        setUser(null);
    }

    updateImg = async (values: any) => {
        const user = await authApi.updateProfilePic(values, this.state.userInfo);
        this.setState({ userInfo: user.data.user }, () => {
            store.dispatch({ type: ActionType.SetUserInfo, payload: this.state.userInfo })
            this.setState({ changeProfileModal: false })
        })
    }

    deleteAccount = () => {
        Alert.alert("Delete Account", "Are you sure you want to delete your account (this action is irreversible)?",
            [{
                text: 'Yes', onPress: () => {
                    if (this.state.userInfo._id) {
                        authApi.deleteAccount(this.state.userInfo._id).then(() => {
                            this.logout()
                        })
                    }
                }
            },
            { text: 'No' }])
    }

    checkForUpdates = async () => {
        try {
            this.setState({ lookingForUpdates: true })
            const updates = await Updates.checkForUpdateAsync();
            if (updates.isAvailable) {
                Alert.alert("New Update", "DnCreate has a new update, would you like to download it?",
                    [{
                        text: 'Yes', onPress: async () => {
                            Updates.fetchUpdateAsync().then(() => {
                                Updates.reloadAsync();
                                return;
                            }).catch(() => {
                                this.setState({ lookingForUpdates: false })
                            })
                        }
                    }, {
                        text: 'No', onPress: () => {
                            this.setState({ lookingForUpdates: false })
                        }
                    }])
            } else if (!updates.isAvailable) {
                alert("No New updates found");
                this.setState({ lookingForUpdates: false })
            }
        } catch (err) {
            logger.log(new Error('Error in updates'))
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    this.state.isUserOffline ?
                        <View style={{ justifyContent: "center", alignItems: "center", padding: 15, marginBottom: Dimensions.get('screen').height / 5 }}>
                            <AppText textAlign={'center'} fontSize={25} color={Colors.berries}>You are Offline</AppText>
                            <AppText textAlign={'center'} fontSize={16}>If you wish to assess DnCreate's full features exit offline mode and log into your existing account</AppText>
                            <AppText textAlign={'center'} fontSize={18}>Don't have an account?</AppText>
                            <AppText textAlign={'center'} fontSize={18}>No worries! just sign up after you leave offline mode, it's FREE!</AppText>
                            <View style={{ marginTop: 15 }}>
                                <AppButton onPress={() => { this.exitOffline() }} width={100} height={100} borderRadius={100} fontSize={20} color={Colors.black} backgroundColor={Colors.yellow} title={"Exit Offline"} />
                            </View>
                        </View>
                        :
                        <View style={{ alignItems: "center", flex: 1 }}>
                            <View style={{ flex: .4 }}>
                                <Image onError={(e) => { this.setState({ currentImgUri: this.state.userInfo.profileImg || 'empty' }) }}
                                    style={styles.image} source={{ uri: this.state.currentImgUri }} />
                            </View>
                            <View style={{ flex: .1 }}>
                                <AppText fontSize={20}>{this.state.userInfo.username}</AppText>
                            </View>
                            <View style={{ flex: .2, padding: 10 }}>
                                <AppButton title="Change Profile Picture" onPress={() => this.setState({ changeProfileModal: true })} borderRadius={15} fontSize={18} backgroundColor={Colors.bitterSweetRed} width={150} />
                            </View>
                            <Modal isVisible={this.state.changeProfileModal} style={{
                                backgroundColor: Colors.pageBackground,
                                margin: 0,
                                marginTop: 30,
                                alignItems: undefined,
                                justifyContent: undefined,
                            }}>
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.pageBackground }}>
                                    <View style={{ flex: .8, paddingTop: 120 }}>
                                        <AppForm
                                            initialValues={{
                                                profileImg: null
                                            }}
                                            onSubmit={(values: any) => this.updateImg(values)}
                                            validationSchema={ValidationSchema}>
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flex: .5 }}>
                                                    <FormImagePicker name="profileImg" />
                                                </View>
                                                <View>
                                                    <SubmitButton title={"Update"} />
                                                    <AppButton title="Cancel" onPress={() => this.setState({ changeProfileModal: false })}
                                                        fontSize={18} backgroundColor={Colors.bitterSweetRed} height={100} width={100} borderRadius={100} paddingBottom={20} />
                                                </View>
                                            </View>
                                        </AppForm>
                                    </View>
                                </View>
                            </Modal>

                            <View style={{ flex: .3, padding: 10, justifyContent: "center", alignItems: "center" }}>
                                <AppText textAlign={'center'}>Wish to remove ads?</AppText>
                                <AppText textAlign={'center'}>Consider supporting DnCreate on Patreon</AppText>
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => { Linking.openURL('https://www.patreon.com/Edenhazani?fan_landing=true') }}>
                                    <CashImage uri={`${Config.serverUrl}/assets/logos/patreon.png`} style={{ height: 100, width: 100 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: .3 }}>
                                <AppText textAlign={'center'}>Custom path maker beta will release in the next update!</AppText>
                                <AppButton disabled={true} borderRadius={15} width={150} height={50} backgroundColor={Colors.bitterSweetRed} title={"Create Custom Path"}
                                    textAlign={"center"} fontSize={15} onPress={() => { this.props.navigation.navigate("CreateNewPath") }} />
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", flex: .4, paddingTop: 30, paddingBottom: 30 }}>
                                <View style={{ flex: .5 }}>
                                    <AppButton onPress={() => { this.logout() }} width={100} height={100} borderRadius={100} fontSize={20} color={Colors.black} backgroundColor={Colors.yellow} title={"Logout"} />
                                </View>
                                <TouchableOpacity style={{ flex: .5 }} onPress={() => { this.setState({ settingsModal: true }) }}>
                                    <IconGen name="cog" size={100} backgroundColor={Colors.bitterSweetRed} />
                                </TouchableOpacity>
                            </View>


                            <Modal isVisible={this.state.settingsModal}
                                animationIn="slideInLeft"
                                swipeDirection={["left", "right"]}
                                swipeThreshold={20}
                                onSwipeComplete={(e) => { this.setState({ settingsModal: false }) }}
                                style={{
                                    backgroundColor: Colors.pageBackground,
                                    margin: 0,
                                    marginRight: 50,
                                    alignItems: undefined,
                                    justifyContent: undefined,
                                }}>
                                <View style={{ backgroundColor: Colors.pageBackground, flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
                                        <AppText fontSize={20}>Dark mode</AppText>
                                        <Switch value={this.state.darkModeOn} onValueChange={() => {
                                            if (this.state.darkModeOn) {
                                                this.setState({ darkModeOn: false, loading: true }, async () => {
                                                    await AsyncStorage.setItem('colorScheme', "light").then(() => {
                                                        Colors.InitializeAsync().then(() => {
                                                            store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                                            this.setState({ loading: false })
                                                        })
                                                    });
                                                })
                                                return;
                                            }
                                            this.setState({ darkModeOn: true, loading: true }, async () => {
                                                await AsyncStorage.setItem('colorScheme', "dark").then(() => {
                                                    Colors.InitializeAsync().then(() => {
                                                        store.dispatch({ type: ActionType.colorScheme, payload: this.state.darkModeOn })
                                                        this.setState({ loading: false })
                                                    })
                                                });
                                            })
                                        }} />
                                    </View>
                                    <ListItemSeparator thick={true} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                                        <AppText fontSize={20}>Privacy Policy</AppText>
                                        <AppButton borderRadius={15} width={100} height={50} backgroundColor={Colors.bitterSweetRed}
                                            title={"Policy"} textAlign={"center"} fontSize={20} onPress={() => { Linking.openURL('https://eden-hazani.github.io/DnCreatePrivacyPolicy/') }} />
                                    </View>
                                    <ListItemSeparator thick={true} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                                        <AppText fontSize={20}>Delete Account</AppText>
                                        <AppButton onPress={() => { this.deleteAccount() }} width={100} height={50} borderRadius={15}
                                            fontSize={20} color={Colors.black} backgroundColor={Colors.danger} title={"Delete"} />
                                    </View>
                                    <ListItemSeparator thick={true} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 5 }}>
                                        <AppText fontSize={20}>Look For Updates</AppText>
                                        <AppButton onPress={() => {
                                            this.checkForUpdates()
                                        }} width={100} height={50} borderRadius={15}
                                            fontSize={20} color={Colors.black} backgroundColor={Colors.pastelPink} title={"Check"} />
                                    </View>
                                    <ListItemSeparator thick={true} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 5, width: Dimensions.get('window').width - 100 }}>
                                        <AppText fontSize={20}>Allow Public Homebrew races</AppText>
                                        <Switch value={this.state.homebrewRaces} onValueChange={() => {
                                            if (this.state.homebrewRaces) {
                                                this.setState({ homebrewRaces: false }, async () => {
                                                    await AsyncStorage.setItem('showPublicRaces', "false")
                                                })
                                                return;
                                            }
                                            this.setState({ homebrewRaces: true }, async () => {
                                                await AsyncStorage.setItem('showPublicRaces', "true");
                                            })
                                        }} />
                                    </View>
                                    <ListItemSeparator thick={true} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", paddingTop: 5, width: Dimensions.get('window').width - 100 }}>
                                        <AppText fontSize={20}>Allow Public Homebrew SubClasses</AppText>
                                        <Switch value={this.state.homebrewSubClasses} onValueChange={() => {
                                            if (this.state.homebrewSubClasses) {
                                                this.setState({ homebrewSubClasses: false }, async () => {
                                                    await AsyncStorage.setItem('showPublicSubClasses', "false")
                                                })
                                                return;
                                            }
                                            this.setState({ homebrewSubClasses: true }, async () => {
                                                await AsyncStorage.setItem('showPublicSubClasses', "true");
                                            })
                                        }} />
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                style={{
                                    backgroundColor: Colors.pageBackground,
                                    margin: 0,
                                    alignItems: undefined,
                                    justifyContent: undefined,
                                }}
                                isVisible={this.state.lookingForUpdates}>
                                <CheckForUpdates />
                            </Modal>
                        </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        borderRadius: 150,
        width: 150,
        height: 150,
    }
});