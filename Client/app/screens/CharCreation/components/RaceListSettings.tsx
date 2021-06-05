import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Switch } from 'react-native';
import { IconGen } from '../../../components/IconGen';
import { Colors } from '../../../config/colors';
import Modal from 'react-native-modal';
import { AppText } from '../../../components/AppText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppButton } from '../../../components/AppButton';
import racesApi from '../../../api/racesApi';
const { width, height } = Dimensions.get('screen');

interface Props {
    refreshRaces: Function
}

export function RaceListSettings({ refreshRaces }: Props) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [homeBrewAllowed, setHomeBrewAllowed] = useState(false)
    const [popularity, setPopularity] = useState<string>('')

    useEffect(() => {
        setSettings()
    }, [])

    const setSettings = async () => {
        const showPublicRaces = await AsyncStorage.getItem('showPublicRaces');
        if (showPublicRaces && showPublicRaces === 'true') setHomeBrewAllowed(true);
        const popularitySetting = await AsyncStorage.getItem('racePopularitySetting');
        if (popularitySetting) setPopularity(popularitySetting);
    }

    const setNewPop = async (val: string) => {
        await AsyncStorage.setItem('racePopularitySetting', val)
        setPopularity(val)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setMenuOpen(true)}>
                <IconGen size={60} backgroundColor={'none'} name={'menu-open'} iconColor={Colors.whiteInDarkMode} />
            </TouchableOpacity>
            <Modal isVisible={menuOpen}
                swipeDirection={'down'}
                onSwipeComplete={() => {
                    refreshRaces()
                    setMenuOpen(false)
                }}
                style={{
                    backgroundColor: Colors.pageBackground,
                    margin: 0,
                    marginTop: 30,
                    alignItems: undefined,
                    justifyContent: undefined,
                }}>
                <View style={styles.innerContainer}>
                    <AppText fontSize={30}>Race Settings</AppText>

                    <AppText padding={25} fontSize={25}>Allow Homebrew Races</AppText>
                    <Switch value={homeBrewAllowed} onValueChange={async () => {
                        if (homeBrewAllowed) {
                            setHomeBrewAllowed(false)
                            await AsyncStorage.setItem('showPublicRaces', "false")
                            return;
                        }
                        setHomeBrewAllowed(true)
                        await AsyncStorage.setItem('showPublicRaces', "true");
                    }} />

                    <AppText padding={25} fontSize={25}>Sort by popularity</AppText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <AppButton borderRadius={15} backgroundColor={popularity === "-1" ? Colors.pinkishSilver : Colors.lightGray} width={100} padding={5} title={'Most popular'} onPress={() => setNewPop("-1")} />
                        <AppButton borderRadius={15} backgroundColor={popularity === "1" ? Colors.pinkishSilver : Colors.lightGray} width={100} padding={5} title={'Least popular'} onPress={() => setNewPop("1")} />
                        <AppButton borderRadius={15} backgroundColor={popularity === "" ? Colors.pinkishSilver : Colors.lightGray} width={100} padding={5} title={'No preference'} onPress={() => setNewPop("")} />
                    </View>
                    <AppText padding={15} fontSize={25}>Drag down to close</AppText>
                    <IconGen size={100} backgroundColor={'none'} name={'chevron-down'} iconColor={Colors.whiteInDarkMode} />
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 10,
        right: '15%',
        top: '2%'
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});