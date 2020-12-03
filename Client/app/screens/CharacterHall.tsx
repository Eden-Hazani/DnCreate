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
    public bannerAd: string;
    static contextType = AuthContext;
    private NetUnSub: any;
    constructor(props: any) {
        super(props)
        this.state = {
            isInternet: true,
            loadingAd: false,
            showAds: store.getState().firstLoginAd,
            error: false,
            loading: false,
            userInfo: this.context,
            characters: [],
        }
        this.NetUnSub = NetInfo.addEventListener(netInfo => { this.setState({ isInternet: netInfo.isInternetReachable }) })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
        this.interstitialAd = Platform.OS === 'ios' ? Config.adIosInterstitial : Config.adAndroidInterstitial
    }



    async componentDidMount() {
        try {
            if (this.state.showAds) {
                this.setState({ loading: true, loadingAd: true })
                AdMobInterstitial.setAdUnitID(this.interstitialAd);
                AdMobInterstitial.requestAdAsync().then(() => {
                    AdMobInterstitial.showAdAsync().then(async () => {
                        this.setState({ loading: false, loadingAd: false })
                        const response = await userCharApi.getChars(this.context.user._id);
                        const characters = response.data;
                        this.setState({ characters, error: errorHandler(response) });
                        store.dispatch({ type: ActionType.firstLoginAd });
                    }).catch((err) => console.log(err))
                }).catch((err) => console.log(err))
            } else {
                this.setState({ loading: true })
                const response = await userCharApi.getChars(this.context.user._id);
                this.setState({ loading: false })
                const characters = response.data;
                this.setState({ characters, error: errorHandler(response) });
            }
        } catch (err) {
            console.log(err)
        }
    }

    onFocus = async () => {
        if (!this.state.showAds) {
            this.setState({ loading: true })
            const response = await userCharApi.getChars(this.context.user._id);
            this.setState({ loading: false })
            const characters = response.data;
            this.setState({ characters, error: errorHandler(response) });
        }
    }


    handleDelete = async (character: CharacterModel) => {
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
        userCharApi.deleteChar(character._id)

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
                                    <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>Your one time session ad is loading</AppText>
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
                                            data={this.state.characters}
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