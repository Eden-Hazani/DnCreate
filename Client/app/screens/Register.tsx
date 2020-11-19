import React, { Component, useContext } from 'react';
import { Dimensions, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
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
import { Colors } from '../config/colors';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import reduxToken from '../auth/reduxToken';
import { ActionType } from '../redux/action-type';


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

export class Register extends Component<{ navigation: any, route: any, isTutorial: any, turnOffTutorialModel: any }, RegisterState>{
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
        const loginValues = {
            username: values.username.toLowerCase().trim(),
            password: values.password
        }
        await authApi.register(validValues).then(result => {
            const userInfo: any = result.data;
            this.setState({ loading: false }, () => {
                alert(userInfo.message)
                this.login(loginValues)

            });
        }).catch(err => {
            this.setState({ loading: false })
            errorHandler(err.request)
        });
    }
    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    login = async (values: any) => {
        const newValues = {
            username: values.username.toLowerCase(),
            password: values.password
        }
        this.setState({ loading: true })
        await authApi.login(newValues).then(result => {
            const userInfo: any = result.data.token;
            reduxToken.setToken(userInfo).then(validToken => {
                const { user, setUser } = this.context
                setUser(validToken);
                if (this.props.isTutorial) {
                    this.props.turnOffTutorialModel(false);
                    store.dispatch({ type: ActionType.SetInfoBeforeRegisterChar, payload: this.props.isTutorial })
                }
                store.dispatch({ type: ActionType.SetUserInfoLoginRegister, payload: validToken })
                this.setState({ loading: false })
            })
        }).catch(err => {
            this.setState({ loading: false })
            errorHandler(err.request)
        })

    }

    render() {
        return (
            <ScrollView>
                {this.state.confirmed ? <AppRegisterDone visible={this.state.confirmed} /> :
                    <View style={{ paddingTop: 25 }}>
                        {!this.state.loading ? <View>
                            <AnimateContactUpwards>
                                <AnimatedLogo />
                                <AppText fontSize={27} textAlign={'center'}>Register</AppText>
                                <AppForm
                                    initialValues={{
                                        username: '', password: '', passwordConfirmation: ''
                                    }}
                                    onSubmit={(values: any) => this.register(values)}
                                    validationSchema={ValidationSchema}>

                                    <View >
                                        <View >
                                            <AppFormField
                                                width={Dimensions.get('screen').width / 1.2}
                                                fieldName={"username"}
                                                name="username"
                                                iconName={"text-short"}
                                                placeholder={"Username (Email address)..."} />
                                        </View>
                                        <TouchableOpacity style={{ alignItems: "center", position: 'absolute', right: -15 }} onPress={() => { this.setState({ questionModal: true }) }}>
                                            <IconGen size={70} name={"account-question-outline"} iconColor={Colors.whiteInDarkMode} />
                                        </TouchableOpacity>
                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.2}
                                            secureTextEntry
                                            fieldName={"password"}
                                            name="password"
                                            iconName={"lock-outline"}
                                            placeholder={"password..."} />

                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.2}
                                            secureTextEntry
                                            fieldName={"passwordConfirmation"}
                                            name="confirmPassword"
                                            iconName={"lock-outline"}
                                            placeholder={"repeat Password..."} />

                                    </View>
                                    <SubmitButton title={"Register"} />
                                </AppForm>
                                <Modal visible={this.state.questionModal} animationType={'slide'}>
                                    <View style={{ flex: 1, paddingTop: 100, padding: 15, backgroundColor: Colors.pageBackground }}>
                                        <AppText textAlign={'center'} color={Colors.berries} fontSize={25}>Why my Email address?</AppText>
                                        <View style={{ paddingTop: 20 }}>
                                            <AppText textAlign={'center'} fontSize={18}>DnCreate uses your email only for its adventure system or in case you forgot your password.</AppText>
                                            <AppText textAlign={'center'} fontSize={18}>No other use will be done with your email address{`\n`} (especially annoying spam...)</AppText>
                                        </View>
                                    </View>
                                    <View style={{ backgroundColor: Colors.pageBackground }}>
                                        <AppButton fontSize={18} backgroundColor={Colors.berries} borderRadius={25} width={150} height={70}
                                            title={'Close'} onPress={() => { this.setState({ questionModal: false }) }} />
                                    </View>
                                </Modal>
                            </AnimateContactUpwards>
                        </View>
                            : <AppActivityIndicator visible={this.state.loading} />
                        }
                    </View>}
            </ScrollView>
        )
    }
}
