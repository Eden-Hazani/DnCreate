import React, { Component } from 'react';
import { View, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export class UpdateMessage extends Component<{ close: any }> {
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Update 1.9.4</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Patreon Supporters!</AppText>
                    <AppText textAlign={'center'} fontSize={25} >Starting the update with a huge thanks to:</AppText>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.deepGold}>JoinedForSteampunk</AppText>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.deepGold}>BigK_Games</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>For donating and contributing to the future of DnCreate</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.berries}>DnCreate has reached it's first Patreon goal!</AppText>
                    <AppText textAlign={'center'} fontSize={25} color={Colors.berries}>Adventure mode now features the Image Gallery!</AppText>
                    <AppText textAlign={'center'} fontSize={20}>You as the DM or as a participating member can upload any images you want into your adventure for your fellow adventurers to see!</AppText>
                    <AppText textAlign={'center'} fontSize={20}>share maps, monsters, stats, landscapes, or just memes with your entire party</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.berries}>Improved feats!</AppText>
                    <AppText textAlign={'center'} fontSize={22}>The ability to add skill, tool, and saving throw proficiencies has now been added on acquiring a new feat</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.berries}>Character Appearance</AppText>
                    <AppText textAlign={'center'} fontSize={22}>You can now add the appearance of your character in the character creation process (you can always change your current appearance from the character sheet)</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.berries}>Character Alignment</AppText>
                    <AppText textAlign={'center'} fontSize={22}>You can now add the alignment of your character in the character creation process (you can always change your current alignment from the character sheet)</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30} color={Colors.berries}>Item Description</AppText>
                    <AppText textAlign={'center'} fontSize={22}>You can now add description to your items to provide more depth.</AppText>
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