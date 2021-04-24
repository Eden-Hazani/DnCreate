import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharBackstoryState {
    characterInfo: CharacterModel
    backstory: string
    confirmed: boolean
}

export class CharBackstory extends Component<{ props: any, route: any, navigation: any, updateStory: boolean }, CharBackstoryState> {
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            backstory: '',
            characterInfo: store.getState().character,
        }
    }


    componentDidMount() {
        if (this.props.route.params.updateStory) {
            this.setState({ characterInfo: this.props.route.params.character })
        }
    }


    insertInfoAndContinue = () => {
        if (this.state.backstory.length === 0) {
            Alert.alert("No Story", "Are you sure you want to continue without a backstory?", [{
                text: 'Yes', onPress: () => {
                    const characterInfo = { ...this.state.characterInfo };
                    characterInfo.backStory = this.state.backstory;
                    this.setState({ characterInfo }, () => {
                        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                        this.props.navigation.navigate("CharacterAppearance", { updateAppearance: false })
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
                    this.props.navigation.navigate("CharacterAppearance", { updateAppearance: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }

    updateInfo = async () => {
        this.setState({ confirmed: true })
        store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
        this.context.user._id === "Offline" ? this.updateOfflineCharacter().then(() => this.props.navigation.goBack()) :
            userCharApi.updateChar(this.state.characterInfo).then(() => { this.props.navigation.goBack() })
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

    render() {
        const character = this.state.characterInfo;
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    this.props.route.params.updateStory ?
                        <View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The short backstory of {character.name}'s origins.</AppText>
                                <AppTextInput value={this.state.characterInfo.backStory} onChangeText={(backstory: string) => {
                                    const characterInfo = { ...this.state.characterInfo };
                                    characterInfo.backStory = backstory;
                                    this.setState({ characterInfo })
                                }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s backstory...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.updateInfo() }} />
                            </View>
                        </View>
                        :
                        <View style={styles.container}>
                            <View style={{ marginBottom: 50, padding: 15 }}>
                                <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>BackStory, Personality Trait, Flaws, Ideals and Bonds </AppText>
                                <AppText textAlign={"center"} fontSize={18}>In the next section you will need to write and pick Personality Trait, Flaws, Ideals and Bonds that define your character.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Feel free to consult with your DM in order to write a good background story that fits the world of the current adventure.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>From this point on your character has been saved and you can access it through the character hall.</AppText>
                            </View>
                            <View style={{ padding: 20 }}>
                                <AppText fontSize={25} textAlign={"center"} color={Colors.bitterSweetRed}>BackStory</AppText>
                                <AppText textAlign={"center"} fontSize={18}>We heavily recommend that you check online guide sites such as DNDBeyond for searching the background that suites you.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Remember that the background story is yours to make and you can consult your DM in order to create unique buffs/debuffs that will fit the world.</AppText>
                                <AppText textAlign={"center"} fontSize={18}>Your background might give you special items or the knowledge of multiple languages depending on the one of your choosing.</AppText>
                            </View>
                            <View style={{ paddingBottom: 15 }}>
                                <AppText textAlign={"center"} color={Colors.bitterSweetRed} fontSize={18}>The short backstory of {character.name}'s origins.</AppText>
                                <AppTextInput onChangeText={(backstory: string) => { this.setState({ backstory }) }} padding={10} textAlignVertical={"top"} placeholder={`${character.name}'s backstory...`} width={"95%"} multiline={true} numberOfLines={10} />
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                            </View>
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