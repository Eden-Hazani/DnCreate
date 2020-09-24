import React, { Component } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Unsubscribe } from 'redux';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharBackstoryState {
    characterInfo: CharacterModel
    backstory: string
    confirmed: boolean
}

export class CharBackstory extends Component<{ navigation: any }, CharBackstoryState> {
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            backstory: '',
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { });
    }


    componentWillUnmount() {
        this.UnsubscribeStore();
    }

    insertInfoAndContinue = () => {
        if (this.state.backstory.length === 0) {
            Alert.alert("No Story", "Are you sure you want to continue without a backstory?", [{
                text: 'Yes', onPress: () => {
                    const characterInfo = { ...this.state.characterInfo };
                    characterInfo.backStory = this.state.backstory;
                    this.setState({ characterInfo }, () => {
                        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                        this.props.navigation.navigate("CharPersonalityTraits")
                    })
                }
            }, { text: 'No' }])
        } else {
            const characterInfo = { ...this.state.characterInfo };
            characterInfo.backStory = this.state.backstory;
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharPersonalityTraits")
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    render() {
        const character = this.state.characterInfo;
        return (
            <ScrollView>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View style={styles.container}>
                        <View style={{ marginBottom: 50, padding: 15 }}>
                            <AppText fontSize={25} textAlign={"center"} color={colors.bitterSweetRed}>BackStory, Personality Trait, Flaws, Ideals and Bonds </AppText>
                            <AppText textAlign={"center"} fontSize={18}>In the next section you will need to write and pick Personality Trait, Flaws, Ideals and Bonds that define your character.</AppText>
                            <AppText textAlign={"center"} fontSize={18}>Feel free to consult with your DM in order to write a good background story that fits the world of the current adventure.</AppText>
                            <AppText textAlign={"center"} fontSize={18}>From this point on your character has been saved and you can access it through the character hall.</AppText>
                        </View>
                        <AppText textAlign={"center"} color={colors.bitterSweetRed} fontSize={18}>The short backstory of {character.name}'s origins.</AppText>
                        <AppTextInput onChangeText={(backstory: string) => { this.setState({ backstory }) }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s backstory...`} width={"95%"} multiline={true} numberOfLines={10} />
                        <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"
    }
});