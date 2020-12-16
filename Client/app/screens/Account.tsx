import React, { Component } from 'react';
import { View, StyleSheet, Image, Modal, Linking, Alert, Switch, Dimensions } from 'react-native';
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

//Account with profileImages

const ValidationSchema = Yup.object().shape({
    profileImg: Yup.string().required().label("Profile Image").typeError("Must Choose A picture, Press on the camera Icon"),
})

interface AccountState {
    isUserOffline: boolean
    userInfo: UserModel
    changeProfileModal: boolean
    darkModeOn: boolean
    loading: boolean
}

export class Account extends Component<{ props: any, navigation: any }, AccountState> {
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            isUserOffline: false,
            loading: false,
            darkModeOn: store.getState().colorScheme,
            changeProfileModal: false,
            userInfo: store.getState().user
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentDidMount() {
        if (store.getState().user._id === "Offline") {
            this.setState({ isUserOffline: true })
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

    render() {
        return (
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
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
                        <View style={{ alignItems: "center" }}>
                            <View style={{ flex: .4 }}>
                                <Image style={styles.image} source={{ uri: `${Config.serverUrl}/uploads/profile-imgs/${this.state.userInfo.profileImg}` }} />
                            </View>
                            <View style={{ flex: .1 }}>
                                <AppText fontSize={20}>{this.state.userInfo.username}</AppText>
                            </View>
                            <View style={{ flex: .2 }}>
                                <AppButton title="Change Profile Picture" onPress={() => this.setState({ changeProfileModal: true })} borderRadius={15} fontSize={18} backgroundColor={Colors.bitterSweetRed} width={150} />
                            </View>
                            <Modal visible={this.state.changeProfileModal}>
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
                            <View style={{ flex: .2 }}>
                                <AppButton borderRadius={15} width={150} height={50} backgroundColor={Colors.bitterSweetRed} title={"Privacy Policy"} textAlign={"center"} fontSize={15} onPress={() => { Linking.openURL('https://eden-hazani.github.io/DnCreatePrivacyPolicy/') }} />
                            </View>
                            <View style={{ flex: .3 }}>
                                <AppText textAlign={'center'}>Custom path maker beta will release in the next update!</AppText>
                                <AppButton disabled={true} borderRadius={15} width={150} height={50} backgroundColor={Colors.bitterSweetRed} title={"Create Custom Path"}
                                    textAlign={"center"} fontSize={15} onPress={() => { this.props.navigation.navigate("CreateNewPath") }} />
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <AppText>Dark mode</AppText>
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
                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", flex: .4 }}>
                                <View style={{ flex: .5 }}>
                                    <AppButton onPress={() => { this.logout() }} width={100} height={100} borderRadius={100} fontSize={20} color={Colors.black} backgroundColor={Colors.yellow} title={"Logout"} />
                                </View>
                                <View style={{ flex: .5 }}>
                                    <AppButton onPress={() => { this.deleteAccount() }} width={100} height={100} borderRadius={100} fontSize={20} color={Colors.black} backgroundColor={Colors.danger} title={"Delete Account"} />
                                </View>
                            </View>
                        </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        borderRadius: 150,
        width: 150,
        height: 150,
    }
});