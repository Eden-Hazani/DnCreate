import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
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
import { AppError } from '../../components/AppError';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { ModifiersModel } from '../../models/modifiersModel';
import { RaceModel } from '../../models/raceModel';
import { UserModel } from '../../models/userModel';
import { AppConfirmation } from '../../components/AppConfirmation';
import colors from '../../config/colors';

interface RaceListState {
    userInfo: UserModel
    characterInfo: CharacterModel
    search: string
    races: any
    refreshing: boolean
    error: boolean
    loading: boolean
    confirmed: boolean
}

export class RaceList extends Component<{ props: any, navigation: any }, RaceListState> {
    private unsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            search: '',
            loading: false,
            races: [],
            userInfo: store.getState().user,
            characterInfo: store.getState().character,
            refreshing: false,
            error: false
        }
        this.unsubscribeStore = store.subscribe(() => {
            store.getState().character
        })
    }
    componentDidMount() {
        this.getRaces();
    }
    componentWillUnmount() {
        this.unsubscribeStore()
    }
    getRaces = async () => {
        this.setState({ loading: true })
        const result = await racesApi.getRaceList();
        console.log(result)
        this.setState({ loading: false })
        const races = result.data;
        this.setState({ races, error: errorHandler(result) })
    }
    updateSearch = async (search: string) => {
        this.setState({ search })
        if (search.trim() === "") {
            this.getRaces()
            return;
        }
        const result = await racesApi.SearchRaceList(search)
        const races = result.data
        this.setState({ races })
    }

    pickRace = (race: RaceModel) => {
        const characterInfo = { ...this.state.characterInfo }
        characterInfo.modifiers = Object.assign(characterInfo.modifiers, race.abilityBonus)
        characterInfo.race = race.name;
        characterInfo.image = race.image;
        characterInfo.user_id = this.state.userInfo._id;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.PickedRace, payload: race });
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
        })
        setTimeout(() => {
            this.props.navigation.navigate("NewCharInfo")
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                        <View>
                            {this.state.error ? <>
                                <AppError onPress={() => { this.getRaces() }} />
                            </> :
                                <View>
                                    <SearchBar
                                        containerStyle={{ backgroundColor: colors.white }}
                                        inputContainerStyle={{ backgroundColor: colors.white }}
                                        lightTheme
                                        placeholder="Search For Race"
                                        onChangeText={this.updateSearch}
                                        value={this.state.search}
                                    />
                                    <FlatList
                                        data={this.state.races}
                                        keyExtractor={races => races._id.toString()}
                                        renderItem={({ item }) => <ListItem
                                            title={item.name}
                                            subTitle={item.description}
                                            imageUrl={`${Config.serverUrl}/assets/${item.image}`}
                                            headTextAlign={"center"}
                                            subTextAlign={"center"}
                                            padding={80} width={100} height={100}
                                            direction={'column'} onPress={() => this.pickRace(item)} />} ItemSeparatorComponent={ListItemSeparator} refreshing={this.state.refreshing}
                                        onRefresh={() => {
                                            this.state.races
                                        }} />
                                </View>}
                        </View>}
            </View>
        )
    }
}

