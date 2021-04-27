import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { updateMarketStatusFromPreviousLevels } from '../../../utility/charHallFunctions/characterStorage';
import marketApi from '../../api/marketApi';
import userCharApi from '../../api/userCharApi';
import { Colors } from '../../config/colors';
import useAuthContext from '../../hooks/useAuthContext';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import { AppText } from '../AppText';

interface Props {
    marketplace_id: string
    character: CharacterModel
    index: number
}

export function RemoveCharFromMarket({ marketplace_id, character, index }: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const userContext = useAuthContext()

    const handleClick = () => {
        Alert.alert("Remove from Market", "This character will be removed from the market, you can always readd it later",
            [{ text: 'Yes', onPress: () => removeFromMarket() }, { text: 'No' }])
    }

    const removeFromMarket = async () => {
        setLoading(true)
        const result = await marketApi.deleteFromMarket(marketplace_id, 'char');
        if (result.status === 204) {
            const updatedMarketCharData = await userCharApi.getChar(character._id || '');
            const updatedMarketChar = updatedMarketCharData.data;
            if (updatedMarketChar) {
                updatedMarketChar.marketStatus = { creator_id: userContext.user?._id || '', isInMarket: false, market_id: '' }
                const charResult = await userCharApi.updateCharacterAndReturnInfo(updatedMarketChar);
                store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: index, character: charResult.data } })
                await updateMarketStatusFromPreviousLevels(updatedMarketChar, { creator_id: userContext.user?._id || '', isInMarket: false, market_id: '' })
            }
            setLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <AppText fontSize={17} textAlign={'center'}>Your character is available for download through the public market.</AppText>
            <AppText fontSize={17} textAlign={'center'}>If you wish you can remove it from from the public.</AppText>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors.danger }]} onPress={() => handleClick()}>
                <AppText fontSize={20} textAlign={'center'}>Remove from the market</AppText>
            </TouchableOpacity>
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