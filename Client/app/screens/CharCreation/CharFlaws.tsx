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
    baseState: string
    characterInfo: CharacterModel
    confirmed: boolean
    updateFlaws: boolean
}

export class CharFlaws extends Component<{ route: any, navigation: any, updateFlaws: boolean }, CharFlawsState>{
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            baseState: null,
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
            characterInfo.flaws = characterInfo.flaws.filter(flaw => { return flaw !== undefined })
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
            characterInfo.flaws = characterInfo.flaws.filter(flaw => { return flaw !== undefined })
            this.setState({ confirmed: true })
            this.setState({ characterInfo }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                setTimeout(() => {
                    this.props.navigation.navigate("SelectCharacter", this.state.characterInfo);
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
                            {this.state.updateFlaws ?
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Update"} onPress={() => { this.updateFlaws() }} />
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