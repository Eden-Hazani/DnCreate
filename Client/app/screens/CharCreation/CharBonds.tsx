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

interface CharBondsState {
    characterInfo: CharacterModel
    confirmed: boolean
}

export class CharBonds extends Component<{ navigation: any }, CharBondsState>{
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
        this.setState({ characterInfo }, () => {
        });
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.bonds || this.state.characterInfo.bonds.length === 0) {
            Alert.alert("No Bonds", "Are you sure you want to continue without any Bonds?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("SaveCharacter")
                }
            }, { text: 'No' }])
        } else {
            characterInfo.bonds = characterInfo.bonds.filter(bond => { return bond !== undefined })
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

    render() {
        const bonds = this.state.characterInfo.bonds;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Bonds</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters Bonds.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Bonds represent a character’s connections to people, places, and events in the world. They tie you to things from your background.</AppText>
                            <AppText fontSize={18} textAlign={"center"}>They can work very much like ideals, driving a character’s motivations and goals.</AppText>
                        </View>
                        <AppTextInput value={bonds ? bonds[0] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 0) }} padding={10} placeholder={"Everything I do is for the common people..."} width={"80%"} />
                        <AppTextInput value={bonds ? bonds[1] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 1) }} padding={10} placeholder={"I'm trying to pay off an old debt I owe to a generous benefactor..."} width={"80%"} />
                        <AppTextInput value={bonds ? bonds[2] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 2) }} padding={10} placeholder={'I want to be famous, whatever it takes...'} width={"80%"} />
                        <AppTextInput value={bonds ? bonds[3] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 3) }} padding={10} placeholder={"I worked the land, I love the land, and I will protect the land..."} width={"80%"} />
                        <AppTextInput value={bonds ? bonds[4] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 4) }} padding={10} placeholder={'I protect those who cannot protect themselves..'} width={"80%"} />
                        <AppTextInput value={bonds ? bonds[5] : ''} onChangeText={(bond: string) => { this.addTrait(bond, 5) }} padding={10} placeholder={"I pursue wealth to secure someone's love..."} width={"80%"} />
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