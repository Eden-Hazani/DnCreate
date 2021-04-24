import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { ItemInMarketModel } from '../../../models/ItemInMarketModel';

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
        <TouchableOpacity onPress={() => openItem({ charName: item.charName, market_id: item._id })}
            style={[styles.container, { borderColor: Colors.whiteInDarkMode, backgroundColor: getBackColors() }]}>
            <View style={styles.innerContainer}>
                <Image uri={`${Config.serverUrl}/assets/races/${item.raceImag}`} style={{ height: 80, width: 80, flex: .2 }} />
                <View style={{ flex: .5 }}>
                    <AppText>Name: {item.charName}</AppText>
                    <AppText>Level: {item.currentLevel}</AppText>
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