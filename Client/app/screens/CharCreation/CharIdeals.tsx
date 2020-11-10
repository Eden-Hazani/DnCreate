import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharIdealsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateIdeals: boolean
}

export class CharIdeals extends Component<{ route: any, navigation: any, updateIdeals: boolean }, CharIdealsState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            baseState: null,
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
            characterInfo.ideals = characterInfo.ideals.filter(ideal => { return ideal !== undefined });
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
            characterInfo.ideals = characterInfo.ideals.filter(ideal => { return ideal !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                userCharApi.updateChar(this.state.characterInfo)
                setTimeout(() => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
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

    render() {
        const ideals = this.state.characterInfo.ideals;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Ideals</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Ideals, When writing these remember that your character will follow these ideals to their death</AppText>
                            <AppText fontSize={18} textAlign={"center"}>The DM can also use your ideals against you, be mindful yet innovative</AppText>
                        </View>
                        <AppTextInput value={ideals ? ideals[0] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 0) }} padding={10} placeholder={"(Chaotic) Independence. I am a free spirit--no one tells me what to do..."} width={"80%"} />
                        <AppTextInput value={ideals ? ideals[1] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 1) }} padding={10} placeholder={"(Evil) Greed. I'm only in it for the money..."} width={"80%"} />
                        <AppTextInput value={ideals ? ideals[2] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 2) }} padding={10} placeholder={'(Any) Family. Blood runs thicker than water....'} width={"80%"} />
                        <AppTextInput value={ideals ? ideals[3] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 3) }} padding={10} placeholder={'(Lawful) Honor. If I dishonor myself, I dishonor my whole clan...'} width={"80%"} />
                        <AppTextInput value={ideals ? ideals[4] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 4) }} padding={10} placeholder={'(Good) Respect. All people, rich or poor, deserve respect...'} width={"80%"} />
                        <AppTextInput value={ideals ? ideals[5] : ''} onChangeText={(ideal: string) => { this.addTrait(ideal, 5) }} padding={10} placeholder={"(Neutral) People. I'm committed to my crewmates, not to ideals..."} width={"80%"} />
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateIdeals ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateIdeals() }} />
                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Cancel"} onPress={() => { this.cancelUpdate() }} />
                                </View>
                                :
                                <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
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