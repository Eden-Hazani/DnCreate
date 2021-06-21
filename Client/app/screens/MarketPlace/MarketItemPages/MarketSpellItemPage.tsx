import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { Colors } from '../../../config/colors';
import marketApi from '../../../api/marketApi';
import { AppText } from '../../../components/AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { checkMarketSpellItemValidity, checkMarketWeaponItemValidity } from '../functions/marketInteractions';
import { MarketItemPageButtons } from '../marketplaceCompoenents/MarketItemPageButtons';
import userCharApi from '../../../api/userCharApi';
import { addAllCharLevelsToStorage, implantIdIntoSavedChar, saveCharArmaments } from '../functions/storageFunctions';
import useAuthContext from '../../../hooks/useAuthContext';
import { store } from '../../../redux/store';
import { ActionType } from '../../../redux/action-type';
import { CharacterModel } from '../../../models/characterModel';
import { AppPicker } from '../../../components/AppPicker';
import { MarketWeaponItemModel } from '../../../models/MarketWeaponItemModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppButton } from '../../../components/AppButton';
import { SpellMarketItem } from '../../../models/SpellMarketItem';
import { spellLevelReadingChanger } from '../../charOptions/helperFunctions/spellLevelReadingChanger';


interface Props {
    item: Item
    close: Function
}

interface Item {
    itemName: string;
    marketType: string;
    market_id: string
}

export function MarketSpellItemPage({ item, close }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [marketItem, setMarketItem] = useState<SpellMarketItem | null>(null)
    const [canDownload, setCanDownload] = useState<{ error: string, description: string }>({ error: '', description: '' })

    useEffect(() => {
        loadItem().then(() => {
            checkIfDownloadable()
            setLoading(false)
        })
    }, [])


    const checkIfDownloadable = async () => setCanDownload(await checkMarketSpellItemValidity(item.market_id))


    const loadItem = async () => {
        try {
            const result = await marketApi.getSingleMarketItem(item.market_id, item.marketType);
            if (result.data) setMarketItem(result.data)
        } catch (err) {
            logger.log(err)
        }
    }

    const saveSpell = async () => {
        try {
            setLoading(true)
            let spellList = await AsyncStorage.getItem(`customSpellList`);
            if (!spellList) {
                const spellList = [marketItem?.spell]
                AsyncStorage.setItem(`customSpellList`, JSON.stringify(spellList))
                await marketApi.addDownloadToMarketItem(item.market_id, item.marketType)
                checkIfDownloadable()
                setLoading(false)
                return
            }
            const newSpellList = JSON.parse(spellList)
            newSpellList.push(marketItem?.spell)
            await AsyncStorage.setItem(`customSpellList`, JSON.stringify(newSpellList))
            await marketApi.addDownloadToMarketItem(item.market_id, item.marketType)
            checkIfDownloadable()
            setLoading(false)

        } catch (err) {
            logger.log(err)
            setLoading(false)
        }
    }



    return (
        <Modal visible={true} animationType="slide">
            <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                {loading ? <AppActivityIndicator visible={loading} /> :
                    <ScrollView>
                        <View style={styles.upperBlock}>
                            <View style={styles.leftBlock}>
                                <Image uri={`${Config.serverUrl}/assets/misc/marketPlaceSpells/${marketItem?.image}.png`} style={{ height: 120, width: 120 }} />
                                <View style={{ paddingTop: 20 }}>
                                    <AppText fontSize={20} color={Colors.pinkishSilver}>{marketItem?.creatorName}</AppText>
                                    <AppText fontSize={18}>Name: {marketItem?.itemName}</AppText>
                                    <AppText fontSize={18}>Description: {marketItem?.spell?.description}</AppText>
                                    <View style={{ paddingTop: 15 }}>
                                        <AppText fontSize={18}>Downloads: {marketItem?.downloadedTimes}</AppText>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.rightBlock}>
                                <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                                    <AppText fontSize={18} color={Colors.pinkishSilver}>About</AppText>
                                    <AppText fontSize={18}>Spell name:</AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={22}>{marketItem?.spell?.name}</AppText>
                                    <AppText fontSize={18}>Spell Description: </AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={15}>{marketItem?.spell?.description}</AppText>

                                    <AppText fontSize={18}>Spell school:</AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={18}>{marketItem?.spell?.school}</AppText>

                                    <AppText fontSize={18}>Available classes:</AppText>
                                    <View style={{ paddingLeft: 5, flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 5 }}>
                                        {marketItem?.spell?.classes?.map((item) => <AppText key={item} color={Colors.earthYellow} fontSize={15} padding={3}>{item.charAt(0).toUpperCase() + item.slice(1)}</AppText>)}
                                    </View>
                                    <AppText fontSize={18}>Spell Duration:</AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={18}>{marketItem?.spell?.duration}</AppText>

                                    <AppText fontSize={16}>Spell Level: </AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.metallicBlue} fontSize={20}>{spellLevelReadingChanger(marketItem?.spell?.level || '1')}</AppText>
                                    <AppText fontSize={18}>Spell Range:</AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={18}>{marketItem?.spell?.range}</AppText>
                                    <AppText fontSize={18}>Spell Materials:</AppText>
                                    <AppText paddingLeft={5} paddingBottom={5} color={Colors.earthYellow} fontSize={18}>{marketItem?.spell?.materials_needed}</AppText>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <View style={{ marginTop: 15 }}>
                                <MarketItemPageButtons addItem={() => saveSpell()} closeModel={() => close()} canDownload={canDownload} />
                            </View>
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
        flex: .6
    },
    upperBlock: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    leftBlock: {
        flex: .4
    },

});