import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppForm } from '../components/forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../components/forms/AppFormField';
import { SubmitButton } from '../components/forms/SubmitButton';
import { UserModel } from '../models/userModel';
import { Unsubscribe } from 'redux';
import { store } from '../redux/store';
import authApi from '../api/authApi';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { AppRegisterDone } from '../components/AppRegisterDone';
import errorHandler from '../../utility/errorHander';
import { AppText } from '../components/AppText';


const ValidationSchema = Yup.object().shape({
    password: Yup.string().matches(/^.{5,16}$/, "Must be 5-16 Characters").required().label("Password"),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'passwords Must match').required(),
})

interface ResetPasswordState {
    loading: boolean;
    userInfo: UserModel;
    completed: boolean
}


export class ResetPassword extends Component<{ props: any, navigation: any }, ResetPasswordState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            completed: false,
            loading: false,
            userInfo: new UserModel()
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }
    resetPassword = async (values: any) => {
        this.setState({ loading: true })
        await authApi.resetPass(values).then(newUserDetails => {
            this.setState({ loading: false, completed: true })
            setTimeout(() => {
                alert('Password Has Been Changed')
                this.props.navigation.navigate("Welcome")
            }, 800);
            setTimeout(() => {
                this.setState({ completed: false })
            }, 1000);

        }).catch(err => {
            this.setState({ loading: false })
            errorHandler(err.request)
        });
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.completed ? <AppRegisterDone visible={this.state.completed} /> :
                    this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                        <View>
                            <View style={{ paddingTop: 60 }}>
                                <AppText fontSize={18} textAlign={'center'}>Please enter the validation code provided in the email that was sent to you in the field below</AppText>
                            </View>
                            <AppForm
                                initialValues={{ password: '', validationCode: '' }}
                                onSubmit={(values: any) => this.resetPassword(values)}
                                validationSchema={ValidationSchema}>
                                <View style={{ marginBottom: 40 }}>
                                    <AppFormField
                                        style={{ width: Dimensions.get('screen').width / 1.2 }}
                                        fieldName={"validationCode"}
                                        name="validationCode"
                                        iconName={"lock-outline"}
                                        placeholder={"Validation Code..."} />
                                    <AppFormField
                                        style={{ width: Dimensions.get('screen').width / 1.2 }}
                                        secureTextEntry
                                        fieldName={"password"}
                                        name="password"
                                        iconName={"lock-outline"}
                                        placeholder={"password..."} />
                                    <AppFormField
                                        style={{ width: Dimensions.get('screen').width / 1.2 }}
                                        secureTextEntry
                                        fieldName={"passwordConfirmation"}
                                        name="confirmPassword"
                                        iconName={"lock-outline"}
                                        placeholder={"repeat Password..."} />
                                </View>
                                <SubmitButton title={"Reset"} />
                            </AppForm>
                        </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});