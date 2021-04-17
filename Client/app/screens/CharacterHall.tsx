import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { CharacterModel } from '../models/characterModel';
import userCharApi from '../api/userCharApi';
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
import CharacterHallList from '../components/characterHallComponents/CharacterHallList';
import { useSelector } from 'react-redux'
import { RootState } from '../redux/reducer'
import useAuthContext from '../hooks/useAuthContext';

interface Props {
    navigation: any
}

const interstitialAd = Platform.OS === 'ios' ? Config.adIosInterstitial : Config.adAndroidInterstitial;


export default function CharacterHall({ navigation }: Props) {

    const [showAds, setShowAds] = useState<boolean>(store.getState().user.premium ? false : store.getState().firstLoginAd);
    const [loadingAd, setLoadingAd] = useState<boolean>(false);
    const [isInternet, setIsInternet] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(true);

    const characters = useSelector((state: RootState) => {
        if (isMounted) return state.characters
    }) || [];

    const userContext = useAuthContext();

    const NetUnSub = NetInfo.addEventListener(netInfo => {
        if (netInfo.isInternetReachable && netInfo.isInternetReachable !== isInternet) {
            setIsInternet(netInfo.isInternetReachable)
        }
    })

    const navigationSubscription = navigation.addListener('focus', async () => {
        try {
            if (!showAds) {
                componentStartLoadWithoutAds()
            }
        } catch (err) {
            errorHandler(err)
        }
    });

    useEffect(() => {
        try {
            if (showAds) {
                setTimeout(() => {
                    setLoading(true)
                    requestAd().then(() => {
                        componentStartLoadWithAds();
                        store.dispatch({ type: ActionType.firstLoginAd });
                    })
                }, 250);
            } else {
                componentStartLoadWithoutAds();
            }
            return () => {
                setIsMounted(false)
                console.log(isMounted)
                navigationSubscription();
                NetUnSub()
            };
        } catch (err) {
            setLoading(false)
            setLoadingAd(false)
        }
    }, [])

    const requestAd = async () => {
        AdMobInterstitial.setAdUnitID(interstitialAd);
        await AdMobInterstitial.requestAdAsync().then(async () => {
            await AdMobInterstitial.showAdAsync().then(() => {
                setLoading(false)
                setLoadingAd(false)
            }).catch(() => {
                setLoading(false)
                setLoadingAd(false)
            })
        }).catch(() => {
            setLoading(false)
            setLoadingAd(false)
        })
    }

    const componentStartLoadWithoutAds = async () => {
        if (userContext.user?._id === "Offline") {
            loadOfflineChars().then(() => {
                setLoading(false)
            })
        }
        if (userContext.user?._id !== "Offline") {
            setTimeout(() => {
                setLoading(false)
            }, 500);
        }
    }

    const componentStartLoadWithAds = async () => {
        if (userContext.user?._id === "Offline") {
            loadOfflineChars()
        }
    }

    const loadOfflineChars = async () => {
        const characters = await AsyncStorage.getItem('offLineCharacterList');
        if (!characters) {
            return;
        }
        store.dispatch({ type: ActionType.SetCharacters, payload: JSON.parse(characters) });
    }

    const handleDelete = async (character: CharacterModel) => {
        if (userContext.user?._id === "Offline") {
            for (let item of characters) {
                if (item._id === character._id) {
                    const filteredCharacters = characters.filter(m => m._id !== item._id)
                    store.dispatch({ type: ActionType.SetCharacters, payload: filteredCharacters })
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
        for (let item of characters) {
            if (item._id === character._id) {
                const filteredCharacters = characters.filter(m => m._id !== item._id)
                store.dispatch({ type: ActionType.SetCharacters, payload: filteredCharacters })
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

    const characterWindow = (character: CharacterModel, index: number) => {
        store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
        navigation.navigate("SelectCharacter", { character: character, isDm: false, index: index })
    }

    return (
        <View>
            {!isInternet ? <AppNoInternet />
                :
                loading ?
                    <View>
                        <AppActivityIndicator visible={loading} />
                        {loadingAd &&
                            <View>
                                <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>Characters are loading</AppText>
                                <AppText textAlign={'center'} color={Colors.whiteInDarkMode} fontSize={18}>Thank you for using DnCreate 🖤</AppText>
                            </View>
                        }
                    </View>
                    :
                    <View>
                        {error ? <AppError /> :
                            <View>
                                {characters.length === 0 ?
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <AppText color={Colors.bitterSweetRed} fontSize={20}>No Characters</AppText>
                                    </View> :
                                    <CharacterHallList characters={characters}
                                        deleteChar={(val: CharacterModel) => { handleDelete(val) }}
                                        openCharacter={(val: CharacterModel, index: number) => { characterWindow(val, index) }} />
                                }
                            </View>}
                    </View>}
        </View>
    )
}