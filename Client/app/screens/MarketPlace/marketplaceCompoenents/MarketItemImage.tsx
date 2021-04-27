import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';

interface Props {
    img: string
    marketType: string
}

export function MarketItemImage({ img, marketType }: Props) {
    return (
        <View style={styles.container}>
            {marketType === 'CHAR' && <Image uri={`${Config.serverUrl}/assets/races/${img}`} style={{ height: 80, width: 80, flex: .2 }} />}
            {marketType === 'WEAP' && <Image uri={`${Config.serverUrl}/assets/charEquipment/${img ? img : 'sword.png'}`} style={{ height: 80, width: 80, flex: .2 }} />}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});