import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import TextInputDropDown from '../../components/TextInputDropDown';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharBondsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateBonds: boolean
    openAutoComplete: boolean[]
}

const fillingList: string[] = ["Everything I do is for the common people", "I'm trying to pay off an old debt I owe to a generous benefactor",
    "I want to be famous, whatever it takes", "I worked the land, I love the land, and I will protect the land", "I protect those who cannot protect themselves",
    "I pursue wealth to secure someone's love"]

export class CharBonds extends Component<{ route: any, navigation: any, updateBonds: boolean }, CharBondsState>{
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            openAutoComplete: [],
            baseState: '',
            updateBonds: this.props.route.params.updateBonds,
            confirmed: false,
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
        })
        if (this.props.route.params.updateBonds) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                this.setState({ baseState: JSON.stringify(this.state.characterInfo) })
            })
        }
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.bonds) {
            characterInfo.bonds = [];
        }
        this.setState({ characterInfo })
    }

    addTrait = (bond: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.bonds) {
            characterInfo.bonds = [];
        }
        characterInfo.bonds[index] = bond;
        if (bond.trim() === "") {
            characterInfo.bonds.splice(index, 1)
        }
        this.setState({ characterInfo });
    }

    insertInfoAndContinue = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.bonds || this.state.characterInfo.bonds.length === 0) {
            Alert.alert("No Bonds", "Are you sure you want to continue without any Bonds?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("SaveCharacter")
                }
            }, { text: 'No' }])
        } else {
            characterInfo.bonds = characterInfo.bonds && characterInfo.bonds.filter(bond => { return bond !== undefined })
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("SaveCharacter")
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateBonds = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.bonds || this.state.characterInfo.bonds.length === 0) {
            Alert.alert("No Bonds", "Are you sure you want to continue without any Bonds?", [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo);
                }
            }, { text: 'No' }])
        } else {
            characterInfo.bonds = characterInfo.bonds && characterInfo.bonds.filter(bond => { return bond !== undefined })
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo)
                setTimeout(() => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo);
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === this.state.characterInfo._id) {
                    characters[index] = this.state.characterInfo;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }

    cancelUpdate = () => {
        this.setState({ characterInfo: JSON.parse(this.state.baseState) }, () => {
            this.props.navigation.addListener('beforeRemove', (e: any) => {
                this.props.navigation.dispatch(e.data.action)
            })
            this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
        });
    }

    changeAutoCompleteState = (index: number, action: boolean) => {
        const openAutoComplete = this.state.openAutoComplete;
        openAutoComplete[index] = action;
        console.log(openAutoComplete)
        this.setState({ openAutoComplete })
    }

    generateJSX = (bonds: any) => {
        let jsxList: any[] = [];
        for (let i: number = 0; i < 6; i++) {
            jsxList.push(<View key={i}>
                <AppTextInput
                    onBlur={() => this.changeAutoCompleteState(i, false)}
                    onFocus={() => this.changeAutoCompleteState(i, true)} value={bonds ? bonds[i] : ''}
                    onChangeText={(trait: string) => { this.addTrait(trait, i) }} padding={10}
                    placeholder={fillingList[i]} width={"80%"} />
                <TextInputDropDown sendText={(val: string) => {
                    this.changeAutoCompleteState(i, false)
                    this.addTrait(val, i)
                }} expendedWidth={Dimensions.get('window').width / 1.2} expendedHeight={450}
                    information={fillingList} isOpen={this.state.openAutoComplete[i]} />
            </View>)
        }
        return jsxList
    }

    render() {
        const bonds = this.state.characterInfo.bonds;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Bonds</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Bonds.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Bonds represent a character’s connections to people, places, and events in the world. They tie you to things from your background.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>They can work very much like ideals, driving a character’s motivations and goals.</AppText>
                        </View>
                        {this.generateJSX(bonds)}
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateBonds ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateBonds() }} />
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Cancel"} onPress={() => { this.cancelUpdate() }} />
                                </View>
                                :
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                            }
                        </View>
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    textContainer: {
        paddingTop: 15
    }
});