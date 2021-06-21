import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import logger from '../../../../utility/logger';
import marketApi from '../../../api/marketApi';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppText } from '../../../components/AppText';
import useDidUpdateEffect from '../../../hooks/useDidUpdateEffect';
import { ItemInMarketModel } from '../../../models/ItemInMarketModel';
import { MarketFilterModal } from '../../../models/MarketFilterModal';
import { ActionType } from '../../../redux/action-type';
import { RootState } from '../../../redux/reducer';
import { store } from '../../../redux/store';
import { MarketMainPageItem } from './MarketMainPageItem';

interface Props {
    pickedItem: Function
    refresh: boolean
}

interface Item {
    charName: string;
    market_id: string
}

export function MarketMainPage({ pickedItem, refresh }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [currentDisplayed, setCurrentDisplayed] = useState<number>(0);
    const [currentItems, setCurrentItems] = useState<ItemInMarketModel[]>([]);

    const marketPlaceFilters = useSelector((state: RootState) => { return { ...state.marketPlaceFilters } });
    const currentText = useSelector((state: RootState) => state.marketPlaceSearchText)
    const marketType = useSelector((state: RootState) => state.marketPlaceType)

    useEffect(() => {
        setLoading(true)
        getMarketItemBatch(0, 10, marketPlaceFilters, false, null)
    }, [refresh, marketType])

    const search = () => {
        if (currentText === '') {
            getMarketItemBatch(0, 10, marketPlaceFilters, false, null)
            return
        }
        getMarketItemBatch(0, 20, marketPlaceFilters, true, currentText)
    }


    useDidUpdateEffect(search, [currentText])


    useEffect(() => {
        if (marketPlaceFilters.isApplied) {
            setLoading(true)
            setCurrentItems([])
            getMarketItemBatch(0, 10, marketPlaceFilters, false, null)
            store.dispatch({ type: ActionType.ChangeMarketFilterAppliedState, payload: false });
        }
    }, [marketPlaceFilters])



    const getMarketItemBatch = async (start: number, end: number, filters: MarketFilterModal, isNextBatch: boolean, isSearch: string | null) => {
        try {
            const { data } = await marketApi.getMarketItemBatchFromServer(start, end, filters, isSearch, marketType);
            if (isSearch && data) {
                setCurrentItems(data)
                if (data.length !== 0) {
                    setCurrentDisplayed(prevState => prevState + 10)
                }
                return;
            }
            else if (!isNextBatch && data) {
                setCurrentItems(data)
                setCurrentDisplayed(10)
                setLoading(false)
                return;
            } else if (isNextBatch && data) {
                if (data.length !== 0) {
                    setCurrentDisplayed(prevState => prevState + 10)
                }
                setCurrentItems(prevState => [...prevState, ...data])
                return;
            }
            setLoading(false)
        } catch (err) {
            logger.log(err)
            setLoading(false)
            return ([])
        }
    }

    const loadNextRaceBatch = () => {
        if (currentText.length > 0) {
            return
        }
        getMarketItemBatch(currentDisplayed, 10, marketPlaceFilters, true, null)
    }

    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} />
                : currentItems.length === 0 ?
                    <View>
                        <AppText fontSize={20} textAlign={'center'} padding={15}>There are no items that fit your search</AppText>
                    </View>
                    :
                    <FlatList
                        onEndReachedThreshold={2}
                        onEndReached={() => {
                            loadNextRaceBatch()
                        }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={currentItems}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => <MarketMainPageItem openItem={(val: Item) => pickedItem(val)} index={index} item={item} />}
                    />
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    }
});