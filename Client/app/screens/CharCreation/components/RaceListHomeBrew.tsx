import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';

interface Props {
    close: () => Promise<void>
}

export function RaceListHomeBrew({ close }: Props) {
    const [homeBrewRaces, setHomebrewRaces] = useState<boolean>(false)
    const [homebrewSubclass, setHomebrewSubclass] = useState<boolean>(false)

    return (
        <View style={{ flex: 1, backgroundColor: Colors.pageBackground, justifyContent: "center", alignItems: "center" }}>
            <AppText textAlign={'center'} fontSize={25}>HomeBrew!</AppText>
            <Image uri={`${Config.serverUrl}/assets/specificDragons/backstoryDragon.png`} style={{ width: 150, height: 150 }} />
            <AppText textAlign={'center'} fontSize={17}>DnCreate has been built with the focus of community sharing.</AppText>
            <AppText textAlign={'center'} fontSize={17}>If you wish to expand your race and subclass options it is highly recommended to enable Homebrew creations</AppText>

            <AppText padding={10} textAlign={'center'} fontSize={17}>Allow Homebrew Races</AppText>
            <Switch value={homeBrewRaces} onValueChange={async () => {
                if (homeBrewRaces) {
                    setHomebrewRaces(false)
                    await AsyncStorage.setItem('showPublicRaces', "false")
                    return;
                }
                setHomebrewRaces(true)
                await AsyncStorage.setItem('showPublicRaces', "true");
            }} />

            <AppText padding={10} textAlign={'center'} fontSize={17}>Allow Homebrew SubClasses</AppText>
            <Switch value={homebrewSubclass} onValueChange={async () => {
                if (homebrewSubclass) {
                    setHomebrewSubclass(false)
                    await AsyncStorage.setItem('showPublicSubClasses', "false")
                    return;
                }
                setHomebrewSubclass(true)
                await AsyncStorage.setItem('showPublicSubClasses', "true");
            }} />

            <AppText padding={10} textAlign={'center'} fontSize={17}>You can always change these settings in the account page</AppText>
            <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => close()}
                fontSize={18} borderRadius={25} width={120} height={65} title={"Let's Start!"} />
        </View>
    )
}


const styles = StyleSheet.create({

});