import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { updateMarketStatusFromPreviousLevels } from '../../../utility/charHallFunctions/characterStorage';
import logger from '../../../utility/logger';
import marketApi from '../../api/marketApi';
import userCharApi from '../../api/userCharApi';
import { Colors } from '../../config/colors';
import useAuthContext from '../../hooks/useAuthContext';
import { CustomSpellModal } from '../../models/CustomSpellModal';
import { WeaponModal } from '../../models/WeaponModal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { AppActivityIndicator } from '../AppActivityIndicator';
import { AppText } from '../AppText';

interface Props {
    spell: CustomSpellModal;
    refreshSpells: Function
}

export function RemoveSpellFromMarket({ spell, refreshSpells }: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const userContext = useAuthContext()
    const handleClick = () => {
        Alert.alert("Remove from Market", "This spell will be removed from the market, you can always add it again later",
            [{ text: 'Yes', onPress: () => removeFromMarket() }, { text: 'No' }])
    }

    const removeFromMarket = async () => {
        try {
            setLoading(true)
            const result = await marketApi.deleteFromMarket(spell.marketStatus?.market_id || '', 'spell');
            if (result.status === 204) {
                const updatedSpell = { ...spell };
                delete spell.marketStatus;
                await saveSpell(spell)
                refreshSpells(spell)
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
    }

    const saveSpell = async (spell: CustomSpellModal) => {
        const stringedCustomSpells = await AsyncStorage.getItem('customSpellList');
        if (!stringedCustomSpells) {
            return;
        }
        const newSpellList = JSON.parse(stringedCustomSpells)
        let index: number = 0
        for (let item of newSpellList) {
            if (item._id === spell._id) {
                newSpellList[index] = spell
            }
            index++
        }
        await AsyncStorage.setItem('customSpellList', JSON.stringify(newSpellList))
    }

    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} />
                :
                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 40 }}>
                    <AppText fontSize={17} textAlign={'center'}>Your spell is available for download through the public market.</AppText>
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