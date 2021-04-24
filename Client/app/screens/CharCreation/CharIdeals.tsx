import AsyncStorage from '@react-native-async-storage/async-storage';
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

interface CharIdealsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateIdeals: boolean
    openAutoComplete: boolean[]
}

const fillingList: string[] = ['Independence. I am a free spirit--no one tells me what to do', "Greed. I'm only in it for the money", "Family. Blood runs thicker than water",
    "Honor. If I dishonor myself, I dishonor my whole clan", "Respect. All people, rich or poor, deserve respect", "People. I'm committed to my crewmates, not to ideals"]

export class CharIdeals extends Component<{ route: any, navigation: any, updateIdeals: boolean }, CharIdealsState>{
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            openAutoComplete: [],
            baseState: '',
            updateIdeals: this.props.route.params.updateIdeals,
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
        if (this.props.route.params.updateIdeals) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                this.setState({ baseState: JSON.stringify(this.state.characterInfo) })
            });
        }
    }

    addTrait = (ideal: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.ideals) {
            characterInfo.ideals = [];
        }
        characterInfo.ideals[index] = ideal;
        if (ideal.trim() === "") {
            characterInfo.ideals.splice(index, 1)
        }
        this.setState({ characterInfo });
    }

    insertInfoAndContinue = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.ideals || this.state.characterInfo.ideals.length === 0) {
            Alert.alert("No Ideals", "Are you sure you want to continue without any Ideals?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharFlaws", { updateFlaws: false })
                }
            }, { text: 'No' }])
        } else {
            characterInfo.ideals = characterInfo.ideals && characterInfo.ideals.filter(ideal => { return ideal !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharFlaws", { updateFlaws: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateIdeals = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.ideals || this.state.characterInfo.ideals.length === 0) {
            Alert.alert("No Ideals", "Are you sure you want to continue without any Ideals?", [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
                }
            }, { text: 'No' }])
        } else {
            characterInfo.ideals = characterInfo.ideals && characterInfo.ideals.filter(ideal => { return ideal !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.characterInfo)
                setTimeout(() => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
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
        this.setState({ openAutoComplete })
    }

    generateJSX = (ideals: any) => {
        let jsxList: any[] = [];
        for (let i: number = 0; i < 6; i++) {
            jsxList.push(<View key={i}>
                <AppTextInput
                    onBlur={() => this.changeAutoCompleteState(i, false)}
                    onFocus={() => this.changeAutoCompleteState(i, true)} value={ideals ? ideals[i] : ''}
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
        const ideals = this.state.characterInfo.ideals;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Ideals</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Ideals, When writing these remember that your character will follow these ideals to their death</AppText>
                            <AppText fontSize={18} textAlign={"center"}>The DM can also use your ideals against you, be mindful yet innovative</AppText>
                        </View>
                        {this.generateJSX(ideals)}
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateIdeals ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateIdeals() }} />
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