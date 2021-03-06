import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Modal, Dimensions } from 'react-native';
import { Unsubscribe } from 'redux';
import userCharApi from '../api/userCharApi';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/forms/AppTextInput';
import { ListItem } from '../components/ListItem';
import ListItemDelete from '../components/ListItemDelete';
import { ListItemSeparator } from '../components/ListItemSeparator';
import ListItemDecreaseIncrease from '../components/ListItemDecreaseIncrease';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-elements';
import { IconGen } from '../components/IconGen';
import AuthContext from '../auth/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CharItemsState {
    character: CharacterModel
    addItemModal: boolean
    changeCurrencyModal: boolean
    newItem: {
        name: string,
        description: string
    },
    newAmount: number
    newGold: number
    newSilver: number
    newCopper: number
    search: string
    searchedItems: any
    isDm: boolean
}

export class CharItems extends Component<{ navigation: any, route: any }, CharItemsState> {
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            isDm: this.props.route.params.isDm ? true : false,
            newGold: 0,
            newSilver: 0,
            newCopper: 0,
            changeCurrencyModal: false,
            newAmount: 0,
            newItem: { name: "", description: "" },
            addItemModal: false,
            character: this.props.route.params.isDm ? this.props.route.params.isDm : store.getState().character,
            search: '',
            searchedItems: []
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentDidMount() {
        if (this.props.route.params.isDm) {
            this.setState({ newGold: this.props.route.params.isDm.gold, newSilver: this.props.route.params.isDm.currency.silver, newCopper: this.props.route.params.isDm.currency.copper })
        }
        if (!this.props.route.params.isDm) {
            const charStoreCurr = store.getState().character.currency;
            if (charStoreCurr) {
                this.setState({ newGold: charStoreCurr.gold, newSilver: charStoreCurr.silver, newCopper: charStoreCurr.copper })
            }
        }
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === this.state.character._id) {
                    characters[index] = this.state.character;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }



    addItem = () => {
        if (this.state.newItem.name.length === 0 || this.state.newAmount === 0) {
            alert("Cannot Leave Name Or amount Empty!");
            return;
        }
        const character = store.getState().character;
        const item = [this.state.newItem, this.state.newAmount];
        character.items.push(item);
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
            this.setState({ addItemModal: false, newItem: { description: "", name: "" }, newAmount: 0 })
        })

    }

    handleDelete = (item: any) => {
        const character = store.getState().character;
        const items = character.items.filter((listItem: any) => listItem !== item);
        character.items = items
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
        })
    }

    increaseItemQuantity = (item: string, amount: number) => {
        const character = store.getState().character;
        amount = 1 + +amount;
        character.items.forEach((listItem: any) => {
            if (listItem[0] === item) {
                listItem[1] = amount;
            }
        })
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
        })
    }

    decreaseItemQuantity = (item: string, amount: number) => {
        const character = store.getState().character;
        amount = +amount - 1;
        character.items.forEach((listItem: any) => {
            if (listItem[0] === item) {
                listItem[1] = amount;
                if (listItem[1] === 0) {
                    this.handleDelete(listItem)
                }
            }
        })
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
        })
    }

    changeCurrencyAmount = () => {
        if (this.state.newGold < 0 || this.state.newSilver < 0 || this.state.newCopper < 0) {
            alert('Currency values must be above 0');
            return
        }
        const character = { ...this.state.character };
        if (character.currency) {
            character.currency.gold = +this.state.newGold;
            character.currency.silver = +this.state.newSilver;
            character.currency.copper = +this.state.newCopper;
        }
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
            this.setState({ changeCurrencyModal: false })
        })
    }

    openCurrencyChange = () => {
        if (this.state.character.currency) {
            this.setState({ newGold: this.state.character.currency.gold, newSilver: this.state.character.currency.silver, newCopper: this.state.character.currency.copper }, () => {
                this.setState({ changeCurrencyModal: true })
            })
        }
    }

    updateSearch = async (search: string) => {
        const character = { ...this.state.character };
        this.setState({ search })
        if (search.trim() === "") {
            this.setState({ character: this.state.isDm ? this.props.route.params.isDm : store.getState().character })
            return;
        }
        const items = this.state.character.items.filter((item: any) => { return item[0].includes(search) });
        character.items = items;
        this.setState({ character })
    }

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={{ paddingTop: 10, paddingLeft: 25 }}>
                        <AppText fontSize={35} color={Colors.bitterSweetRed}>Currency</AppText>
                        <TouchableOpacity style={styles.currency} onPress={() => { this.openCurrencyChange() }} disabled={this.state.isDm}>
                            <AppText fontSize={20}>{`Gold ${this.state.character.currency && this.state.character.currency.gold} Silver ${this.state.character.currency && this.state.character.currency.silver} Copper ${this.state.character.currency && this.state.character.currency.copper}`}</AppText>
                        </TouchableOpacity>
                    </View>
                    <Modal visible={this.state.changeCurrencyModal}>
                        <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                            <View style={{ flex: .8, justifyContent: "center", paddingTop: 25, alignItems: "center" }}>
                                <AppText fontSize={18} color={Colors.bitterSweetRed}>Gold</AppText>
                                <AppTextInput keyboardType={'numeric'} iconName={"podium-gold"} value={`${this.state.newGold}`} placeholder={'Gold'} onChangeText={(amount: number) => { this.setState({ newGold: amount }) }} />
                                <AppText fontSize={18} color={Colors.bitterSweetRed}>Silver</AppText>
                                <AppTextInput keyboardType={'numeric'} iconName={"podium-silver"} value={`${this.state.newSilver}`} placeholder={'Silver'} onChangeText={(amount: number) => { this.setState({ newSilver: amount }) }} />
                                <AppText fontSize={18} color={Colors.bitterSweetRed}>Copper</AppText>
                                <AppTextInput keyboardType={'numeric'} iconName={"podium-bronze"} value={`${this.state.newCopper}`} placeholder={'Copper'} onChangeText={(amount: number) => { this.setState({ newCopper: amount }) }} />
                            </View>
                            <View style={{ flex: .2, flexDirection: 'row' }}>
                                <View style={{ flex: .5 }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} width={100}
                                        height={50} borderRadius={25} title={"Cancel"} onPress={() => { this.setState({ changeCurrencyModal: false }) }} />
                                </View>
                                <View style={{ flex: .5 }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} width={100}
                                        height={50} borderRadius={25} title={"Change"} onPress={() => { this.changeCurrencyAmount() }} />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{ flexDirection: "row", padding: 25 }}>
                    <View style={{ flex: .7 }}>
                        <AppText fontSize={35} color={Colors.bitterSweetRed}>Items</AppText>
                    </View>
                    <View style={{ flex: .2 }}>
                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} width={100} disabled={this.state.isDm}
                            height={50} borderRadius={25} title={"Add Item"} onPress={() => { this.setState({ addItemModal: true }) }} />
                    </View>
                </View>
                <Modal visible={this.state.addItemModal}>
                    <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                        <View style={{ flex: .8, justifyContent: "center", alignItems: "center" }}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25}>Add Item</AppText>
                            <AppTextInput placeholder={'Item Name'} onChangeText={(item: string) => {
                                const newItem = { ...this.state.newItem };
                                newItem.name = item;
                                this.setState({ newItem })
                            }} />
                            <AppTextInput
                                numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                placeholder={'Item Description (optional)...'} onChangeText={(description: string) => {
                                    const newItem = { ...this.state.newItem };
                                    newItem.description = description;
                                    this.setState({ newItem })
                                }} />
                            <AppTextInput keyboardType={"numeric"} placeholder={'Amount'} onChangeText={(amount: number) => { this.setState({ newAmount: amount }) }} />
                        </View>
                        <View style={{ flex: .4, flexDirection: "row" }}>
                            <View style={{ flex: .5 }}>
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                                    height={100} title={"Add Item"} onPress={() => {
                                        this.addItem()
                                    }} />
                            </View>
                            <View style={{ flex: .5 }}>
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                                    height={100} title={"Back"} onPress={() => { this.setState({ addItemModal: false }) }} />
                            </View>
                        </View>
                    </View>
                </Modal>
                <SearchBar
                    containerStyle={{ backgroundColor: Colors.pageBackground }}
                    inputContainerStyle={{ backgroundColor: Colors.pageBackground }}
                    lightTheme={Colors.pageBackground === "#121212" ? false : true}
                    placeholder="Search For Item"
                    onChangeText={this.updateSearch}
                    value={this.state.search}
                />
                {this.state.character.items.length > 0 && this.state.searchedItems.length === 0 ?
                    <View style={{ paddingBottom: Dimensions.get('screen').height / 1.3 }}>
                        <FlatList
                            data={this.state.character.items}
                            keyExtractor={(status, index) => index.toString()}
                            renderItem={({ item }) => <ListItem
                                title={item[0].name ? `Item - ${item[0].name}` : `Item - ${item[0]}`}
                                subTitle={`Amount -  ${item[1]}`}
                                direction={'row'}
                                subColor={Colors.bitterSweetRed}
                                headerFontSize={20}
                                padding={20} width={60} height={60}
                                headTextAlign={"left"}
                                subTextAlign={"left"}
                                secSubTextAlign={"left"}
                                secSubTitle={item[0].description ? item[0].description : null}
                                justifyContent={"flex-start"} textDistanceFromImg={10}
                                renderLeftActions={() =>
                                    <ListItemDecreaseIncrease
                                        onPressIncrease={() => { this.increaseItemQuantity(item[0], item[1]) }}
                                        onPressDecrease={() => { this.decreaseItemQuantity(item[0], item[1]) }} />
                                }
                                renderRightActions={() =>
                                    <ListItemDelete onPress={() => this.handleDelete(item)} />
                                }
                                onPress={() => { }}
                            />}
                            ItemSeparatorComponent={ListItemSeparator} />
                    </View>
                    : null}
                {this.state.character.items.length > 0 && this.state.searchedItems.length > 0 ?
                    <View >
                        <FlatList
                            data={this.state.searchedItems}
                            keyExtractor={(stats, index) => index.toString()}
                            renderItem={({ item }) => <ListItem
                                title={`Item - ${item}`}
                                direction={'row'}
                                subColor={Colors.bitterSweetRed}
                                headerFontSize={20}
                                padding={20} width={60} height={60}
                                headTextAlign={"left"}
                                subTextAlign={"left"}
                                justifyContent={"flex-start"} textDistanceFromImg={10}
                                renderLeftActions={() =>
                                    <ListItemDecreaseIncrease
                                        onPressIncrease={() => { this.increaseItemQuantity(item[0], item[1]) }}
                                        onPressDecrease={() => { this.decreaseItemQuantity(item[0], item[1]) }} />
                                }
                                renderRightActions={() =>
                                    <ListItemDelete onPress={() => this.handleDelete(item)} />
                                }
                                onPress={() => { }}
                            />}
                            ItemSeparatorComponent={ListItemSeparator} />
                    </View>
                    : null}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    currency: {
        padding: 8,
        width: 260,
        borderWidth: 1,
        borderColor: Colors.bitterSweetRed,
        borderRadius: 25
    }
});