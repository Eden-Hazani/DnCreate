import React, { Component } from 'react';
import { Dimensions, FlatList, View, Animated, Image, TouchableOpacity, Modal } from 'react-native';
import { ListItem } from '../../components/ListItem';
import { SearchBar } from 'react-native-elements';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import { ActionType } from '../../redux/action-type';
import { CharacterModel } from '../../models/characterModel';
import racesApi from '../../api/racesApi'
import { Config } from '../../../config';
import errorHandler from '../../../utility/errorHander';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { ModifiersModel } from '../../models/modifiersModel';
import { RaceModel } from '../../models/raceModel';
import { UserModel } from '../../models/userModel';
import { AppConfirmation } from '../../components/AppConfirmation';
import { Colors } from '../../config/colors';
import AsyncStorage from '@react-native-community/async-storage';
import { AppText } from '../../components/AppText';
import { AnimatedHorizontalList } from '../../components/AnimatedHorizontalList';
import NetInfo from '@react-native-community/netinfo'
import { AppNoInternet } from '../../components/AppNoInternet';
import { AppButton } from '../../components/AppButton';
import AuthContext from '../../auth/context';
import logger from '../../../utility/logger';


const { width, height } = Dimensions.get('screen');


interface RaceListState {
    userInfo: UserModel
    characterInfo: CharacterModel
    search: string
    races: any
    refreshing: boolean
    error: boolean
    loading: boolean
    confirmed: boolean
    raceColors: string[]
    searchColor: string
    isInternet: boolean
    isUserOffline: boolean
    disclaimerModal: boolean
    currentLoadedRaces: number
}


export class RaceList extends Component<{ props: any, navigation: any }, RaceListState> {
    static contextType = AuthContext;
    private unsubscribeStore: Unsubscribe;
    private NetUnSub: any;
    constructor(props: any) {
        super(props)
        this.state = {
            disclaimerModal: false,
            isUserOffline: false,
            isInternet: true,
            searchColor: Colors.pageBackground,
            raceColors: [],
            confirmed: false,
            search: '',
            loading: true,
            races: [],
            userInfo: store.getState().user,
            characterInfo: store.getState().character,
            refreshing: false,
            error: false,
            currentLoadedRaces: 0
        }
        setTimeout(() => {
            this.NetUnSub = NetInfo.addEventListener(netInfo => {
                if (netInfo.isInternetReachable) {
                    this.setState({ isInternet: netInfo.isInternetReachable })
                }
            })
        }, 500);
        this.unsubscribeStore = store.subscribe(() => {
            store.getState().character
            this.setState({ searchColor: Colors.pageBackground })
        })
    }
    async componentDidMount() {
        const disclaimer = await AsyncStorage.getItem('shownDisclaimer');
        if (!disclaimer) {
            this.setState({ disclaimerModal: true })
        }
        const isOffline = await AsyncStorage.getItem('isOffline');
        if (isOffline) {
            this.setState({ isUserOffline: JSON.parse(isOffline) })
        }
        this.getRacesFromServer();
    }
    componentWillUnmount() {
        this.NetUnSub();
        this.unsubscribeStore()
    }
    getRaces = async () => {
        try {
            const cachedRaces = await AsyncStorage.getItem('raceList');
            this.setState({ loading: true })
            if (cachedRaces) {
                const races = JSON.parse(cachedRaces);
                this.setState({ races }, () => {
                    this.setState({ loading: false })
                })
                return;
            }
            this.setState({ loading: true })
            const raceType = await AsyncStorage.getItem('showPublicRaces');
            const result = await racesApi.getRaceList(0, 35, this.context.user._id, raceType);
            await AsyncStorage.setItem('raceList', JSON.stringify(result.data));
            this.setState({ loading: false })
            const races = result.data;
            this.setState({ races, error: errorHandler(result) })
        } catch (err) {
            console.log(err.message)
        }
    }

    getRacesFromServer = async () => {
        try {
            let raceColors = [];
            const races: any = this.state.races;
            let raceType = await AsyncStorage.getItem('showPublicRaces');
            if (raceType === null) {
                raceType = 'false'
            }
            const result: any = await racesApi.getRaceList(this.state.currentLoadedRaces, 10, this.context.user._id, raceType);
            console.log(result.data)
            if (!result.ok) {
                this.setState({ error: true, loading: false })
                return
            }
            this.setState({ currentLoadedRaces: this.state.currentLoadedRaces + 10 })
            for (let item of result.data) {
                console.log(item.name)
            }
            const newRaces = races.concat(result.data)
            for (let item of newRaces) {
                raceColors.push(item.raceColors)
            }
            await AsyncStorage.setItem('raceList', JSON.stringify(newRaces));

            this.setState({ races: newRaces, error: errorHandler(result), raceColors, loading: false })
        } catch (err) {
            console.log(err)
            logger.log(err)
        }
    }

    updateSearch = async (search: string) => {
        this.setState({ search })
        const raceType = await AsyncStorage.getItem('showPublicRaces');
        if (search.trim() === "") {
            this.setState({ currentLoadedRaces: 0, races: [] }, () => this.getRacesFromServer())
            return;
        }
        const searchedRaces = await racesApi.SearchRaceList(search, raceType, this.context.user._id);
        this.setState({ races: searchedRaces.data })

    }

    pickRace = (race: RaceModel) => {
        const characterInfo = { ...this.state.characterInfo }
        characterInfo.strength = race.abilityBonus && race.abilityBonus.strength;
        characterInfo.constitution = race.abilityBonus && race.abilityBonus.constitution;
        characterInfo.dexterity = race.abilityBonus && race.abilityBonus.dexterity;
        characterInfo.charisma = race.abilityBonus && race.abilityBonus.charisma;
        characterInfo.wisdom = race.abilityBonus && race.abilityBonus.wisdom;
        characterInfo.intelligence = race.abilityBonus && race.abilityBonus.intelligence;
        this.state.isUserOffline ? characterInfo.raceId = race : characterInfo.raceId = race._id as any
        characterInfo.race = race.name;
        characterInfo.image = race.image;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.PickedRace, payload: race });
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
        })
        setTimeout(() => {
            if (race.changeBaseAttributePoints?.changePoints) {
                this.props.navigation.navigate("SpacialProficiencyRaces", { race: race });
                return;
            }
            this.props.navigation.navigate("SpacialRaceBonuses", { race: race });
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    showTimedErrorMessage = () => {
        setTimeout(() => {
            return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 200 }}>
                <AppText textAlign={'center'} fontSize={30}>Opps...</AppText>
                <AppText textAlign={'center'} fontSize={22}>Either we have a problem with our servers or your version of DnCreate is not updated</AppText>
                <AppText textAlign={'center'} fontSize={22}>Please check if you downloaded the latest version of DnCreate from the app store.</AppText>
            </View>
        }, 3000);
    }
    render() {
        return (
            <View>
                {!this.state.isInternet ?
                    <View>
                        <AppNoInternet />
                    </View>
                    :
                    this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                        this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                            <View >
                                {this.state.races.length === 0 ? <>
                                    {this.showTimedErrorMessage()}
                                </> :
                                    <View>
                                        <View style={{
                                            width: width / 2, position: "absolute", zIndex: 10,
                                            alignSelf: 'center',
                                            top: '9%',
                                        }}>
                                            <SearchBar
                                                searchIcon={false}
                                                containerStyle={{ backgroundColor: this.state.searchColor, borderRadius: 150 }}
                                                inputContainerStyle={{ backgroundColor: this.state.searchColor }}
                                                lightTheme={this.state.searchColor === "#121212" ? false : true}
                                                placeholder="Search For Race"
                                                onChangeText={this.updateSearch}
                                                value={this.state.search}
                                            />
                                        </View>
                                        <View>
                                            <AnimatedHorizontalList
                                                loadNextRaceBatch={() => {
                                                    if (this.state.search === '') {
                                                        this.getRacesFromServer()
                                                    }
                                                }}
                                                data={this.state.races} backDropColors={this.state.raceColors}
                                                onPress={(val: any) => { this.pickRace(val) }} />
                                        </View>
                                    </View>}
                                <Modal visible={this.state.disclaimerModal} animationType="slide">
                                    <View>
                                        <AppText textAlign={'center'} fontSize={22}>Important notice</AppText>
                                        <AppText textAlign={'center'} fontSize={17}>Purchasing the 5e players handbook is a must if you wish to have the full game experience.</AppText>
                                        <AppText textAlign={'center'} fontSize={17}>DnCreate is only a tool to ease character creation and the leveling process.</AppText>
                                        <AppText textAlign={'center'} fontSize={17}>Before using DnCreate or considering donating to us we extremely
                                                recommend purchasing the players handbook from Wizards Of The Coast.</AppText>
                                        <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => {
                                            this.setState({ disclaimerModal: false }, async () => {
                                                await AsyncStorage.setItem('shownDisclaimer', "true")
                                            })
                                        }}
                                            fontSize={18} borderRadius={25} width={120} height={65} title={"I Understand"} />
                                    </View>
                                </Modal>
                            </View>}
            </View>
        )
    }
}
