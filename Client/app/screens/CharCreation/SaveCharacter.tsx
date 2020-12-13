import React, { Component } from 'react';
import { View, StyleSheet, Linking, Alert } from 'react-native';
import { AppText } from '../../components/AppText';
import LottieView from 'lottie-react-native';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { ActionType } from '../../redux/action-type';
import AuthContext from '../../auth/context';
import AsyncStorage from '@react-native-community/async-storage';
import * as StoreReview from 'expo-store-review';

interface SaveCharacterState {
    characterInfo: CharacterModel
}


export class SaveCharacter extends Component<{ navigation: any }, SaveCharacterState>{
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }


    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    async componentDidMount() {
        this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo);
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        const characters = JSON.parse(stringifiedChars);
        for (let index in characters) {
            if (characters[index]._id === this.state.characterInfo._id) {
                characters[index] = this.state.characterInfo;
                break;
            }
        }
        await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
    }

    home = async () => {
        store.dispatch({ type: ActionType.CleanCreator });
        this.props.navigation.navigate("HomeScreen")
        setTimeout(async () => {
            if (await StoreReview.hasAction()) {
                const didRate = await AsyncStorage.getItem('didUserRate');
                if (didRate === null) {
                    Alert.alert("Like what you see?", "Please take a minute to rate DnCreate, it really helps :)", [{
                        text: 'Rate!', onPress: async () => {
                            await AsyncStorage.setItem('didUserRate', JSON.stringify(true));
                            StoreReview.requestReview()
                        }
                    }, { text: 'Later' }])
                }
                await AsyncStorage.setItem('didUserRate', JSON.stringify(true));
            }
        }, 1000);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    <AppText fontSize={35} color={Colors.bitterSweetRed}>Congratulations!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >Your Character has been saved!</AppText>
                    <AppText textAlign={'center'} fontSize={20} >You can access it through the Character Hall</AppText>
                    <View style={{ paddingTop: 30 }}>
                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.home() }} />
                    </View>
                </View>
                <View style={styles.lottie}>
                    <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: .5,
        justifyContent: "center",
        alignItems: "center"
    },
    lottie: {
        flex: .7
    }
});