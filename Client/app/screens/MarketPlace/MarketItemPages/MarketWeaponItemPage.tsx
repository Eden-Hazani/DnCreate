import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import logger from '../../../../utility/logger';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { Colors } from '../../../config/colors';
import marketApi from '../../../api/marketApi';
import { AppText } from '../../../components/AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { checkMarketWeaponItemValidity } from '../functions/marketInteractions';
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


interface Props {
    item: Item
    close: Function
}

interface Item {
    itemName: string;
    marketType: string;
    market_id: string
}

export function MarketWeaponItemPage({ item, close }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [marketItem, setMarketItem] = useState<MarketWeaponItemModel | null>(null)
    const [canDownload, setCanDownload] = useState<{ error: string, description: string }>({ error: '', description: '' })
    const [currentChar, setCurrentChar] = useState<CharacterModel | null>(null)

    const userContext = useAuthContext();

    useEffect(() => {
        loadItem().then(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (currentChar) checkIfDownloadable()
    }, [currentChar])

    const checkIfDownloadable = async () => {
        setCanDownload(await checkMarketWeaponItemValidity(currentChar?._id || '', item.market_id))
    }

    const loadItem = async () => {
        try {
            const result = await marketApi.getSingleMarketItem(item.market_id, item.marketType);
            if (result.data)
                setMarketItem(result.data)
        } catch (err) {
            logger.log(err)
        }
    }

    const saveWeaponInfo = async () => {
        try {
            setLoading(true)
            let weaponList = await AsyncStorage.getItem(`${currentChar?._id}WeaponList`);
            if (!weaponList) {
                const weaponList = [marketItem?.weaponInfo]
                AsyncStorage.setItem(`${currentChar?._id}WeaponList`, JSON.stringify(weaponList))
                await marketApi.addDownloadToMarketItem(item.market_id, item.marketType)
                checkIfDownloadable()
                setLoading(false)
                return
            }
            const newWeaponList = JSON.parse(weaponList)
            newWeaponList.push(marketItem?.weaponInfo)
            await AsyncStorage.setItem(`${currentChar?._id}WeaponList`, JSON.stringify(newWeaponList))
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
                                <Image uri={`${Config.serverUrl}/assets/charEquipment/${marketItem?.image ? marketItem.image : 'sword.png'}`} style={{ height: 120, width: 120 }} />
                                <View style={{ paddingTop: 20 }}>
                                    <AppText fontSize={20} color={Colors.pinkishSilver}>{marketItem?.creatorName}</AppText>
                                    <AppText fontSize={18}>Name: {marketItem?.weaponInfo?.name}</AppText>
                                    <AppText fontSize={18}>Dice: {marketItem?.weaponInfo?.diceAmount} {marketItem?.weaponInfo?.dice}</AppText>
                                    <AppText fontSize={13}>Added Damage Bonus: {marketItem?.weaponInfo?.addedDamage}</AppText>
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
                                <AppText>Abilities: {marketItem?.weaponInfo?.specialAbilities}</AppText>

                            </View>
                        </View>
                        <View style={{ marginBottom: 30 }}>
                            <AppPicker itemList={store.getState().characters} selectedItemIcon={null} itemColor={Colors.bitterSweetRed}
                                selectedItem={currentChar?.name} selectItem={(pickedCharacter: any) => setCurrentChar(pickedCharacter)}
                                numColumns={3} placeholder={"Pick Character For The Weapon"} iconName={"apps"} />
                            {currentChar ? <MarketItemPageButtons addItem={() => saveWeaponInfo()} closeModel={() => close()} canDownload={canDownload} /> :
                                <View style={{ marginTop: 15 }}>
                                    <AppButton borderRadius={15} title={'Close'} backgroundColor={Colors.pinkishSilver} width={150} height={50} onPress={() => close()} />
                                </View>}
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
        flex: .4
    },
    upperBlock: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    leftBlock: {
        flex: .5
    },

});