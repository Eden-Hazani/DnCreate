import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { ItemInMarketModel } from '../../../models/ItemInMarketModel';
import { MarketItemImage } from './MarketItemImage';

interface Props {
    item: ItemInMarketModel
    index: number
    openItem: Function
}



export function MarketMainPageItem({ item, index, openItem }: Props) {

    const getBackColors = () => {
        if (index % 2 === 0) {
            return Colors.bitterSweetRed
        }
        return Colors.pinkishSilver
    }

    return (
        <TouchableOpacity onPress={() => openItem({ itemName: item.itemName, market_id: item._id, marketType: item.marketType })}
            style={[styles.container, { borderColor: Colors.whiteInDarkMode, backgroundColor: getBackColors() }]}>
            <View style={styles.innerContainer}>
                <MarketItemImage marketType={item.marketType || ''} img={item.image || ''} />
                <View style={{ flex: .5 }}>
                    <AppText>Name: {item.itemName}</AppText>
                    {item.currentLevel && <AppText>Level: {item.currentLevel}</AppText>}
                    <AppText>Created By: {item.creatorName}</AppText>
                    <AppText>Downloads: {item.downloadedTimes}</AppText>
                </View>
                {item.description &&
                    <View style={{ flex: .35 }}>
                        <AppText>About: {item.description.length > 40 ? `${item.description?.substr(0, 40)}...` : item.description}</AppText>
                    </View>
                }
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        margin: 10,
        borderRadius: 15,
        borderWidth: 1,

    },
    innerContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: "center"
    }
});