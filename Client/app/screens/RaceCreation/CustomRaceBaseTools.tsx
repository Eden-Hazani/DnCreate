import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { AppText } from '../../components/AppText';
import toolsJson from '../../../jsonDump/toolList.json'
import { RaceModel } from '../../models/raceModel';
import { store } from '../../redux/store';
import { Colors } from '../../config/colors';
import { ActionType } from '../../redux/action-type';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';

interface CustomRaceBaseToolsState {
    customRace: RaceModel
    clickedTools: boolean[],
    pickedTools: string[],
    activatedInterface: boolean
    confirmed: boolean
}
export class CustomRaceBaseTools extends Component<{ navigation: any }, CustomRaceBaseToolsState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            clickedTools: [],
            pickedTools: [],
            activatedInterface: false,
            customRace: store.getState().customRace
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }
    componentWillUnmount() {
        this.navigationSubscription()
    }

    onFocus = () => {
        const pickedTools = store.getState().customRace.baseAddedTools;
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

    addTool = (item: string, index: number) => {
        const pickedTools = this.state.pickedTools;
        const clickedTools = this.state.clickedTools;
        if (!clickedTools[index]) {
            pickedTools.push(item)
            clickedTools[index] = true
            this.setState({ clickedTools, pickedTools })
            return;
        }
        if (clickedTools[index]) {
            const newPickedSkills = pickedTools.filter((existingItem, index) => existingItem !== item)
            clickedTools[index] = false
            this.setState({ clickedTools, pickedTools: newPickedSkills })
        }
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.activatedInterface && this.state.pickedTools.length === 0) {
            Alert.alert("No Tools picked", "you have picked 0 starting tools, if you don't wish to add starting tools toggle off the option ",
                [{
                    text: 'Ok', onPress: () => { return }
                }])
            return;
        }
        if (this.state.activatedInterface && customRace.baseAddedTools) {
            customRace.baseAddedTools = this.state.pickedTools
        }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            console.log(storeItem)
            if (!storeItem.baseAddedTools) {
                storeItem.baseAddedTools = []
            }
            storeItem.baseAddedTools = this.state.customRace.baseAddedTools
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceChoiceSkills");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Permanent Tools</AppText>
                            <AppText fontSize={20} padding={15} textAlign={'center'}>Does this race offer any tools without user choice?</AppText>
                            <AppText fontSize={20} padding={5} textAlign={'center'}>These tools are applied instantly on character creation</AppText>
                            <Switch value={this.state.activatedInterface} onValueChange={() => {
                                if (this.state.activatedInterface) {
                                    this.setState({ activatedInterface: false })
                                    return;
                                }
                                this.setState({ activatedInterface: true })
                            }} />
                        </View>
                        {this.state.activatedInterface &&
                            <View style={{ flexWrap: 'wrap', flexDirection: "row" }}>
                                {toolsJson.tools.map((item, index) => {
                                    return <TouchableOpacity key={index}
                                        onPress={() => { this.addTool(item, index) }}
                                        style={[styles.item, {
                                            backgroundColor: this.state.clickedTools[index]
                                                ? Colors.bitterSweetRed : Colors.lightGray
                                        }]}>
                                        <AppText>{item}</AppText>
                                    </TouchableOpacity>
                                })}
                            </View>
                        }
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