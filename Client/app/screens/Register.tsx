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
import { GoogleLogin } from '../auth/GoogleLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharacterModel } from '../models/characterModel';


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

export class Register extends Component<{ fireOnCancel: any, showCancelButt: any, navigation: any, route: any, isTutorial: any, turnOffTutorialModel: any }, RegisterState>{
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

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    register = async (values: any) => {
        this.setState({ loading: true })
        const result = await this.context.register(values);
        this.setState({ loading: result })
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
                                    <View style={{
                                        flexDirection: "row", alignItems: 'center',
                                        justifyContent: this.props.showCancelButt ? "space-evenly" : "center"
                                    }}>
                                        {this.props.showCancelButt &&
                                            <AppButton marginBottom={35} fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                                                height={100} title={"Cancel"} onPress={async () => {
                                                    await AsyncStorage.removeItem(`DicePool`)
                                                    await AsyncStorage.removeItem(`AttributeStage`)
                                                    store.dispatch({ type: ActionType.StartAsNonUser, payload: false })
                                                    store.dispatch({ type: ActionType.ClearInfoBeforeRegisterChar, payload: new CharacterModel() })
                                                    this.props.fireOnCancel()
                                                }} />
                                        }
                                        <SubmitButton title={"Register"} />
                                    </View>
                                </AppForm>
                                {!__DEV__ &&
                                    <View style={{ paddingBottom: 20 }}>
                                        <AppText fontSize={20} textAlign={'center'}>You can use google sign in and skip the email confirmation process</AppText>
                                        <GoogleLogin isTutorial={this.props.isTutorial} turnOffTutorialModel={(val: boolean) => this.props.turnOffTutorialModel(val)} />
                                    </View>
                                }
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
