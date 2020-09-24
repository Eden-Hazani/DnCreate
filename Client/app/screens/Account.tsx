import React, { Component } from 'react';
import { View, StyleSheet, Image, Modal } from 'react-native';
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


const ValidationSchema = Yup.object().shape({
    profileImg: Yup.string().required().label("Profile Image"),

})

interface AccountState {
    userInfo: UserModel
    changeProfileModal: boolean
}

export class Account extends Component<{ props: any }, AccountState> {
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
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: .3 }}>
                    <Image style={styles.image} source={{ uri: `${Config.serverUrl}/uploads/profile-imgs/${this.state.userInfo.profileImg}` }} />
                </View>
                <View style={{ flex: .4 }}>
                    <AppText fontSize={20}>{this.state.userInfo.username}</AppText>
                </View>
                <View style={{ flex: .2 }}>
                    <AppButton title="Change Profile Picture" onPress={() => this.setState({ changeProfileModal: true })} fontSize={18} backgroundColor={colors.bitterSweetRed} width={150} />
                </View>
                <Modal visible={this.state.changeProfileModal}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <View style={{ flex: .3, paddingTop: 120 }}>
                            <AppForm
                                initialValues={{
                                    profileImg: null
                                }}
                                onSubmit={(values: any) => this.updateImg(values)}
                                validationSchema={ValidationSchema}>
                                <View>
                                    <FormImagePicker name="profileImg" />
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <SubmitButton title={"Update"} />
                                    <AppButton title="Cancel" onPress={() => this.setState({ changeProfileModal: false })}
                                        fontSize={18} backgroundColor={colors.bitterSweetRed} height={100} width={100} borderRadius={100} paddingBottom={20} />
                                </View>
                            </AppForm>
                        </View>
                    </View>

                </Modal>
                <View style={{ flex: .3 }}>
                    <AppButton onPress={() => { this.logout() }} width={100} height={100} borderRadius={100} fontSize={20} color={colors.black} backgroundColor={colors.yellow} title={"Logout"} />
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