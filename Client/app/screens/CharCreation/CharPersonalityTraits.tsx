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

interface CharPersonalityTraitsState {
    characterInfo: CharacterModel
    confirmed: boolean
}

export class CharPersonalityTraits extends Component<{ navigation: any }, CharPersonalityTraitsState>{
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

    addTrait = (trait: string, index: number) => {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.personalityTraits) {
            characterInfo.personalityTraits = [];
        }
        characterInfo.personalityTraits[index] = trait;
        this.setState({ characterInfo }, () => {
        });
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.personalityTraits || this.state.characterInfo.personalityTraits.length === 0) {
            Alert.alert("No Traits", "Are you sure you want to continue without any Traits?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharIdeals")
                }
            }, { text: 'No' }])
        } else {
            characterInfo.personalityTraits = characterInfo.personalityTraits.filter(trait => { return trait !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharIdeals")
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }
    componentDidMount() {
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.personalityTraits) {
            characterInfo.personalityTraits = [];
        }
        this.setState({ characterInfo })
    }

    render() {
        const traits = this.state.characterInfo.personalityTraits;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Personality Traits</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters personality traits, (the recommended number is two) </AppText>
                        </View>
                        <AppTextInput value={traits ? traits[0] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 0) }} padding={10} placeholder={"I idolize a particular hero of my faith and constantly refer to that person's deeds and example..."} width={"80%"} />
                        <AppTextInput value={traits ? traits[1] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 1) }} padding={10} placeholder={'Nothing can shake my optimistic attitude....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[2] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 2) }} padding={10} placeholder={'Flattery is my preferred trick for getting what I want....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[3] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 3) }} padding={10} placeholder={'I pocket anything I see that might have some value...'} width={"80%"} />
                        <AppTextInput value={traits ? traits[4] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 4) }} padding={10} placeholder={'I blow up at the slightest insult....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[5] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 5) }} padding={10} placeholder={'My favor, once lost, is lost forever....'} width={"80%"} />
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