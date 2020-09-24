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

interface CharFlawsState {
    characterInfo: CharacterModel
    confirmed: boolean
}

export class CharFlaws extends Component<{ navigation: any }, CharFlawsState>{
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
    componentDidMount() {
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
        this.setState({ characterInfo });
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.flaws || this.state.characterInfo.flaws.length === 0) {
            Alert.alert("No Flaws", "Are you sure you want to continue without any Flaws?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharBonds")
                }
            }, { text: 'No' }])
        } else {
            characterInfo.flaws = characterInfo.flaws.filter(flaw => { return flaw !== undefined })
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharBonds")
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    render() {
        const flaws = this.state.characterInfo.flaws;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Flaws</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Flaws.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Anyone has flaws even your character, Try to fit your flaws towards the playstyle you want to take.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Flaws can be dangerous... especially with a cunning DM, be cautious.</AppText>
                        </View>
                        <AppTextInput value={flaws ? flaws[0] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 0) }} padding={10} placeholder={"I judge others harshly, and myself even more severely..."} width={"80%"} />
                        <AppTextInput value={flaws ? flaws[1] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 1) }} padding={10} placeholder={"I can't resist a pretty face..."} width={"80%"} />
                        <AppTextInput value={flaws ? flaws[2] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 2) }} padding={10} placeholder={'I turn tail and run when things go bad...'} width={"80%"} />
                        <AppTextInput value={flaws ? flaws[3] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 3) }} padding={10} placeholder={"I'll do anything to win fame and renown..."} width={"80%"} />
                        <AppTextInput value={flaws ? flaws[4] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 4) }} padding={10} placeholder={'I am slow to trust members of other races...'} width={"80%"} />
                        <AppTextInput value={flaws ? flaws[5] : ''} onChangeText={(flaw: string) => { this.addTrait(flaw, 5) }} padding={10} placeholder={"In fact, the world does revolve around me..."} width={"80%"} />
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