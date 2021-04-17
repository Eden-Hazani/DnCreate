import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { Colors } from '../../../config/colors';
import marketApi from '../../../api/marketApi';
import { MarketCharItemModel } from '../../../models/MarketCharItemModel';
import { AppText } from '../../../components/AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { checkMarketItemValidity } from '../functions/marketInteractions';
import { MarketItemPageButtons } from './MarketItemPageButtons';
import userCharApi from '../../../api/userCharApi';
import { addAllCharLevelsToStorage, implantIdIntoSavedChar, saveCharArmaments } from '../functions/storageFunctions';
import useAuthContext from '../../../hooks/useAuthContext';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { CharacterModel } from '../../../models/characterModel';


interface Props {
    item_id: string
    close: Function
}

export function MarketItemPage({ item_id, close }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [marketItem, setMarketItem] = useState<MarketCharItemModel | null>(null)
    const [canDownload, setCanDownload] = useState<boolean>(false)

    const userContext = useAuthContext();

    useEffect(() => {
        loadItem().then(() => setCanDownload(checkMarketItemValidity(item_id))).finally(() => setLoading(false))
    }, [])

    const loadItem = async () => {
        try {
            const result = await marketApi.getSingleMarketItem(item_id);
            if (result.data)
                setMarketItem(result.data)
        } catch (err) {
            logger.log(err)
        }
    }

    const saveCharInfo = async () => {
        try {
            if (marketItem?.currentLevelChar) {
                setLoading(true)
                const newChar = implantIdIntoSavedChar(marketItem.currentLevelChar, userContext.user?._id || '')
                const result = await userCharApi.saveCharFromMarket(newChar);
                console.log(result.data)
                const savedChar: CharacterModel = result.data as any
                store.dispatch({ type: ActionType.addNewCharacter, payload: savedChar });
                if (marketItem.characterLevelList && marketItem.characterLevelList.length > 0) {
                    addAllCharLevelsToStorage(marketItem.characterLevelList, savedChar._id || '', savedChar.user_id || '')
                }
                saveCharArmaments(savedChar._id, marketItem.weaponItems, marketItem.armorItems, marketItem.shieldItems)
                setCanDownload(checkMarketItemValidity(item_id))
                setLoading(false)
            }
        } catch (err) {

        }
    }


    return (
        <Modal visible={true} animationType="slide">
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {loading ? <AppActivityIndicator visible={loading} /> :
                    <View>
                        <View style={styles.upperBlock}>
                            <View style={styles.leftBlock}>
                                <Image uri={`${Config.serverUrl}/assets/races/${marketItem?.raceImag}`} style={{ height: 120, width: 120 }} />
                                <View style={{ paddingTop: 20 }}>
                                    <AppText fontSize={20} color={Colors.pinkishSilver}>{marketItem?.charName}</AppText>
                                    <AppText>Class: {marketItem?.charClass}</AppText>
                                    <AppText>Race: {marketItem?.race}</AppText>
                                    <AppText>Current Level: {marketItem?.currentLevel}</AppText>
                                    <AppText>{marketItem?.charName}</AppText>
                                </View>
                            </View>
                            <View style={styles.rightBlock}>
                                <View>
                                    <AppText fontSize={18} color={Colors.pinkishSilver}>About</AppText>
                                    <AppText>{marketItem?.description}</AppText>
                                </View>
                                {marketItem?.currentLevelChar?.backStory && <View>
                                    <AppText fontSize={18} color={Colors.pinkishSilver}>Backstory</AppText>
                                    <AppText>{marketItem?.currentLevelChar?.backStory}</AppText>
                                </View>}
                            </View>
                        </View>
                        <MarketItemPageButtons addCharacter={() => saveCharInfo()} closeModel={() => close()} canDownload={canDownload} />
                    </View>
                }
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightBlock: {
        flex: .5
    },
    upperBlock: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly"
    },
    leftBlock: {
        flex: .4
    },

});