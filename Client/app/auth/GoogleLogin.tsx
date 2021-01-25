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

export class GoogleLogin extends Component<{}, GoogleLoginState>{
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
        // this._syncUserWithStateAsync();
    };


    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
    };

    login = async (values: any) => {
        const newValues = {
            username: values.username,
            password: values.password
        }
        this.setState({ loading: true })
        await authApi.login(newValues, false).then(result => {
            const userInfo: any = result.data.token;
            reduxToken.setToken(userInfo).then(validToken => {
                const { user, setUser } = this.context
                setUser(validToken);
                store.dispatch({ type: ActionType.SetUserInfoLoginRegister, payload: validToken })
                this.setState({ loading: false })
            })
        }).catch(err => {
            this.setState({ loading: false })
            errorHandler(err.request)
        })
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
        authApi.login(values, false).then(answer => {
            const userInfo: any = answer.data.token;
            reduxToken.setToken(userInfo).then(validToken => {
                const { user, setUser } = this.context
                setUser(validToken);
                store.dispatch({ type: ActionType.SetUserInfoLoginRegister, payload: validToken })
                this.setState({ loading: false })
            })
        }).catch(async () => {
            this.registerWithGoogle(values, photoURL)
        });
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
                    // <AppButton onPress={() => { this.signInAsync() }} width={100} height={100}
                    //     borderRadius={100} fontSize={18} marginBottom={1}
                    //     color={Colors.black} backgroundColor={Colors.bitterSweetRed} title={"test"} />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});