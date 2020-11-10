import React, { Component, useContext } from 'react';
import { Dimensions, Modal, TouchableOpacity, View } from 'react-native';
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
import { IconGen } from '../components/IconGen';
import colors from '../config/colors';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';


const ValidationSchema = Yup.object().shape({
    username: Yup.string().required().email().label("Username"),
    password: Yup.string().matches(/^.{5,16}$/, "Must be 5-16 Characters").required().label("Password"),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'passwords Must match').required(),
})

interface RegisterState {
    loading: boolean
    error: boolean
    confirmed: boolean
    questionModal: boolean
    passOk: boolean
    confirmPassOk: boolean
}

export class Register extends Component<{ emailSent: any }, RegisterState>{
    static contextType = AuthContext;
    private UnsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            passOk: false,
            confirmPassOk: false,
            confirmed: false,
            loading: false,
            error: false,
            questionModal: false
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    register = async (values: any) => {
        this.setState({ loading: true })
        const validValues = {
            username: values.username.toLowerCase().trim(),
            password: values.password,
            passwordConfirmation: values.passwordConfirmation
        }
        await authApi.register(validValues).then(result => {
            const userInfo: any = result.data;
            this.setState({ loading: false }, () => {
                alert(userInfo.message);
                this.props.emailSent(true, values.username, values.password);
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
                                        <View >
                                            <AppFormField
                                                width={Dimensions.get('screen').width / 1.4}
                                                fieldName={"username"}
                                                name="username"
                                                iconName={"text-short"}
                                                placeholder={"Username (Email address)..."} />
                                        </View>
                                        <TouchableOpacity style={{ alignItems: "center", position: 'absolute', right: -15 }} onPress={() => { this.setState({ questionModal: true }) }}>
                                            <IconGen size={70} name={"account-question-outline"} />
                                        </TouchableOpacity>
                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.4}
                                            secureTextEntry
                                            fieldName={"password"}
                                            name="password"
                                            iconName={"lock-outline"}
                                            placeholder={"password..."} />

                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.4}
                                            secureTextEntry
                                            fieldName={"passwordConfirmation"}
                                            name="confirmPassword"
                                            iconName={"lock-outline"}
                                            placeholder={"repeat Password..."} />

                                    </View>
                                    <SubmitButton title={"Register"} />
                                </AppForm>
                                <Modal visible={this.state.questionModal} animationType={'slide'}>
                                    <View style={{ marginTop: 100, padding: 15 }}>
                                        <AppText textAlign={'center'} color={colors.berries} fontSize={25}>Why my Email address?</AppText>
                                        <View style={{ marginTop: 20 }}>
                                            <AppText textAlign={'center'} fontSize={18}>DnCreate uses your email only for its adventure system or in case you forgot your password.</AppText>
                                            <AppText textAlign={'center'} fontSize={18}>No other use will be done with your email address{`\n`} (especially annoying spam...)</AppText>
                                        </View>
                                    </View>
                                    <View>
                                        <AppButton fontSize={18} backgroundColor={colors.berries} borderRadius={25} width={150} height={70}
                                            title={'Close'} onPress={() => { this.setState({ questionModal: false }) }} />
                                    </View>
                                </Modal>
                            </AnimateContactUpwards>
                        </View>
                            : <AppActivityIndicator visible={this.state.loading} />
                        }
                    </View>}
            </View>
        )
    }
}
