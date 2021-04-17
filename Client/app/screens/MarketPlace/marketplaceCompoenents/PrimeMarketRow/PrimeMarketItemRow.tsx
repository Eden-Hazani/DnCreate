import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import logger from '../../../../../utility/logger';
import marketApi from '../../../../api/marketApi';
import { AppActivityIndicator } from '../../../../components/AppActivityIndicator';
import { ItemInMarketModel } from '../../../../models/ItemInMarketModel';
import { PrimeMarketItem } from './PrimeMarketItem';

interface Props {
    refresh: boolean
    pickedItem: Function
}

export function PrimeMarketItemRow({ refresh, pickedItem }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [currentPrimeRaces, setCurrentPrimeRaces] = useState<ItemInMarketModel[]>([])
    const [currentSnappedAni, setCurrentSnappedAni] = useState<number>(-1)

    useEffect(() => {
        loadUp()
    }, [refresh])

    const loadUp = async () => {
        try {
            const result = await marketApi.getPrimeItemsFromMarket();
            if (result.data) {
                setCurrentPrimeRaces(result.data)
                setLoading(false)
            }
        } catch (err) {
            logger.log(err)
            console.log(err)
        }
    }

    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} /> :
                <View >
                    <Carousel
                        data={currentPrimeRaces}
                        renderItem={({ item, index }: any) => (<PrimeMarketItem openItem={(val: string) => pickedItem(val)} currentlySnapped={currentSnappedAni} index={index} item={item} />)}
                        sliderWidth={Dimensions.get("screen").width}
                        itemWidth={Dimensions.get("screen").width / 2.5}
                        enableSnap
                        onBeforeSnapToItem={(index) => setCurrentSnappedAni(index)}
                    />
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
});