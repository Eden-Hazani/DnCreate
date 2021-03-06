import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useSelector } from 'react-redux';
import logger from '../../../../../utility/logger';
import marketApi from '../../../../api/marketApi';
import { AppActivityIndicator } from '../../../../components/AppActivityIndicator';
import useDidUpdateEffect from '../../../../hooks/useDidUpdateEffect';
import { ItemInMarketModel } from '../../../../models/ItemInMarketModel';
import { RootState } from '../../../../redux/reducer';
import { PrimeMarketItem } from './PrimeMarketItem';

interface Props {
    refresh: boolean
    pickedItem: Function
}

interface Item {
    charName: string;
    market_id: string
}

export function PrimeMarketItemRow({ refresh, pickedItem }: Props) {
    const [loading, setLoading] = useState<boolean>(true)
    const [currentPrimeRaces, setCurrentPrimeRaces] = useState<ItemInMarketModel[]>([])
    const [currentSnappedAni, setCurrentSnappedAni] = useState<number>(-1)

    const marketType = useSelector((state: RootState) => { return state.marketPlaceType });

    useEffect(() => {
        loadUp()
    }, [refresh])



    const loadUp = async () => {
        try {
            const result = await marketApi.getPrimeItemsFromMarket(marketType);
            if (result.data) {
                setCurrentPrimeRaces(result.data)
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
    }

    useDidUpdateEffect(loadUp, [marketType])


    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} /> :
                <View>
                    {currentPrimeRaces.length > 0 &&
                        <Carousel
                            data={currentPrimeRaces}
                            renderItem={({ item, index }: any) => (<PrimeMarketItem openItem={(val: Item) => pickedItem(val)} currentlySnapped={currentSnappedAni} index={index} item={item} />)}
                            sliderWidth={Dimensions.get("screen").width}
                            itemWidth={Dimensions.get("screen").width / 2.5}
                            enableSnap
                            onBeforeSnapToItem={(index) => setCurrentSnappedAni(index)}
                        />}
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
});