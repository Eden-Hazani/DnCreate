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

interface CharFlawsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateFlaws: boolean
    openAutoComplete: boolean[]
}

const fillingList: string[] = ['I judge others harshly, and myself even more severely', "I can't resist a pretty face", "I turn tail and run when things go bad.",
    "I'll do anything to win fame and renown", "I am slow to trust members of other races", "In fact, the world does revolve around me"]

export class CharFlaws extends Component<{ route: any, navigation: any, updateFlaws: boolean }, CharFlawsState>{
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            openAutoComplete: [],
            baseState: '',
            updateFlaws: this.props.route.params.updateFlaws,
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
        if (this.props.route.params.updateFlaws) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                this.setState({ baseState: JSON.stringify(this.state.characterInfo) })
            })
        }
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.flaws) {
            characterInfo.flaws = [];
        }
        this.setState({ characterInfo })
    }

    addTrait = (flaws: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.flaws) {
            characterInfo.flaws = [];
        }
        characterInfo.flaws[index] = flaws;
        if (flaws.trim() === "") {
            characterInfo.flaws.splice(index, 1)
        }
        this.setState({ characterInfo });
    }

    insertInfoAndContinue = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.flaws || this.state.characterInfo.flaws.length === 0) {
            Alert.alert("No Flaws", "Are you sure you want to continue without any Flaws?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharBonds", { updateBonds: false })
                }
            }, { text: 'No' }])
        } else {
            characterInfo.flaws = characterInfo.flaws && characterInfo.flaws.filter(flaw => { return flaw !== undefined })
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharBonds", { updateBonds: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateFlaws = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.flaws || this.state.characterInfo.flaws.length === 0) {
            Alert.alert("No Flaws", "Are you sure you want to continue without any Flaws?", [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo);
                }
            }, { text: 'No' }])
        } else {
            characterInfo.flaws = characterInfo.flaws && characterInfo.flaws.filter(flaw => { return flaw !== undefined })
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

    generateJSX = (flaws: any) => {
        let jsxList: any[] = [];
        for (let i: number = 0; i < 6; i++) {
            jsxList.push(<View key={i}>
                <AppTextInput
                    onBlur={() => this.changeAutoCompleteState(i, false)}
                    onFocus={() => this.changeAutoCompleteState(i, true)} value={flaws ? flaws[i] : ''}
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
        const flaws = this.state.characterInfo.flaws;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Flaws</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Flaws.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Anyone has flaws even your character, Try to fit your flaws towards the playstyle you want to take.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Flaws can be dangerous... especially with a cunning DM, be cautious.</AppText>
                        </View>
                        {this.generateJSX(flaws)}
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateFlaws ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateFlaws() }} />
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