import React, { Component } from 'react';
import { View, StyleSheet, Switch, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../../components/AppText';
import skillsJson from '../../../jsonDump/skillList.json'
import { store } from '../../redux/store';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { Colors } from '../../config/colors';
import NumberScroll from '../../components/NumberScroll';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppButton } from '../../components/AppButton';


interface CustomRaceChoiceSkillsState {
    activatedInterface: boolean
    pickedSkills: any[],
    clickedSkills: boolean[],
    customRace: RaceModel,
    confirmed: boolean,
    amountToPick: number
}
export class CustomRaceChoiceSkills extends Component<{ navigation: any }, CustomRaceChoiceSkillsState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            customRace: store.getState().customRace,
            pickedSkills: [],
            clickedSkills: [],
            activatedInterface: false,
            amountToPick: 0
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }

    onFocus = () => {
        const pickedSkills = store.getState().customRace.skillPickChoice?.skillList;
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
        if (this.state.pickedSkills.length < this.state.amountToPick) {
            alert("Amount to pick from cannot be higher then the skill list itself.");
            return
        }
        if (this.state.activatedInterface && this.state.pickedSkills.length === 0) {
            Alert.alert("No skills picked", "you have picked 0 skills to choose from, if you don't wish to add starting skills toggle off the option",
                [{
                    text: 'Ok', onPress: () => { return }
                }])
            return
        }
        if (this.state.activatedInterface && customRace.skillPickChoice) {
            customRace.skillPickChoice.skillList = this.state.pickedSkills
            customRace.skillPickChoice.amountToPick = this.state.amountToPick
        }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.skillPickChoice && this.state.customRace.skillPickChoice) {
                storeItem.skillPickChoice.skillList = this.state.customRace.skillPickChoice.skillList
                storeItem.skillPickChoice.amountToPick = this.state.customRace.skillPickChoice.amountToPick
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceChoiceTools");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    removeFeatureSwitch = () => {
        this.setState({ pickedSkills: [], amountToPick: 0 }, () => {
            const customRace = { ...this.state.customRace };
            if (customRace.skillPickChoice) {
                customRace.skillPickChoice.skillList = this.state.pickedSkills
                customRace.skillPickChoice.amountToPick = this.state.amountToPick
            }
            this.setState({ customRace })
        })
    }


    render() {
        const storeItem = store.getState().customRace.skillPickChoice?.amountToPick || 0;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Choice Skills</AppText>
                            <AppText fontSize={20} padding={15} textAlign={'center'}>Does this race offer any skills that the user can choose?</AppText>
                            <AppText fontSize={20} padding={5} textAlign={'center'}>These skills will be shown to the player on character pick, and he will be able to pick from them until he reaches the cap you provide below.</AppText>
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
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
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
                                <AppText fontSize={18} textAlign={'center'} padding={15}>Amount of available picks from the list </AppText>
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, borderWidth: 1, borderRadius: 15 }}>
                                    <NumberScroll modelColor={Colors.pageBackground}
                                        startingVal={storeItem}
                                        max={skillsJson.skillList.length}
                                        getValue={(amount: number) => {
                                            this.setState({ amountToPick: amount })
                                        }} />
                                </View>
                            </View>}
                        <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                            borderRadius={25} title={'Continue'} onPress={() => { this.confirmAndContinue() }} />
                    </View>}
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