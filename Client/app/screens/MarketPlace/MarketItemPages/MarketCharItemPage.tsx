import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { Colors } from '../../../config/colors';
import marketApi from '../../../api/marketApi';
import { MarketCharItemModel } from '../../../models/MarketCharItemModel';
import { AppText } from '../../../components/AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { checkMarketCharItemValidity } from '../functions/marketInteractions';
import { MarketItemPageButtons } from '../marketplaceCompoenents/MarketItemPageButtons';
import userCharApi from '../../../api/userCharApi';
import { addAllCharLevelsToStorage, implantIdIntoSavedChar, saveCharArmaments } from '../functions/storageFunctions';
import useAuthContext from '../../../hooks/useAuthContext';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { CharacterModel } from '../../../models/characterModel';


interface Props {
    item: Item
    close: Function
}

interface Item {
    itemName: string;
    marketType: string;
    market_id: string
}

export function MarketCharItemPage({ item, close }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [marketItem, setMarketItem] = useState<MarketCharItemModel | null>(null)
    const [canDownload, setCanDownload] = useState<{ error: string, description: string }>({ error: '', description: '' })

    const userContext = useAuthContext();

    useEffect(() => {
        loadItem().then(() => setCanDownload(checkMarketCharItemValidity(item.market_id, item.itemName))).finally(() => setLoading(false))
    }, [])

    const loadItem = async () => {
        try {
            const result = await marketApi.getSingleMarketItem(item.market_id, item.marketType);
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
                const result = await userCharApi.saveCharFromMarket(newChar, marketItem._id || '', item.marketType);
                const savedChar: CharacterModel = result.data as any
                store.dispatch({ type: ActionType.addNewCharacter, payload: savedChar });
                if (marketItem.characterLevelList && marketItem.characterLevelList.length > 0) {
                    addAllCharLevelsToStorage(marketItem.characterLevelList, savedChar._id || '', savedChar.user_id || '')
                }
                saveCharArmaments(savedChar._id, marketItem.weaponItems, marketItem.armorItems, marketItem.shieldItems)
                setCanDownload(checkMarketCharItemValidity(item.market_id, item.itemName))
                setLoading(false)
            }
        } catch (err) {

        }
    }

    return (
        <Modal visible={true} animationType="slide">
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {loading ? <AppActivityIndicator visible={loading} /> :
                    <ScrollView>
                        <View style={styles.upperBlock}>
                            <View style={styles.leftBlock}>
                                <Image uri={`${Config.serverUrl}/assets/races/${marketItem?.image}`} style={{ height: 120, width: 120 }} />
                                <View style={{ paddingTop: 20 }}>
                                    <AppText fontSize={20} color={Colors.pinkishSilver}>{marketItem?.itemName}</AppText>
                                    <AppText fontSize={18}>Class: {marketItem?.charClass}</AppText>
                                    <AppText fontSize={18}>Race: {marketItem?.race}</AppText>
                                    <AppText fontSize={18}>Current Level: {marketItem?.currentLevel}</AppText>
                                    <View style={{ paddingTop: 15 }}>
                                        <AppText fontSize={18}>Downloads: {marketItem?.downloadedTimes}</AppText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rightBlock}>
                                <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                                    <AppText fontSize={18} color={Colors.pinkishSilver}>About</AppText>
                                    <AppText>{marketItem?.description}</AppText>
                                </View>
                                {marketItem?.currentLevelChar?.backStory !== undefined && <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                                    <AppText fontSize={18} color={Colors.pinkishSilver}>Backstory</AppText>
                                    <AppText>{marketItem?.currentLevelChar?.backStory}</AppText>
                                </View>}
                            </View>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <MarketItemPageButtons addItem={() => saveCharInfo()} closeModel={() => close()} canDownload={canDownload} />
                        </View>
                    </ScrollView>
                }
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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