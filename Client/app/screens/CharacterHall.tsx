import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from '../components/ListItem';
import { ListItemSeparator } from '../components/ListItemSeparator';
import ListItemDelete from '../components/ListItemDelete';
import { SelectCharacter } from './SelectCharacter';
import { CharacterModel } from '../models/characterModel';
import userCharApi from '../api/userCharApi';
import { UserModel } from '../models/userModel';
import AuthContext from '../auth/context';
import { AppText } from '../components/AppText';
import colors from '../config/colors';
import { Config } from '../../config';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import errorHandler from '../../utility/errorHander';
import { AppError } from '../components/AppError';
import { store } from '../redux/store';
import { ActionType } from '../redux/action-type';



interface CharacterHallState {
    characters: CharacterModel[]
    userInfo: UserModel
    loading: boolean
    error: boolean
}


export class CharacterHall extends Component<{ props: any, navigation: any }, CharacterHallState> {
    navigationSubscription: any;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            error: false,
            loading: false,
            userInfo: this.context,
            characters: [],
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    async componentDidMount() {
        this.setState({ loading: true })
        const response = await userCharApi.getChars(this.context.user._id);
        this.setState({ loading: false })
        const characters = response.data;
        this.setState({ characters, error: errorHandler(response) });
    }
    onFocus = async () => {
        this.setState({ loading: true })
        const response = await userCharApi.getChars(this.context.user._id);
        this.setState({ loading: false })
        const characters = response.data;
        this.setState({ characters, error: errorHandler(response) });
    }


    handleDelete = (character: CharacterModel) => {
        //delete the character from list.
        for (let item of this.state.characters) {
            if (item._id === character._id) {
                const characters = this.state.characters.filter(m => m._id !== item._id)
                this.setState({ characters })
            }
        }
        //delete the character from the server.
        userCharApi.deleteChar(character._id)
    }

    characterWindow = (character: CharacterModel) => {
        store.dispatch({ type: ActionType.SetInfoToChar, payload: character })
        this.props.navigation.navigate("SelectCharacter", character)
    }

    render() {
        return (
            <View>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View>
                        {this.state.error ? <AppError /> :
                            <View>
                                {this.state.characters.length === 0 ?
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <AppText color={colors.bitterSweetRed} fontSize={20}>No Characters</AppText>
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
                                                <ListItemDelete onPress={() => this.handleDelete(item)} />}
                                            onPress={() => this.characterWindow(item)} />}
                                        ItemSeparatorComponent={ListItemSeparator} />}
                            </View>}
                    </View>}
            </View>
        )
    }
}