import React, { Component, useState } from 'react';
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


export default function NumberScroll({ max, getValue }: any) {
    const [primeIndex, setPrimeIndex] = useState(0)
    const [manualWindow, setManualWindow] = useState(false)
    const increment: any = React.useRef(null);
    const numberArray: number[] = Array.from({ length: max }, (x, i) => i + 1);
    const scrollX = React.useRef(new Animated.Value(0)).current
    const moveIndexRef: any = React.useRef(null)
    const onViewRef = React.useRef((viewableItems: any) => {
        if (!viewableItems || !viewableItems.viewableItems || !viewableItems.viewableItems[0] || !viewableItems.viewableItems[0].index) {
            return
        }
        setPrimeIndex(viewableItems.viewableItems[0].index)
        getValue(viewableItems)
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: (width / 3) })

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
            <Modal visible={manualWindow}>
                <View>
                    <AppText fontSize={18} textAlign={'center'}>Set Manually</AppText>
                    <AppTextInput keyboardType="numeric" onChangeText={(newIndex: number) => {
                        setPrimeIndex(newIndex - 1)
                    }} />
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={110} height={110} borderRadius={110}
                        title={'Done'} onPress={() => {
                            if (primeIndex <= 0 || primeIndex >= numberArray.length) {
                                alert(`Range is between 1 - ${numberArray.length}`)
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