import React, { Component } from 'react';
import { View, StyleSheet, Switch, ScrollView } from 'react-native';
import { boolean } from 'yup';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface RaceAttributeBonusState {
    customRace: RaceModel
    activatedInterface: boolean
    confirmed: boolean
    bonusAmount: number
}

export class RaceAttributeBonus extends Component<{ navigation: any }, RaceAttributeBonusState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            customRace: store.getState().customRace,
            activatedInterface: false,
            confirmed: false,
            bonusAmount: 0,
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentWillUnmount() {
        this.navigationSubscription()
    }
    onFocus = () => {
        const chooseAttPoints = store.getState().customRace.changeBaseAttributePoints?.changePoints;
        if (chooseAttPoints) {
            this.setState({ activatedInterface: true })
        }
    }
    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        const abilityList = ["strength", "constitution", "dexterity", "intelligence", "wisdom", "charisma"]
        if (this.state.activatedInterface) {
            customRace.changeBaseAttributePoints!.changePoints = true;
            customRace.changeBaseAttributePoints!.amount = this.state.bonusAmount;
        }

        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.changeBaseAttributePoints && !storeItem.changeBaseAttributePoints?.amount) {
                storeItem.changeBaseAttributePoints.amount = 0
                storeItem.changeBaseAttributePoints.changePoints = false
            }
            if (storeItem.changeBaseAttributePoints && this.state.customRace.changeBaseAttributePoints) {
                storeItem.changeBaseAttributePoints.amount = this.state.customRace.changeBaseAttributePoints.amount
                storeItem.changeBaseAttributePoints.changePoints = this.state.customRace.changeBaseAttributePoints.changePoints
            }
            if (storeItem.abilityBonus && this.state.customRace.abilityBonus) {
                for (let item of abilityList) {
                    storeItem.abilityBonus[item] = this.state.customRace.abilityBonus[item]
                }
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceAbilities");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    render() {
        const storeItem = store.getState().customRace.abilityBonus || 0;
        const choiceAttStore = store.getState().customRace.changeBaseAttributePoints?.amount || 0;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <AppText padding={15} textAlign={'center'} fontSize={20} color={Colors.berries}>What are the base attribute bonuses of this race?</AppText>
                        <AppText textAlign={'center'} padding={5} fontSize={16}>Each race has a starting base attribute point bonus, Use the sliders below to state the racial bonuses for your race.</AppText>
                        {this.state.customRace.abilityBonus && Object.entries(this.state.customRace.abilityBonus).map((item, index) => {
                            return <View key={index} style={{
                                justifyContent: "center", alignItems: "center", marginTop: 20
                            }}>
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, borderWidth: 1, borderRadius: 15, }}>
                                    <AppText textAlign={'center'} fontSize={18} color={Colors.bitterSweetRed}>{item[0]} bonus</AppText>
                                    <NumberScroll
                                        startingVal={storeItem[item[0]]}
                                        startFromZero={true}
                                        max={10}
                                        getValue={(amount: number) => {
                                            let customRace = { ...this.state.customRace };
                                            if (customRace.abilityBonus) {
                                                customRace.abilityBonus[item[0]] = amount
                                                this.setState({ customRace })
                                            }
                                        }
                                        } />
                                </View>
                            </View>
                        })}

                        <View style={{ justifyContent: 'center', alignItems: "center", paddingBottom: 50 }}>
                            <AppText textAlign={'center'} padding={15} fontSize={20} color={Colors.bitterSweetRed}>Does this race have the option to add attribute points by choice?</AppText>
                            <AppText textAlign={'center'} padding={5} fontSize={16}>This means that the player has a choice while creating a character to add points to different attributes until he reaches the cap you specify below.</AppText>

                            <Switch value={this.state.activatedInterface} onValueChange={() => {
                                if (this.state.activatedInterface) {
                                    this.setState({ activatedInterface: false })
                                    return;
                                }
                                this.setState({ activatedInterface: true })
                            }} />
                            {this.state.activatedInterface ?
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, borderWidth: 1, borderRadius: 15, }}>
                                    <NumberScroll max={10}
                                        startingVal={choiceAttStore}
                                        getValue={(bonusAmount: number) => {
                                            this.setState({ bonusAmount })
                                        }} />
                                </View>
                                : null}
                        </View>
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
        paddingBottom: 150
    }
});