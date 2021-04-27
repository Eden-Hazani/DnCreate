import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { updateMarketStatusFromPreviousLevels } from '../../../utility/charHallFunctions/characterStorage';
import logger from '../../../utility/logger';
import marketApi from '../../api/marketApi';
import userCharApi from '../../api/userCharApi';
import { Colors } from '../../config/colors';
import useAuthContext from '../../hooks/useAuthContext';
import { WeaponModal } from '../../models/WeaponModal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { AppActivityIndicator } from '../AppActivityIndicator';
import { AppText } from '../AppText';

interface Props {
    weapon: WeaponModal;
    char_id: string;
    refreshWeapons: Function
}

export function RemoveWeaponFromMarket({ weapon, char_id, refreshWeapons }: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const userContext = useAuthContext()
    const handleClick = () => {
        Alert.alert("Remove from Market", "This character will be removed from the market, you can always readd it later",
            [{ text: 'Yes', onPress: () => removeFromMarket() }, { text: 'No' }])
    }

    const removeFromMarket = async () => {
        try {
            setLoading(true)
            const result = await marketApi.deleteFromMarket(weapon.marketStatus?.market_id || '', 'weapon');
            if (result.status === 204) {
                const updatedWeapon = { ...weapon };
                delete updatedWeapon.marketStatus;
                await saveWeapon(updatedWeapon)
                refreshWeapons(updatedWeapon)
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
    }

    const saveWeapon = async (weapon: WeaponModal) => {
        let weaponList = await AsyncStorage.getItem(`${char_id}WeaponList`);
        if (!weaponList) {
            return;
        }
        const newWeaponList = JSON.parse(weaponList)
        let index: number = 0
        for (let item of newWeaponList) {
            if (item._id === weapon._id) {
                newWeaponList[index] = weapon
            }
            index++
        }
        await AsyncStorage.setItem(`${char_id}WeaponList`, JSON.stringify(newWeaponList))
    }

    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} />
                :
                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40 }}>
                    <AppText fontSize={17} textAlign={'center'}>Your weapon is available for download through the public market.</AppText>
                    <AppText fontSize={17} textAlign={'center'}>If you wish you can remove it from from the public.</AppText>
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors.danger }]} onPress={() => handleClick()}>
                        <AppText fontSize={20} textAlign={'center'}>Remove from the market</AppText>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    addButton: {
        marginTop: 15,
        width: 300,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    }
});