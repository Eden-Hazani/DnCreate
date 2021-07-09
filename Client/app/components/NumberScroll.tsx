import React, { Component, useEffect, useState } from 'react';
import { useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { number } from 'yup';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { AppTextInput } from './forms/AppTextInput';
import { IconGen } from './IconGen';

const { width, height } = Dimensions.get('window')



const Item = ({ item, scrollX, index }: any) => {
    const inputRange = [(index - 1) * (width / 3), index * (width / 3), (index + 1) * (width / 3)];
    const scale = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 0]
    })

    return <View style={styles.item}>
        <Animated.Text style={{
            fontFamily: "KumbhSans-Light",
            fontSize: 40,
            color: Colors.berries,
            transform: [{ scale: scale }]
        }}>{item}</Animated.Text>
    </View>
}


/**
 * Horizontal Number scroller
 * @param {Number} max - max number allowed with the scroller 
 * @param {Function} getValue - gets the current shown value as a callback 
 * @param {Boolean} startFromZero - starts the Number List from zero - default is false (list starts at 1) 
 * @param {Boolean} startingVal - Jumps to index of this item in the list 
 */
export default function NumberScroll({ pauseStart, modelColor, startingVal, max, getValue, startFromZero }: any) {
    useEffect(() => {
        if (!preventOnLoad) {
            getValue(numberArray[0])
        }
        if (startingVal) {
            setTimeout(() => {
                moveIndexRef.current.scrollToIndex({ animation: false, index: primeIndex })
            }, 200);
        }

    }, [])

    const getPrimeIndexToStart = (): number => {
        return startFromZero ? startingVal : startingVal - 1
    }
    let preventOnLoad = pauseStart ? true : false
    const [typeError, setTypeError] = useState(false)
    const [primeIndex, setPrimeIndex] = useState(startingVal ? getPrimeIndexToStart() : 0)
    const [manualWindow, setManualWindow] = useState(false)
    const increment: any = React.useRef(null);
    const numberArray: number[] = startFromZero ? Array.from({ length: max + 1 }, (x, i) => i) : Array.from({ length: max }, (x, i) => i + 1)
    const scrollX = React.useRef(new Animated.Value(0)).current
    const moveIndexRef: any = React.useRef(null)
    const onViewRef = useRef(({ viewableItems }: any) => {
        if (viewableItems[0]) {
            if (preventOnLoad) {
                preventOnLoad = false
                setPrimeIndex(viewableItems[0].item)
                return
            }
            getValue(viewableItems[0]?.item)
            setPrimeIndex(viewableItems[0]?.index)
        }
    });
    const viewConfigRef = React.useRef({
        itemVisiblePercentThreshold: 50,
        waitForInteraction: true,
        minimumViewTime: 5
    })

    const getItemLayout = (data: any, index: any) => (
        { length: (width / 3), offset: (width / 3) * index, index }
    )

    return (
        <View style={styles.container}>
            <View style={{ width: width / 3 }}>
                <Animated.FlatList
                    data={numberArray}
                    viewabilityConfig={viewConfigRef.current}
                    onViewableItemsChanged={onViewRef.current}
                    keyExtractor={(item: any) => item.toString()}
                    numColumns={1}
                    getItemLayout={getItemLayout}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    scrollEventThrottle={16}
                    decelerationRate={"fast"}
                    snapToInterval={width / 3}
                    onEndReachedThreshold={0.5}
                    ref={moveIndexRef}

                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )}
                    renderItem={({ item, index }: any) =>
                        <TouchableOpacity onPress={() => { setManualWindow(true) }}>
                            <Item item={item} scrollX={scrollX} index={index} />
                        </TouchableOpacity>
                    } />

            </View>
            <Modal visible={manualWindow} animationType={'slide'}>
                <View style={{ backgroundColor: modelColor, flex: 1 }}>
                    <AppText fontSize={18} textAlign={'center'}>Set Manually</AppText>
                    <AppTextInput keyboardType="numeric" onChangeText={(newIndex: any) => {
                        const regex = new RegExp("^[0-9]+$")
                        if (!regex.test(newIndex)) {
                            setTypeError(true)
                            return;
                        }
                        setTypeError(false)
                        startFromZero ? setPrimeIndex(newIndex) : setPrimeIndex(newIndex - 1)
                    }} />
                    <View style={{ justifyContent: "center", alignItems: "center", display: typeError ? "flex" : "none" }}>
                        <AppText color={Colors.danger}>Only input numbers, no letters allowed</AppText>
                    </View>
                    <AppButton padding={15} backgroundColor={Colors.bitterSweetRed} width={110} height={110} borderRadius={110}
                        title={'Done'} onPress={() => {
                            if (primeIndex <= 0 || primeIndex >= numberArray.length) {
                                alert(`Range is between ${numberArray[0]} - ${numberArray[numberArray.length - 1]}`)
                                return;
                            }
                            moveIndexRef.current.scrollToIndex({ animation: false, index: primeIndex })
                            setManualWindow(false)
                        }} />
                </View>
            </Modal>
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    item: {
        width: (width / 3),
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
});