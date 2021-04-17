import React, { Component } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AppButton } from '../components/AppButton';
import { Colors } from '../config/colors';
import * as GoogleSignIn from 'expo-google-sign-in';
import authApi from '../api/authApi';
import reduxToken from './reduxToken';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import errorHandler from '../../utility/errorHander';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import AuthContext from './context';
import { AppText } from '../components/AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';

interface GoogleLoginState {
    loading: boolean
}

export class GoogleLogin extends Component<{ isTutorial: any, turnOffTutorialModel: any }, GoogleLoginState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false
        }
    }
    componentDidMount() {
        this.initAsync();
    }

    initAsync = async () => {
        await GoogleSignIn.initAsync();
    };


    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
    };

    login = async (values: any) => {
        this.setState({ loading: true })
        if (this.props.isTutorial) {
            this.props.turnOffTutorialModel(false);
            store.dispatch({ type: ActionType.SetInfoBeforeRegisterChar, payload: this.props.isTutorial })
        }
        const result = await this.context.login(false, values, false);
        this.setState({ loading: result })
    }

    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
    };

    signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                const values = {
                    username: user?.email.toLowerCase(),
                    password: user?.uid
                }
                this.findIfRegistered(values, user?.photoURL)
                this._syncUserWithStateAsync();
            }
        } catch ({ message }) {
            alert('login: Error:' + message);
        }
    };

    findIfRegistered = async (values: any, photoURL: any) => {
        if (this.props.isTutorial) {
            this.props.turnOffTutorialModel(false);
            alert('This user is already registered, try logging in')
            return
        }
        const result = await this.context.login(false, values, true);
        if (result === 'noUserExists') {
            this.registerWithGoogle(values, photoURL)
        }
    }

    registerWithGoogle = async (values: any, photoURL: any) => {
        const fullValues = {
            username: values.username,
            password: values.password,
            profileImg: photoURL,
        }
        await authApi.googleRegister(fullValues).then(answer => {
            Alert.alert("Welcome!", `${answer.data.message}`, [{
                text: 'Ok', onPress: () => {
                    this.setState({ loading: false })
                    this.login(values)
                }
            }])
        }).catch(({ message }) => {
            if (message.includes('403')) {
                alert('This email is already in use, You may have a non Google DnCreate account.');
                this.signOutAsync()
            }
        });
    }

    onPress = () => {
        this.setState({ loading: true }, () => {
            this.signInAsync();
        })
    };

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
                        <TouchableOpacity onPress={() => { this.signInAsync() }} style={{
                            backgroundColor: Colors.bitterSweetRed, flexDirection: "row", width: 250,
                            borderRadius: 25,
                            justifyContent: "flex-start", alignItems: "center"
                        }}>
                            <Image uri={`${Config.serverUrl}/assets/logos/google.png`} style={{ width: 50, height: 50 }} />
                            <AppText>Google Sign in</AppText>
                        </TouchableOpacity>
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