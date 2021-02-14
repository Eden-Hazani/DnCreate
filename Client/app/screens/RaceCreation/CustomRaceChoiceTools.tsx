import React, { Component } from 'react';
import { View, StyleSheet, Switch, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../../components/AppText';
import toolsJson from '../../../jsonDump/toolList.json'
import { store } from '../../redux/store';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { Colors } from '../../config/colors';
import NumberScroll from '../../components/NumberScroll';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppButton } from '../../components/AppButton';


interface CustomRaceChoiceToolsState {
    activatedInterface: boolean
    pickedTools: any[],
    clickedTools: boolean[],
    customRace: RaceModel,
    confirmed: boolean,
    amountToPick: number
}
export class CustomRaceChoiceTools extends Component<{ navigation: any }, CustomRaceChoiceToolsState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            customRace: store.getState().customRace,
            pickedTools: [],
            clickedTools: [],
            activatedInterface: false,
            amountToPick: 0
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const pickedTools = store.getState().customRace.toolProficiencyPick?.toolList;
        let clickedTools: any[] = []
        if (pickedTools && pickedTools?.length > 0) {
            for (let item of pickedTools) {
                toolsJson.tools?.forEach((pickedTool, index) => {
                    if (item === pickedTool) {
                        clickedTools[index] = true
                    }
                })
            }
        }
        if (pickedTools && pickedTools?.length > 0) {
            this.setState({ pickedTools, clickedTools, activatedInterface: true })
        }
    }

    addSkill = (item: string, index: number) => {
        const pickedTools = this.state.pickedTools;
        const clickedTools = this.state.clickedTools;
        if (!clickedTools[index]) {
            pickedTools.push(item)
            clickedTools[index] = true
            this.setState({ clickedTools, pickedTools })
            return;
        }
        if (clickedTools[index]) {
            const newPickedTools = pickedTools.filter((existingItem, index) => existingItem !== item)
            clickedTools[index] = false
            this.setState({ clickedTools, pickedTools: newPickedTools })
        }
    }
    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.pickedTools.length < this.state.amountToPick) {
            alert("Amount to pick from cannot be higher then the skill list itself.");
            return
        }
        if (this.state.activatedInterface && this.state.pickedTools.length === 0) {
            Alert.alert("No tools picked", "you have picked 0 tools to choose from, if you don't wish to add starting tools toggle off the option",
                [{
                    text: 'Ok', onPress: () => { return }
                }])
            return
        }
        if (this.state.activatedInterface && customRace.toolProficiencyPick) {
            customRace.toolProficiencyPick.toolList = this.state.pickedTools
            customRace.toolProficiencyPick.amountToPick = this.state.amountToPick
        }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.toolProficiencyPick && this.state.customRace.toolProficiencyPick) {
                storeItem.toolProficiencyPick.toolList = this.state.customRace.toolProficiencyPick.toolList
                storeItem.toolProficiencyPick.amountToPick = this.state.customRace.toolProficiencyPick.amountToPick
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceSpellPicking");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    render() {
        const storeItem = store.getState().customRace.toolProficiencyPick?.amountToPick || 0;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Choice Tools</AppText>
                            <AppText fontSize={20} padding={15} textAlign={'center'}>Does this race offer any tool proficiencies that the user can choose from?</AppText>
                            <AppText fontSize={20} padding={5} textAlign={'center'}>These tools will be shown to the player on character pick, and he will be able to pick from them until he reaches the cap you provide below.</AppText>
                            <Switch value={this.state.activatedInterface} onValueChange={() => {
                                if (this.state.activatedInterface) {
                                    this.setState({ activatedInterface: false })
                                    return;
                                }
                                this.setState({ activatedInterface: true })
                            }} />
                        </View>
                        {this.state.activatedInterface &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                                    {toolsJson.tools.map((item, index) => {
                                        return <TouchableOpacity key={index}
                                            onPress={() => { this.addSkill(item, index) }}
                                            style={[styles.item, {
                                                backgroundColor: this.state.clickedTools[index]
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
                                        max={toolsJson.tools.length}
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