import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { Colors } from '../../config/colors';
import { AppText } from '../AppText';

interface Props {
    name: string;
    isInMarket: boolean | undefined;
    image: string
}


export function UpperCharacterMarketInfo({ name, isInMarket, image }: Props) {
    return (
        <View style={styles.container}>
            <AppText fontSize={30}>{name}</AppText>
            <Image uri={`${Config.serverUrl}/assets/races/${image}`} style={{ width: 100, height: 100 }} />
            {isInMarket ? <AppText textAlign={'center'} fontSize={22} padding={20} color={Colors.paleGreen}>Character is offered In the market</AppText>
                : <View>
                    <AppText textAlign={'center'} fontSize={22} padding={20} color={Colors.danger}>Character is not offered In the market</AppText>
                    <AppText fontSize={16} textAlign={'center'}>Consider sharing your creation with the rest of the community.</AppText>
                    <AppText fontSize={16} textAlign={'center'}>Using the marketplace, you and the rest of the DnCreate community can share and use characters with different stories and backgrounds!</AppText>
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },
});