import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import * as Linking from 'expo-linking';

export class UpdateMessage extends Component<{ close: any }> {
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Update 2.0</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Patreon Supporters!</AppText>
                    <AppText textAlign={'center'} fontSize={25} >Starting the update with a huge thanks to:</AppText>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.deepGold}>JoinedForSteampunk</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>For donating and contributing to the future of DnCreate</AppText>
                </View>
                <View style={{ padding: 15, justifyContent: "center", alignItems: "center" }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.paleGreen}>The Marketplace!</AppText>
                    <Image uri={`${Config.serverUrl}/assets/specificDragons/marketPlaceDragon1.png`} style={{ height: 150, width: 150 }} />
                    <AppText textAlign={'center'} fontSize={25} >After a long development phase, the marketplace is finally out!</AppText>
                    <AppText textAlign={'center'} fontSize={25} >Everyone on DnCreate can now not only create things but share them as well!</AppText>
                    <AppText textAlign={'center'} fontSize={25} >From the character hall you can now upload your character to the market and offer it to the DnCreate community</AppText>
                    <AppText textAlign={'center'} fontSize={25} >Share builds, races, unique backstories and more!</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.berries}>Major bug fixes and improvements!</AppText>
                    <AppText textAlign={'center'} fontSize={20}>2.0 includes a major update to DnCreates infrastructure, many of the glitches and bugs are now gone!</AppText>
                </View>

                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.deepGold}>Patreon Donations</AppText>
                    <AppText textAlign={'center'} fontSize={22}>As always, any donation to DnCreate is greatly appreciated.</AppText>
                    <AppText textAlign={'center'} fontSize={22}>With more donations I can expand server storage to include more and more features for everyone on DnCreate.</AppText>
                </View>
                <AppText textAlign={'center'} fontSize={17}></AppText>
                <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }} onPress={() => { Linking.openURL('https://www.patreon.com/Edenhazani?fan_landing=true') }}>
                    <Image style={{ height: 100, width: 100 }} uri={`${Config.serverUrl}/assets/logos/patreon.png`} />
                </TouchableOpacity>
                <AppText textAlign={'center'} fontSize={20}>And as always, Thank you for using DnCreate</AppText>

                <AppButton padding={20} borderRadius={15} width={150} height={50} backgroundColor={Colors.bitterSweetRed}
                    title={"Close"} textAlign={"center"} fontSize={15} onPress={() => { this.props.close(false) }} />

            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});