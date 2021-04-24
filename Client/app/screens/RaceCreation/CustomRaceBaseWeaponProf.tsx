import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Switch } from 'react-native-gesture-handler';
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

interface CustomRaceBaseWeaponProfState {
    customRace: RaceModel
    confirmed: boolean,
    activatedInterfaceBase: boolean
}
export class CustomRaceBaseWeaponProf extends Component<{ navigation: any }, CustomRaceBaseWeaponProfState>{
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
        const weaponProf = store.getState().customRace.baseWeaponProficiencies;
        if (this.state.confirmed) {
            this.setState({ confirmed: false })
        }
        if (weaponProf && weaponProf?.length > 0) {
            customRace.baseWeaponProficiencies = weaponProf
            this.setState({ customRace, activatedInterfaceBase: true })
        }
    }

    addWeapon = () => {
        const customRace = { ...this.state.customRace };
        if (customRace.baseWeaponProficiencies) {
            customRace.baseWeaponProficiencies.push('')
        }
        this.setState({ customRace })
    }

    removeWeapon = (index: number) => {
        const customRace = { ...this.state.customRace };
        if (customRace.baseWeaponProficiencies) {
            customRace.baseWeaponProficiencies.splice(index, 1);
        }
        this.setState({ customRace })
    }

    confirmAndContinue = () => {
        const customRace = { ...this.state.customRace };
        if (this.state.customRace.baseWeaponProficiencies)
            for (let item of this.state.customRace.baseWeaponProficiencies) {
                if (item === '') {
                    alert('Cannot leave a weapon field empty.')
                    return
                }
            }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            const storeItem = { ...store.getState().customRace };
            if (storeItem.baseWeaponProficiencies && this.state.customRace.baseWeaponProficiencies) {
                storeItem.baseWeaponProficiencies = this.state.customRace.baseWeaponProficiencies
            }
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceBaseArmorProf");
        }, 800);
    }

    removeFeatureSwitch = () => {
        const customRace = { ...this.state.customRace };
        customRace.baseWeaponProficiencies = []
        this.setState({ customRace })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ alignItems: "center", justifyContent: "center", padding: 20 }}>
                            <AppText textAlign={'center'} fontSize={25} padding={15}>Weapon Proficiencies</AppText>
                            <AppText textAlign={'center'} fontSize={18}>What Weapon Proficiencies does this race start with?</AppText>
                            <Switch value={this.state.activatedInterfaceBase} onValueChange={() => {
                                if (this.state.activatedInterfaceBase) {
                                    if (store.getState().customRaceEditing) {
                                        Alert.alert("Remove", "This will remove all selected items", [{
                                            text: 'Yes', onPress: () => {
                                                this.setState({ activatedInterfaceBase: false }, () => {
                                                    this.removeFeatureSwitch()
                                                })
                                            }
                                        }, { text: 'No' }])
                                        return
                                    }
                                    this.setState({ activatedInterfaceBase: false });
                                    return
                                }
                                this.setState({ activatedInterfaceBase: true })
                            }} />
                        </View>
                        {this.state.activatedInterfaceBase &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppButton padding={20} fontSize={20} backgroundColor={Colors.bitterSweetRed} width={180} height={50}
                                    borderRadius={25} title={'Add Weapon'} onPress={() => { this.addWeapon() }} />
                                {this.state.customRace.baseWeaponProficiencies?.map((item, index) => {
                                    return <View key={index} style={{ flexDirection: "row" }}>
                                        <AppTextInput
                                            width={Dimensions.get('window').width - 150}
                                            defaultValue={this.state.customRace.baseWeaponProficiencies ? this.state.customRace.baseWeaponProficiencies[index] : ''}
                                            onChangeText={(txt: string) => {
                                                const customRace = { ...this.state.customRace };
                                                if (customRace.baseWeaponProficiencies)
                                                    customRace.baseWeaponProficiencies[index] = txt.trim()
                                                this.setState({ customRace })
                                            }} placeholder={'Weapon Name...'} />
                                        <TouchableOpacity onPress={() => this.removeWeapon(index)} style={{ alignItems: "center" }}>
                                            <IconGen name={'trash-can'} size={50} iconColor={Colors.danger} />
                                        </TouchableOpacity>
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