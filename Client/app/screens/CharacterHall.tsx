import React, { Component } from 'react';
import { View, FlatList, Platform, Alert } from 'react-native';
import { ListItem } from '../components/ListItem';
import { ListItemSeparator } from '../components/ListItemSeparator';
import ListItemDelete from '../components/ListItemDelete';
import { SelectCharacter } from './SelectCharacter';
import { CharacterModel } from '../models/characterModel';
import userCharApi from '../api/userCharApi';
import { UserModel } from '../models/userModel';
import AuthContext from '../auth/context';
import { AppText } from '../components/AppText';
import { Colors } from '../config/colors';
import { Config } from '../../config';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import errorHandler from '../../utility/errorHander';
import { AppError } from '../components/AppError';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';
import AsyncStorage from '@react-native-community/async-storage';
import { AdMobInterstitial } from 'expo-ads-admob'
import NetInfo from '@react-native-community/netinfo'
import { AppNoInternet } from '../components/AppNoInternet';
import * as FacebookAds from 'expo-ads-facebook';

interface CharacterHallState {
    characters: CharacterModel[]
    userInfo: UserModel
    loading: boolean
    error: boolean
    showAds: boolean
    isInternet: boolean
    loadingAd: boolean
}


export class CharacterHall extends Component<{ props: any, navigation: any }, CharacterHallState> {
    navigationSubscription: any;
    public interstitialAd: string;
    public interstitialFacebookAd: string;
    static contextType = AuthContext;
    private NetUnSub: any;
    constructor(props: any) {
        super(props)
        this.state = {
            isInternet: true,
            loadingAd: false,
            // showAds: store.getState().user.premium ? false : store.getState().firstLoginAd,
            showAds: false,
            error: false,
            loading: true,
            userInfo: this.context,
            characters: [],
        }
        setTimeout(() => {
            this.NetUnSub = NetInfo.addEventListener(netInfo => {
                if (netInfo.isInternetReachable) {
                    this.setState({ isInternet: netInfo.isInternetReachable })
                }
            })
        }, 500);
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
        this.interstitialAd = Platform.OS === 'ios' ? Config.adIosInterstitial : Config.adAndroidInterstitial
        this.interstitialFacebookAd = Config.facebookFullScreenAd
    }



    async componentDidMount() {
        try {
            if (this.state.showAds) {
                setTimeout(() => {
                    this.setState({ loadingAd: true }, () => {
                        this.requestAd().then(() => {
                            this.componentStartLoadWithAds()
                            store.dispatch({ type: ActionType.firstLoginAd });
                        })
                    })
                }, 250);
            } else {
                this.componentStartLoadWithoutAds();
            }
        } catch (err) {
            console.log(err)
        }
    }

    requestAd = async () => {
        // AdMobInterstitial.setAdUnitID(this.interstitialAd);
        // await AdMobInterstitial.requestAdAsync().then(async () => { await AdMobInterstitial.showAdAsync() })
        FacebookAds.InterstitialAdManager.showAd(this.interstitialFacebookAd).then(() => {
            setTimeout(() => {
                this.setState({ loadingAd: false, loading: false })
            }, 1300);
        })
    }

    componentStartLoadWithoutAds = async () => {
        if (this.context.user._id === "Offline") {
            this.loadOfflineChars().then(() => {
                this.setState({ loading: false })
            })
        }
        if (this.context.user._id !== "Offline") {
            const response = await userCharApi.getChars(this.context.user._id);
            if (response.data) {
                const characters = response.data;
                this.setState({ characters, error: errorHandler(response), loading: false });
            }
        }
    }

    componentStartLoadWithAds = async () => {
        if (this.context.user._id === "Offline") {
            this.loadOfflineChars()
        }
        if (this.context.user._id !== "Offline") {
            const response = await userCharApi.getChars(this.context.user._id);
            if (response.data) {
                const characters = response.data;
                this.setState({ characters, error: errorHandler(response) });
            }
        }
    }

    loadOfflineChars = async () => {
        const characters = await AsyncStorage.getItem('offLineCharacterList');
        if (!characters) {
            this.setState({ characters: [] });
            return
        }
        this.setState({ characters: JSON.parse(characters) });
    }

    onFocus = async () => {
        try {
            if (!this.state.showAds) {
                this.componentStartLoadWithoutAds()
            }
        } catch (err) {
            errorHandler(err)
        }
    }


    handleDelete = async (character: CharacterModel) => {
        if (this.context.user._id === "Offline") {
            for (let item of this.state.characters) {
                if (item._id === character._id) {
                    const characters = this.state.characters.filter(m => m._id !== item._id)
                    this.setState({ characters })
                }
            }
            const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
            if (stringifiedChars) {
                const characters = JSON.parse(stringifiedChars);
                const newCharacters = characters.filter((char: CharacterModel) => char._id !== character._id);
                await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(newCharacters))
                for (let level = 1; level < 20; level++) {
                    await AsyncStorage.removeItem(`current${character._id}level${level}`)
                }
                AsyncStorage.removeItem(`notes${character._id}`)
                return;
            }
            return;
        }
        for (let item of this.state.characters) {
            if (item._id === character._id) {
                const characters = this.state.characters.filter(m => m._id !== item._id)
                this.setState({ characters })
            }
        }
        for (let level = 1; level < 20; level++) {
            await AsyncStorage.removeItem(`current${character._id}level${level}`)
        }
        AsyncStorage.removeItem(`notes${character._id}`)
        if (character._id) {
            userCharApi.deleteChar(character._id)
        }

    }

    characterWindow = (character: CharacterModel) => {
        store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
        this.props.navigation.navigate("SelectCharacter", { character: character, isDm: false })
    }
    componentWillUnmount() {
        this.NetUnSub()
    }



    render() {
        return (
            <View>
                {!this.state.isInternet ? <AppNoInternet />
                    :
                    this.state.loading ?
                        <View>
                            <AppActivityIndicator visible={this.state.loading} />
                            {this.state.loadingAd &&
                                <View>
                                    <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>Characters are loading</AppText>
                                    <AppText textAlign={'center'} color={Colors.whiteInDarkMode} fontSize={18}>Thank you for using DnCreate 🖤</AppText>
                                </View>
                            }
                        </View>
                        :
                        <View>
                            {this.state.error ? <AppError /> :
                                <View>
                                    {this.state.characters.length === 0 ?
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            <AppText color={Colors.bitterSweetRed} fontSize={20}>No Characters</AppText>
                                        </View> :
                                        <FlatList
                                            data={this.state.characters as any}
                                            keyExtractor={characters => characters._id.toString()}
                                            renderItem={({ item }) => <ListItem
                                                title={item.name}
                                                subTitle={`${item.characterClass} ${item.race}`}
                                                imageUrl={`${Config.serverUrl}/assets/${item.image}`}
                                                direction={'row'}
                                                padding={20} width={60} height={60}
                                                headTextAlign={"left"}
                                                subTextAlign={"left"}
                                                justifyContent={"flex-start"} textDistanceFromImg={10}
                                                renderRightActions={() =>
                                                    <ListItemDelete onPress={() =>
                                                        Alert.alert("Delete", "Are you sure you want to delete this character? (this action is irreversible)", [{ text: 'Yes', onPress: () => this.handleDelete(item) }, { text: 'No' }])} />}
                                                onPress={() => this.characterWindow(item)} />}
                                            ItemSeparatorComponent={ListItemSeparator} />}
                                </View>}
                        </View>}
            </View>
        )
    }
}