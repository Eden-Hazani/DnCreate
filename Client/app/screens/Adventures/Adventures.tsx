import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Unsubscribe } from 'redux';
import errorHandler from '../../../utility/errorHander';
import adventureApi from '../../api/adventureApi';
import authApi from '../../api/authApi';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { ListItem } from '../../components/ListItem';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import colors from '../../config/colors';
import { AdventureModel } from '../../models/AdventureModel';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface AdventuresState {
    loading: boolean
    participatingAdventures: AdventureModel[]
    leadingAdventures: AdventureModel[]
    refreshing: boolean
    characters: CharacterModel[]
}

export class Adventures extends Component<{ props: any, navigation: any }, AdventuresState>{
    private UnsubscribeStore: Unsubscribe
    navigationSubscription: any;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            characters: store.getState().characters,
            loading: true,
            refreshing: false,
            leadingAdventures: store.getState().leadingAdv,
            participatingAdventures: store.getState().participatingAdv
        }
        this.UnsubscribeStore = store.subscribe(() => {
            this.setState({ leadingAdventures: store.getState().leadingAdv })
            this.setState({ participatingAdventures: store.getState().participatingAdv })
        })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);

    }

    onFocus = async () => {
        console.log('ff')
        if (this.state.characters.length === 0) {
            const characters = store.getState().characters;
            this.setState({ characters: characters }, () => {
                store.dispatch({ type: ActionType.SetCharacters, payload: this.state.characters })
                this.getLeadingAdv()
                this.getParticipatingAdv()
                this.setState({ loading: false })
            });
            return;
        }
        this.getLeadingAdv()
        this.getParticipatingAdv()
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 800);
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    getLeadingAdv = async () => {
        if (this.state.leadingAdventures.length === 0) {
            const leadingAdventures = await adventureApi.getLeadingAdventures(this.context.user._id);
            this.setState({ leadingAdventures: leadingAdventures.data }, () => {
                store.dispatch({ type: ActionType.SetLeadingAdv, payload: this.state.leadingAdventures })
            })
        }
    }

    getParticipatingAdv = async () => {
        try {
            if (this.state.participatingAdventures.length === 0) {
                let charIds = [];
                for (let character of this.state.characters) {
                    charIds.push(character._id)
                }
                const adventures = await adventureApi.getParticipationAdventures(charIds);
                if (!adventures.ok) {
                    errorHandler(adventures)
                    return;
                }
                if (adventures.data[0] === undefined) {
                    return;
                }
                let participatingAdventures = []
                for (let adventure of adventures.data) {
                    participatingAdventures.push(adventure[0])
                }
                this.setState({ participatingAdventures }, () => {
                    store.dispatch({ type: ActionType.SetParticipatingAdv, payload: this.state.participatingAdventures })
                })
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    getLeadingFromServer = async () => {
        const leadingAdventures = await adventureApi.getLeadingAdventures(this.context.user._id);
        this.setState({ leadingAdventures: leadingAdventures.data }, () => {
            store.dispatch({ type: ActionType.ClearLeadingAdv, payload: this.state.leadingAdventures })
        })
    }


    getParticipatingFromServer = async () => {
        try {
            let charIds = [];
            for (let character of this.state.characters) {
                charIds.push(character._id)
            }
            const adventures = await adventureApi.getParticipationAdventures(charIds);
            if (!adventures.ok) {
                errorHandler(adventures)
                return;
            }
            if (adventures.data[0] === undefined) {
                return;
            }
            let participatingAdventures = []
            for (let adventure of adventures.data) {
                if (adventure.length === 0) {
                    continue;
                }
                participatingAdventures.push(adventure[0])
            }
            this.setState({ participatingAdventures }, () => {
                store.dispatch({ type: ActionType.ClearParticipatingAdv, payload: this.state.participatingAdventures })
            })
        } catch (err) {
            console.log(err.message)
        }
    }

    goToParticipatingAdv = async (adventure: any) => {
        const response = await adventureApi.userInAdv(adventure.adventureIdentifier, this.context.user._id);
        if (!response.ok) {
            errorHandler(response)
            if (response.data === 'You are not part of this adventure') {

            }
            this.getParticipatingFromServer();
            return;
        }
        this.props.navigation.navigate("SelectedParticipationAdv", { adventure: adventure })
    }



    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View style={styles.container}>
                        <View style={{ flex: .5 }}>
                            <View style={styles.participating}>
                                <AppText fontSize={20} color={colors.bitterSweetRed}>Participating In:</AppText>
                            </View>
                            <FlatList
                                style={{ marginBottom: 10 }}
                                data={this.state.participatingAdventures}
                                keyExtractor={(adventures, index) => index.toString()}
                                renderItem={({ item }) => <ListItem
                                    title={`Adventure name: ${item.adventureName}`}
                                    subTitle={`Summery: ${item.adventureSetting}`}
                                    alignListItem={'flex-start'}
                                    headTextAlign={"left"}
                                    subTextAlign={"left"}
                                    headerFontSize={19}
                                    headColor={colors.bitterSweetRed}
                                    subFontSize={15}
                                    totalPadding={20}
                                    padding={10}
                                    direction={'column'} onPress={() => { this.goToParticipatingAdv(item) }} />} ItemSeparatorComponent={ListItemSeparator} refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.getParticipatingFromServer()
                                }} />
                        </View>
                        <View style={{ flex: .5 }}>
                            <View style={styles.leading}>
                                <AppText fontSize={20} color={colors.bitterSweetRed}>Leading:</AppText>
                            </View>
                            <FlatList
                                data={this.state.leadingAdventures}
                                keyExtractor={(adventures, index) => index.toString()}
                                renderItem={({ item }) => <ListItem
                                    title={`Adventure name: ${item.adventureName}`}
                                    subTitle={`Summery: ${item.adventureSetting}`}
                                    alignListItem={'flex-start'}
                                    headTextAlign={"left"}
                                    subTextAlign={"left"}
                                    headerFontSize={19}
                                    headColor={colors.bitterSweetRed}
                                    subFontSize={15}
                                    totalPadding={20}
                                    padding={10}
                                    direction={'column'} onPress={() => { this.props.navigation.navigate("SelectedLeadingAdv", { adventure: item }) }} />} ItemSeparatorComponent={ListItemSeparator} refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this.getLeadingFromServer()
                                }} />
                        </View>
                        <View style={styles.buttons}>
                            <AppButton backgroundColor={colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("StartAdventure") }} fontSize={18} borderRadius={25} width={125} height={100} title={"Start Adventure"} />
                            <AppButton backgroundColor={colors.bitterSweetRed}
                                onPress={() => { this.props.navigation.navigate("JoinAdventure") }} fontSize={18} borderRadius={25} width={125} height={100} title={"Join Adventure"} />
                        </View>
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttons: {
        flex: .2,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    participating: {
        backgroundColor: colors.softBlack,
        padding: 10
    },
    leading: {
        backgroundColor: colors.softBlack,
        padding: 10
    }
});