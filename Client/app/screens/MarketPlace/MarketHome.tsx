import React, { Component, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { MarketItemPage } from './marketplaceCompoenents/MarketItemPage';
import { PrimeMarketItemRow } from './marketplaceCompoenents/PrimeMarketRow/PrimeMarketItemRow';
import { WelcomeToMarket } from './marketplaceCompoenents/WelcomeToMarket';

interface Props {
    navigation: any
}

export function MarketHome({ navigation }: Props) {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [chosenItem, setChosenItem] = useState<string>('')
    navigation.addListener('focus', () => {
        setRefresh(prevState => !prevState)
    });

    return (
        <ScrollView style={styles.container}>
            <WelcomeToMarket />
            <AppText color={Colors.bitterSweetRed} fontSize={30} textAlign={'center'} padding={15}>Marketplace</AppText>
            <PrimeMarketItemRow pickedItem={(val: string) => setChosenItem(val)} refresh={refresh} />
            {chosenItem !== '' && <MarketItemPage item_id={chosenItem} close={() => setChosenItem('')} />}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});