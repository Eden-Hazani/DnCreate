import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Config } from '../../../../../config';
import { AppText } from '../../../../components/AppText';
import { ItemInMarketModel } from '../../../../models/ItemInMarketModel';

const { width, height } = Dimensions.get('window')

interface Props {
    item: ItemInMarketModel
    index: number,
    currentlySnapped: number
    openItem: Function
}

export function PrimeMarketItem({ item, index, currentlySnapped, openItem }: Props) {
    const [currentAnimated, setCurrentAnimated] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 0, y: 0 }))
    useEffect(() => {
        if (index === currentlySnapped)
            fireAnimation()
    }, [currentlySnapped])

    const fireAnimation = () => {
        Animated.sequence([
            Animated.timing(currentAnimated, {
                toValue: { x: 0, y: -5 },
                duration: 100,
                useNativeDriver: false
            }),
            Animated.timing(currentAnimated, {
                toValue: { x: 0, y: 0 },
                duration: 100,
                useNativeDriver: false
            })
        ]).start()
    }
    return (
        <Animated.View style={currentAnimated.getLayout()}>
            <TouchableOpacity onPress={() => openItem({ itemName: item.itemName, market_id: item._id, marketType: item.marketType })}>
                {item.marketType === "CHAR" && <Image source={{ uri: `${Config.serverUrl}/assets/races/${item.image}` }} style={{ height: 100, width: 100, alignSelf: "center" }} />}
                {item.marketType === "WEAP" && <Image source={{ uri: `${Config.serverUrl}/assets/charEquipment/${item.image ? item.image : 'sword.png'}` }} style={{ height: 100, width: 100, alignSelf: "center" }} />}
                {item.marketType === "SPELL" && <Image source={{ uri: `${Config.serverUrl}/assets/misc/marketPlaceSpells/${item.image}.png` }} style={{ height: 100, width: 100, alignSelf: "center" }} />}
                <AppText textAlign={'center'}> {item.itemName}</AppText>
                <AppText textAlign={'center'}>{item.race || item.creatorName}</AppText>
                <AppText textAlign={'center'}>{item.charClass}</AppText>
            </TouchableOpacity>
        </Animated.View>
    )
}


const styles = StyleSheet.create({
    container: {
    }
});