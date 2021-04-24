import React, { Component, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { MarketFilters } from './marketplaceCompoenents/MarketFilters';
import { MarketItemPage } from './marketplaceCompoenents/MarketItemPage';
import { MarketMainPage } from './marketplaceCompoenents/MarketMainPage';
import { MarketSearch } from './marketplaceCompoenents/MarketSearch';
import { PrimeMarketItemRow } from './marketplaceCompoenents/PrimeMarketRow/PrimeMarketItemRow';
import { WelcomeToMarket } from './marketplaceCompoenents/WelcomeToMarket';

interface Props {
    navigation: any
}

interface Item {
    charName: string;
    market_id: string
}

export function MarketHome({ navigation }: Props) {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [chosenItem, setChosenItem] = useState<{ charName: string, market_id: string } | null>(null)
    navigation.addListener('focus', () => {
        setRefresh(prevState => !prevState)
    });

    return (
        <View style={styles.container}>
            <WelcomeToMarket />
            <View style={styles.topLine}>
                <MarketFilters />
                <AppText color={Colors.bitterSweetRed} fontSize={30} textAlign={'center'} padding={15}>Marketplace</AppText>
                <MarketSearch />
            </View>
            <PrimeMarketItemRow pickedItem={(val: Item) => setChosenItem(val)} refresh={refresh} />
            <View style={{ flex: 1 }}>
                <MarketMainPage refresh={refresh} pickedItem={(val: Item) => setChosenItem(val)} />
            </View>
            {chosenItem && <MarketItemPage item={chosenItem} close={() => setChosenItem(null)} />}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topLine: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});