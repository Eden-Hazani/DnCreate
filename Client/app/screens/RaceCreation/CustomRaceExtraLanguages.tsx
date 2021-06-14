import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import { Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

import { PickLanguage } from '../../components/PickLanguage'

interface CustomRaceExtraLanguagesState {
    customRace: RaceModel
    confirmed: boolean,
    activatedInterfaceBaseLanguages: boolean
    activatedInterfaceExtraLanguages: boolean
}
export class CustomRaceExtraLanguages extends Component<{ navigation: any }, CustomRaceExtraLanguagesState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            activatedInterfaceBaseLanguages: false,
            activatedInterfaceExtraLanguages: false,
            confirmed: false,
            customRace: store.getState().customRace,
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const customRace = { ...this.state.customRace };
        const languages = store.getState().customRace.languages;
        const extraLanguages = store.getState().customRace.extraLanguages;
        if (this.state.confirmed) {
            this.setState({ confirmed: false })
        }
        if (languages && languages?.length > 0) {
            customRace.languages = languages
            this.setState({ customRace, activatedInterfaceBaseLanguages: true })
        }
        if (extraLanguages) {
            customRace.extraLanguages = extraLanguages
            this.setState({ customRace, activatedInterfaceExtraLanguages: true })
        }
    }

    addLanguage = () => {
        const customRace = { ...this.state.customRace };
        if (customRace.languages) {
            customRace.languages.push('')
        }
        this.setState({ customRace })
    }

    removeLanguage = (index: number) => {
        const customRace = { ...this.state.customRace };
        if (customRace.languages) {
            customRace.languages.splice(index, 1);
        }
        this.setState({ customRace })
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.customRace.languages)
            for (let item of this.state.customRace.languages) {
                if (item === '') {
                    alert('Cannot leave a language field empty.')
                    return
                }
            }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.languages && this.state.customRace.languages) {
                storeItem.languages = this.state.customRace.languages
            }
            storeItem.extraLanguages = this.state.customRace.extraLanguages
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBaseWeaponProf");
        }, 800);
    }

    removeFeatureSwitch = () => {
        const customRace = { ...this.state.customRace };
        customRace.languages = []
        this.setState({ customRace })
    }

    removeFeatureSwitchExtraLanguages = () => {
        const customRace = { ...this.state.customRace };
        customRace.extraLanguages = 0
        this.setState({ customRace })
    }

    render() {
        const storeItem = store.getState().customRace.extraLanguages || 0;
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <>
                        <View>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Languages</AppText>
                            <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
                                <AppText textAlign={'center'} fontSize={18}>What languages does this race start with?</AppText>
                                <AppText textAlign={'center'} fontSize={18}>Important! Common is not set by default, if you wish to add common you need to write it with the rest of the languages below.</AppText>
                                <Switch value={this.state.activatedInterfaceBaseLanguages} onValueChange={() => {
                                    if (this.state.activatedInterfaceBaseLanguages) {
                                        if (store.getState().customRaceEditing) {
                                            Alert.alert("Remove", "This will remove all selected items", [{
                                                text: 'Yes', onPress: () => {
                                                    this.setState({ activatedInterfaceBaseLanguages: false }, () => {
                                                        this.removeFeatureSwitch()
                                                    })
                                                }
                                            }, { text: 'No' }])
                                            return
                                        }
                                        this.setState({ activatedInterfaceBaseLanguages: false });
                                        return
                                    }
                                    this.setState({ activatedInterfaceBaseLanguages: true })
                                }} />
                            </View>
                            {this.state.activatedInterfaceBaseLanguages &&
                                <View>
                                    <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                        borderRadius={25} title={'Add Language'} onPress={() => { this.addLanguage() }} />
                                    {this.state.customRace.languages?.map((item, index) => {
                                        return <View key={index} style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                            <PickLanguage
                                                width={'100%'}
                                                resetLanguage={undefined}
                                                passLanguage={(language: string) => {
                                                    const customRace = { ...this.state.customRace };
                                                    if (customRace.languages)
                                                        customRace.languages[index] = language.trim()
                                                    this.setState({ customRace })
                                                }}
                                                defaultValue={this.state.customRace.languages ? this.state.customRace.languages[index] : ''} />
                                            <TouchableOpacity onPress={() => this.removeLanguage(index)}>
                                                <IconGen size={50} name={'trash-can'} iconColor={Colors.danger} />
                                            </TouchableOpacity>
                                        </View>
                                    })}
                                </View>
                            }
                        </View>
                        <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
                            <AppText textAlign={'center'} fontSize={18}>Does this race allow the player to pick any language he wants?</AppText>
                            <AppText textAlign={'center'} fontSize={18}>If so, how many languages can the player pick?</AppText>
                            <Switch value={this.state.activatedInterfaceExtraLanguages} onValueChange={() => {
                                if (this.state.activatedInterfaceExtraLanguages) {
                                    if (store.getState().customRaceEditing) {
                                        Alert.alert("Remove", "This will remove all selected items", [{
                                            text: 'Yes', onPress: () => {
                                                this.setState({ activatedInterfaceExtraLanguages: false }, () => {
                                                    this.removeFeatureSwitchExtraLanguages()
                                                })
                                            }
                                        }, { text: 'No' }])
                                        return
                                    }
                                    this.setState({ activatedInterfaceExtraLanguages: false });
                                    return
                                }
                                this.setState({ activatedInterfaceExtraLanguages: true })
                            }} />
                        </View>
                        {this.state.activatedInterfaceExtraLanguages &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, borderWidth: 1, borderRadius: 15, }}>
                                    <AppText textAlign={'center'}>Extra Languages amount</AppText>
                                    <NumberScroll modelColor={Colors.pageBackground}
                                        startingVal={storeItem}
                                        max={50} getValue={(amount: number) => {
                                            const customRace = { ...this.state.customRace };
                                            customRace.extraLanguages = amount;
                                            this.setState({ customRace })
                                        }} />
                                </View>
                            </View>
                        }
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                    </>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});