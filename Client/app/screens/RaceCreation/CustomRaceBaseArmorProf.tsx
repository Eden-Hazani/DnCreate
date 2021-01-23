import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppTextInput } from '../../components/forms/AppTextInput';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface CustomRaceBaseArmorProfState {
    customRace: RaceModel
    confirmed: boolean,
    activatedInterfaceBase: boolean
}
export class CustomRaceBaseArmorProf extends Component<{ navigation: any }, CustomRaceBaseArmorProfState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            activatedInterfaceBase: false,
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
        const armorProf = store.getState().customRace.baseArmorProficiencies;
        if (armorProf && armorProf?.length > 0) {
            customRace.baseArmorProficiencies = armorProf
            this.setState({ customRace, activatedInterfaceBase: true })
        }
    }

    addWeapon = () => {
        const customRace = { ...this.state.customRace };
        if (customRace.baseArmorProficiencies) {
            customRace.baseArmorProficiencies.push('')
        }
        this.setState({ customRace })
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.customRace.baseArmorProficiencies)
            for (let item of this.state.customRace.baseArmorProficiencies) {
                if (item === '') {
                    alert('Cannot leave an armor field empty.')
                    return
                }
            }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.baseArmorProficiencies && this.state.customRace.baseArmorProficiencies) {
                storeItem.baseArmorProficiencies = this.state.customRace.baseArmorProficiencies
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBonusAC");
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
                        <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Armor Proficiencies</AppText>
                            <AppText textAlign={'center'} fontSize={18}>What Armor Proficiencies does this race start with?</AppText>
                            <Switch value={this.state.activatedInterfaceBase} onValueChange={() => {
                                if (this.state.activatedInterfaceBase) {
                                    this.setState({ activatedInterfaceBase: false })
                                    return;
                                }
                                this.setState({ activatedInterfaceBase: true })
                            }} />
                        </View>
                        {this.state.activatedInterfaceBase &&
                            <View>
                                <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                    borderRadius={25} title={'Add Armor'} onPress={() => { this.addWeapon() }} />
                                {this.state.customRace.baseArmorProficiencies?.map((item, index) => {
                                    return <View key={index}>
                                        <AppTextInput
                                            defaultValue={this.state.customRace.baseArmorProficiencies ? this.state.customRace.baseArmorProficiencies[index] : ''}
                                            onChangeText={(txt: string) => {
                                                const customRace = { ...this.state.customRace };
                                                if (customRace.baseArmorProficiencies)
                                                    customRace.baseArmorProficiencies[index] = txt.trim()
                                                this.setState({ customRace })
                                            }} placeholder={'Armor Name...'} />
                                    </View>
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

    }
});