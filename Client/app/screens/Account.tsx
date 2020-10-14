import React, { Component } from 'react';
import { View, StyleSheet, Image, Modal, Linking, Alert } from 'react-native';
import { Unsubscribe } from 'redux';
import { Config } from '../../config';
import authApi from '../api/authApi';
import AuthContext from '../auth/context';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { AppForm } from '../components/forms/AppForm';
import { FormImagePicker } from '../components/forms/FormImagePicker';
import { SubmitButton } from '../components/forms/SubmitButton';
import colors from '../config/colors';
import { UserModel } from '../models/userModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import errorHandler from '../../utility/errorHander';

//Account with profileImages

const ValidationSchema = Yup.object().shape({
    profileImg: Yup.string().required().label("Profile Image"),

})

interface AccountState {
    userInfo: UserModel
    changeProfileModal: boolean
}

export class Account extends Component<{ props: any, navigation: any }, AccountState> {
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            changeProfileModal: false,
            userInfo: store.getState().user
        }
        this.UnsubscribeStore = store.subscribe(() => { })
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
                    authApi.deleteAccount(this.state.userInfo._id).then(() => {
                        this.logout()
                    })
                }
            },
            { text: 'No' }])
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: .4 }}>
                    <Image style={styles.image} source={{ uri: `${Config.serverUrl}/uploads/profile-imgs/${this.state.userInfo.profileImg}` }} />
                </View>
                <View style={{ flex: .1 }}>
                    <AppText fontSize={20}>{this.state.userInfo.username}</AppText>
                </View>
                <View style={{ flex: .2 }}>
                    <AppButton title="Change Profile Picture" onPress={() => this.setState({ changeProfileModal: true })} borderRadius={15} fontSize={18} backgroundColor={colors.bitterSweetRed} width={150} />
                </View>
                <Modal visible={this.state.changeProfileModal}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                        <SubmitButton title={"Update"} />
                                        <AppButton title="Cancel" onPress={() => this.setState({ changeProfileModal: false })}
                                            fontSize={18} backgroundColor={colors.bitterSweetRed} height={100} width={100} borderRadius={100} paddingBottom={20} />
                                    </View>
                                </View>
                            </AppForm>
                        </View>
                    </View>
                </Modal>
                <View style={{ flex: .4 }}>
                    <AppButton borderRadius={15} width={150} height={50} backgroundColor={colors.bitterSweetRed} title={"Privacy Policy"} textAlign={"center"} fontSize={15} onPress={() => { Linking.openURL('https://eden-hazani.github.io/DnCreatePrivacyPolicy/') }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", flex: .4 }}>
                    <View style={{ flex: .5 }}>
                        <AppButton onPress={() => { this.logout() }} width={100} height={100} borderRadius={100} fontSize={20} color={colors.black} backgroundColor={colors.yellow} title={"Logout"} />
                    </View>
                    <View style={{ flex: .5 }}>
                        <AppButton onPress={() => { this.deleteAccount() }} width={100} height={100} borderRadius={100} fontSize={20} color={colors.black} backgroundColor={colors.danger} title={"Delete Account"} />
                    </View>
                </View>
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