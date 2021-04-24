import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import { ActionType } from '../../../redux/action-type';
import { RootState } from '../../../redux/reducer';
import { store } from '../../../redux/store';
const { height, width } = Dimensions.get('window')

export function MarketSearch() {
    const [animationStatus, setAnimationStatus] = useState(new Animated.Value(0))
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const currentText = useSelector((state: RootState) => state.marketPlaceSearchText)

    const animate = () => {
        Animated.timing(animationStatus, {
            toValue: isOpen ? width / 1.2 : 0,
            duration: 300,
            useNativeDriver: false
        }).start()
    }
    useEffect(() => {
        animate()
        if (!isOpen) {
            store.dispatch({ type: ActionType.ChangeMarketPlaceSearchText, payload: '' })
        }
    }, [isOpen])

    const handlePress = () => {
        setIsOpen(prevState => !prevState);
    }

    const updateSearch = async (search: string) => {
        store.dispatch({ type: ActionType.ChangeMarketPlaceSearchText, payload: search })
    }

    return (
        <View >
            <TouchableOpacity onPress={() => handlePress()}>
                <IconGen name={isOpen ? 'close' : 'feature-search-outline'} size={70} iconColor={Colors.whiteInDarkMode} />
            </TouchableOpacity>
            <Animated.View style={[styles.container, { width: animationStatus, right: 70 }]}>
                <SearchBar
                    containerStyle={{
                        backgroundColor: Colors.pageBackground, borderBottomColor: isOpen ? Colors.lightGray : 'transparent',
                        borderTopColor: isOpen ? Colors.lightGray : 'transparent'
                    }}
                    inputContainerStyle={{ backgroundColor: Colors.pageBackground }}
                    lightTheme={Colors.pageBackground === "#121212" ? false : true}
                    placeholder="Search For Item"
                    onChangeText={updateSearch}
                    value={currentText}
                />
            </Animated.View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        width: width / 1.3,
        elevation: 10
    }
});