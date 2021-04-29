import React, { Component } from 'react';
import { View, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Switch, TouchableOpacity } from 'react-native-gesture-handler';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { IconGen } from '../../components/IconGen';
import { Colors } from '../../config/colors';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CustomRaceAbilitiesState {
    customRace: RaceModel
    modalTruthList: boolean[]
    confirmed: boolean
}

export class CustomRaceAbilities extends Component<{ navigation: any }, CustomRaceAbilitiesState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            modalTruthList: [],
            customRace: store.getState().customRace
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);

    }

    onFocus = () => {
        this.setState({ confirmed: false })
    }

    addFeature = () => {
        const customRace = { ...this.state.customRace };
        if (customRace.raceAbilities?.uniqueAbilities)
            customRace.raceAbilities?.uniqueAbilities.push({
                name: '',
                description: ''
            })
        let modalTruthList = this.state.modalTruthList;
        modalTruthList.push(false)
        this.setState({ customRace, modalTruthList })
    }

    removeFeature = (index: number) => {
        const customRace = { ...this.state.customRace };
        if (customRace.raceAbilities?.uniqueAbilities)
            customRace.raceAbilities?.uniqueAbilities.splice(index, 1)
        let modalTruthList = this.state.modalTruthList;
        modalTruthList.splice(index, 1)
        this.setState({ customRace, modalTruthList })
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.raceAbilities && !storeItem.raceAbilities?.uniqueAbilities) {
                storeItem.raceAbilities.uniqueAbilities = []
            }
            if (storeItem.raceAbilities?.uniqueAbilities) {
                storeItem.raceAbilities.uniqueAbilities = this.state.customRace.raceAbilities?.uniqueAbilities
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBaseSkills");
        }, 800);
    }

    render() {
        const storeState = store.getState().customRace.raceAbilities;
        let defaultVal: any = storeState ? store.getState().customRace.raceAbilities?.uniqueAbilities : []
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <AppText textAlign={'center'} fontSize={25} padding={15}>Racial Features</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={10}>Here you can add any features or abilities your race offers, these abilities will be shown in your character sheet. {'\n'} There is no feature limit, add as many as you want.</AppText>
                        <AppText textAlign={'center'} fontSize={18} padding={10}>If a feature adds a spell or a proficiency you will be able to pick them at the next stages so don't worry</AppText>
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Add Feature'} onPress={() => { this.addFeature() }} />
                        <View>
                            {this.state.customRace.raceAbilities && this.state.customRace.raceAbilities.uniqueAbilities && this.state.customRace.raceAbilities?.uniqueAbilities.map((item, index) => {
                                return <View key={index} style={{ borderRadius: 15, borderColor: Colors.whiteInDarkMode, borderWidth: 1, margin: 10, padding: 15 }}>
                                    <AppText textAlign={'center'} color={Colors.berries}>Feature {index + 1}</AppText>
                                    <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                        borderRadius={25} title={'Set Feature'} onPress={() => {
                                            let modalTruthList = this.state.modalTruthList;
                                            modalTruthList[index] = true
                                            this.setState({ modalTruthList })
                                        }} />
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        {this.state.customRace.raceAbilities?.uniqueAbilities &&
                                            this.state.customRace.raceAbilities?.uniqueAbilities[index].name !== '' && <AppText textAlign={'center'}>{this.state.customRace.raceAbilities?.uniqueAbilities[index].name}</AppText>}

                                        {this.state.customRace.raceAbilities?.uniqueAbilities && this.state.customRace.raceAbilities?.uniqueAbilities[index].description !== '' && <AppText textAlign={'center'}>
                                            {this.state.customRace.raceAbilities?.uniqueAbilities[index].description}</AppText>}
                                    </View>
                                    <TouchableOpacity onPress={() => this.removeFeature(index)} style={{ alignItems: "center" }}>
                                        <IconGen name={'trash-can'} size={50} iconColor={Colors.danger} />
                                    </TouchableOpacity>
                                    <Modal visible={this.state.modalTruthList[index] === true} animationType='slide'>
                                        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                            <AppTextInput placeholder={"Feature Name"}
                                                defaultValue={defaultVal[index].name}
                                                onChangeText={(name: string) => {
                                                    const customRace = { ...this.state.customRace };
                                                    if (customRace.raceAbilities?.uniqueAbilities) {
                                                        customRace.raceAbilities.uniqueAbilities[index].name = name
                                                        this.setState({ customRace })
                                                    }
                                                }} />
                                            <AppTextInput
                                                placeholder={"Feature Description"}
                                                defaultValue={defaultVal[index].description}
                                                onChangeText={(description: string) => {
                                                    const customRace = { ...this.state.customRace };
                                                    if (customRace.raceAbilities?.uniqueAbilities) {
                                                        customRace.raceAbilities.uniqueAbilities[index].description = description
                                                        this.setState({ customRace })
                                                    }
                                                }}
                                                numberOfLines={7} textAlignVertical={"top"} multiline={true} />
                                            <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed}
                                                width={180} height={50}
                                                borderRadius={25} title={'Done'} onPress={() => {
                                                    let modalTruthList = this.state.modalTruthList;
                                                    modalTruthList[index] = false
                                                    this.setState({ modalTruthList })
                                                }} />
                                        </ScrollView>
                                    </Modal>
                                </View>
                            })}
                            <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                        </View>
                    </View>}
            </ScrollView>

        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});