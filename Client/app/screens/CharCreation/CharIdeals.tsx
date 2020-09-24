import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Unsubscribe } from 'redux';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharIdealsState {
    characterInfo: CharacterModel
    confirmed: boolean
}

export class CharIdeals extends Component<{ navigation: any }, CharIdealsState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { })
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }

    addTrait = (ideal: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.ideals) {
            characterInfo.ideals = [];
        }
        characterInfo.ideals[index] = ideal;
        this.setState({ characterInfo });
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.ideals || this.state.characterInfo.ideals.length === 0) {
            Alert.alert("No Ideals", "Are you sure you want to continue without any Ideals?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharFlaws")
                }
            }, { text: 'No' }])
        } else {
            characterInfo.ideals = characterInfo.ideals.filter(ideal => { return ideal !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharFlaws")
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    render() {
        const ideals = this.state.characterInfo.ideals;
        return (
            <ScrollView style={styles.container}>
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
                            <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
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