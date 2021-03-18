import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { AppText } from '../../components/AppText';
import skillsJson from '../../../jsonDump/skillList.json'
import { RaceModel } from '../../models/raceModel';
import { store } from '../../redux/store';
import { Colors } from '../../config/colors';
import { ActionType } from '../../redux/action-type';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';

interface CustomRaceBaseSkillsState {
    customRace: RaceModel
    clickedSkills: boolean[],
    pickedSkills: string[],
    activatedInterface: boolean
    confirmed: boolean
}
export class CustomRaceBaseSkills extends Component<{ navigation: any }, CustomRaceBaseSkillsState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            clickedSkills: [],
            pickedSkills: [],
            activatedInterface: false,
            customRace: store.getState().customRace
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const pickedSkills = store.getState().customRace.baseAddedSkills;
        let clickedSkills: any[] = []
        if (pickedSkills && pickedSkills?.length > 0) {
            for (let item of pickedSkills) {
                skillsJson.skillList?.forEach((pickedSkill, index) => {
                    if (item === pickedSkill) {
                        clickedSkills[index] = true
                    }
                })
            }
        }
        if (pickedSkills && pickedSkills?.length > 0) {
            this.setState({ pickedSkills, clickedSkills, activatedInterface: true })
        }
    }

    addSkill = (item: string, index: number) => {
        const pickedSkills = this.state.pickedSkills;
        const clickedSkills = this.state.clickedSkills;
        if (!clickedSkills[index]) {
            pickedSkills.push(item)
            clickedSkills[index] = true
            this.setState({ clickedSkills, pickedSkills })
            return;
        }
        if (clickedSkills[index]) {
            const newPickedSkills = pickedSkills.filter((existingItem, index) => existingItem !== item)
            clickedSkills[index] = false
            this.setState({ clickedSkills, pickedSkills: newPickedSkills })
        }
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.activatedInterface && this.state.pickedSkills.length === 0) {
            Alert.alert("No skills picked", "you have picked 0 starting skills, if you don't wish to add starting skills toggle off the option ",
                [{
                    text: 'Ok', onPress: () => { return }
                }])
            return;
        }
        if (this.state.activatedInterface && customRace.baseAddedSkills) {
            customRace.baseAddedSkills = this.state.pickedSkills
        }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (!storeItem.baseAddedSkills) {
                storeItem.baseAddedSkills = []
            }
            storeItem.baseAddedSkills = this.state.customRace.baseAddedSkills
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBaseTools");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    removeFeatureSwitch = () => {
        this.setState({ clickedSkills: [], pickedSkills: [] }, () => {
            const customRace = { ...this.state.customRace };
            if (customRace.baseAddedSkills) {
                customRace.baseAddedSkills = this.state.pickedSkills
            }
            this.setState({ customRace })
        })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Permanent Skills</AppText>
                            <AppText fontSize={20} padding={15} textAlign={'center'}>Does this race offer any skills without user choice?</AppText>
                            <AppText fontSize={20} padding={5} textAlign={'center'}>These skills are applied instantly on character creation</AppText>
                            <Switch value={this.state.activatedInterface} onValueChange={() => {
                                if (this.state.activatedInterface) {
                                    if (store.getState().customRaceEditing) {
                                        Alert.alert("Remove", "This will remove all selected items", [{
                                            text: 'Yes', onPress: () => {
                                                this.setState({ activatedInterface: false }, () => {
                                                    this.removeFeatureSwitch()
                                                })
                                            }
                                        }, { text: 'No' }])
                                        return
                                    }
                                    this.setState({ activatedInterface: false })
                                    return;
                                }
                                this.setState({ activatedInterface: true })
                            }} />
                        </View>
                        {this.state.activatedInterface &&
                            <View style={{ flexWrap: 'wrap', flexDirection: "row" }}>
                                {skillsJson.skillList.map((item, index) => {
                                    return <TouchableOpacity key={index}
                                        onPress={() => { this.addSkill(item, index) }}
                                        style={[styles.item, {
                                            backgroundColor: this.state.clickedSkills[index]
                                                ? Colors.bitterSweetRed : Colors.lightGray
                                        }]}>
                                        <AppText>{item}</AppText>
                                    </TouchableOpacity>
                                })}
                            </View>
                        }
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});