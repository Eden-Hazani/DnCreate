import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Unsubscribe } from 'redux';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CharPersonalityTraitsState {
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateTraits: boolean
}

export class CharPersonalityTraits extends Component<{ route: any, navigation: any, updateTraits: boolean }, CharPersonalityTraitsState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            baseState: null,
            updateTraits: this.props.route.params.updateTraits,
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
        if (trait.trim() === "") {
            characterInfo.personalityTraits.splice(index, 1)
        }
        this.setState({ characterInfo }, () => {
        });
    }

    insertInfoAndContinue = () => {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        const characterInfo = { ...this.state.characterInfo };
        if (!this.state.characterInfo.personalityTraits || this.state.characterInfo.personalityTraits.length === 0) {
            Alert.alert("No Traits", "Are you sure you want to continue without any Traits?", [{
                text: 'Yes', onPress: () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    this.props.navigation.navigate("CharIdeals", { updateIdeals: false })
                }
            }, { text: 'No' }])
        } else {
            characterInfo.personalityTraits = characterInfo.personalityTraits.filter(trait => { return trait !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("CharIdeals", { updateIdeals: false })
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
        }
    }
    componentDidMount() {
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
        })
        if (this.props.route.params.updateTraits) {
            this.setState({ characterInfo: this.props.route.params.character }, () => {
                this.setState({ baseState: JSON.stringify(this.state.characterInfo) })
            })
        }
        const characterInfo = { ...this.state.characterInfo };
        if (!characterInfo.personalityTraits) {
            characterInfo.personalityTraits = [];
        }
        this.setState({ characterInfo })
    }

    updateTraits = () => {
        const characterInfo = { ...this.state.characterInfo };
        this.props.navigation.addListener('beforeRemove', (e: any) => {
            this.props.navigation.dispatch(e.data.action)
        })
        if (!this.state.characterInfo.personalityTraits || this.state.characterInfo.personalityTraits.length === 0) {
            Alert.alert("No Traits", "Are you sure you want to continue without any Traits?", [{
                text: 'Yes', onPress: () => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo)
                }
            }, { text: 'No' }])
        } else {
            characterInfo.personalityTraits = characterInfo.personalityTraits.filter(trait => { return trait !== undefined });
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                userCharApi.updateChar(this.state.characterInfo);
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
        const traits = this.state.characterInfo.personalityTraits;
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={styles.textContainer}>
                            <AppText color={Colors.bitterSweetRed} fontSize={25} textAlign={"center"}>Personality Traits</AppText>
                            <AppText fontSize={18} textAlign={"center"}>Here you can write up to six of your characters personality traits, (the recommended number is two) </AppText>
                        </View>
                        <AppTextInput value={traits ? traits[0] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 0) }} padding={10} placeholder={"I idolize a particular hero of my faith and constantly refer to that person's deeds and example..."} width={"80%"} />
                        <AppTextInput value={traits ? traits[1] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 1) }} padding={10} placeholder={'Nothing can shake my optimistic attitude....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[2] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 2) }} padding={10} placeholder={'Flattery is my preferred trick for getting what I want....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[3] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 3) }} padding={10} placeholder={'I pocket anything I see that might have some value...'} width={"80%"} />
                        <AppTextInput value={traits ? traits[4] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 4) }} padding={10} placeholder={'I blow up at the slightest insult....'} width={"80%"} />
                        <AppTextInput value={traits ? traits[5] : ''} onChangeText={(trait: string) => { this.addTrait(trait, 5) }} padding={10} placeholder={'My favor, once lost, is lost forever....'} width={"80%"} />
                        <View style={{ paddingBottom: 25 }}>
                            {this.state.updateTraits ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateTraits() }} />
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