import React, { Component, useContext } from 'react';
import { View } from 'react-native';
import { AnimateContactUpwards } from '../animations/AnimateContactUpwards';
import { AnimatedLogo } from '../animations/AnimatedLogo';
import { AppTextHeadline } from '../components/AppTextHeadline';
import * as Yup from 'yup';
import { AppFormField } from '../components/forms/AppFormField';
import { SubmitButton } from '../components/forms/SubmitButton';
import { AppForm } from '../components/forms/AppForm';
import authApi from '../api/authApi';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import { Unsubscribe } from 'redux';
import { store } from '../redux/store';
import errorHandler from '../../utility/errorHander';
import AuthContext from '../auth/context';
import { AppRegisterDone } from '../components/AppRegisterDone';


const ValidationSchema = Yup.object().shape({
    username: Yup.string().required().email().label("Username"),
    password: Yup.string().matches(/^.{5,16}$/, "Must be 5-16 Characters").required().label("Password"),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'passwords Must match').required(),
})

interface RegisterState {
    loading: boolean
    error: boolean
    confirmed: boolean
}

export class Register extends Component<{ props: any, navigation: any }, RegisterState>{
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            loading: false,
            error: false
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    register = async (values: any) => {
        this.setState({ loading: true })
        await authApi.register(values).then(result => {
            const userInfo: any = result.data;
            this.setState({ loading: false }, () => {
                alert(userInfo.message);
                setTimeout(() => {
                    this.props.navigation.navigate("Welcome")
                }, 1000);
            });
        }).catch(err => {
            this.setState({ loading: false })
            errorHandler(err.request)
        });

    }
    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    render() {
        return (
            <View>
                {this.state.confirmed ? <AppRegisterDone visible={this.state.confirmed} /> :
                    <View>
                        {!this.state.loading ? <View>
                            <AnimateContactUpwards>
                                <AnimatedLogo />
                                <AppTextHeadline>Register</AppTextHeadline>
                                <AppForm
                                    initialValues={{
                                        username: '', password: '', passwordConfirmation: ''
                                    }}
                                    onSubmit={(values: any) => this.register(values)}
                                    validationSchema={ValidationSchema}>
                                    <View >
                                        <AppFormField
                                            fieldName={"username"}
                                            name="username"
                                            iconName={"text-short"}
                                            placeholder={"username..."} />
                                        <AppFormField
                                            secureTextEntry
                                            fieldName={"password"}
                                            name="password"
                                            iconName={"lock-outline"}
                                            placeholder={"password..."} />
                                        <AppFormField
                                            secureTextEntry
                                            fieldName={"passwordConfirmation"}
                                            name="confirmPassword"
                                            iconName={"lock-outline"}
                                            placeholder={"repeat Password..."} />
                                    </View>
                                    <SubmitButton title={"Register"} />
                                </AppForm>
                            </AnimateContactUpwards>
                        </View>
                            : <AppActivityIndicator visible={this.state.loading} />
                        }
                    </View>}
            </View>
        )
    }
}
