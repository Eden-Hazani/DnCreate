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
                    <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Update 1.9.3</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30}>SubClass Creator!</AppText>
                    <AppText textAlign={'center'} fontSize={25}>You can now create your very own Subclass!</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>Using DnCreate's Custom Class creator you are able to create and share your subclasses with DnCreate's community!</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>To create your first subclass go to the creation tab and DnCreate will walk you through the entire creation process</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>You have the ability to save the subclass for yourself or share it with all of DnCreate!</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30}>Shields!</AppText>
                    <AppText textAlign={'center'} fontSize={25}>Shields have been added to DnCreate!</AppText>
                    <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>You can now equip and unequip shields in the armor section!</AppText>
                </View>
                <View style={{ padding: 15 }}>
                    <AppText textAlign={'center'} fontSize={30}>DnCreate's Patreon has a new goal!</AppText>
                    <AppText textAlign={'center'} fontSize={22}>If we reach this goal I will be able to add the ability for the DM (and party members) to upload images directly into their adventure.</AppText>
                    <AppText textAlign={'center'} fontSize={22}>Plus, I will be able to add the ability to upload race portraits!.</AppText>
                    <AppText textAlign={'center'} fontSize={22}>This will enable all of you to share custom dungeon maps, city layouts, NPC faces, or just adventure memes.</AppText>
                    <AppText textAlign={'center'} fontSize={22}>If you want to help DnCreate reach this goal, please visit our Patreon page {"<3"}</AppText>
                </View>
                <AppText textAlign={'center'} fontSize={17}></AppText>
                <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }} onPress={() => { Linking.openURL('https://www.patreon.com/Edenhazani?fan_landing=true') }}>
                    <Image style={{ height: 100, width: 100 }} uri={`${Config.serverUrl}/assets/logos/patreon.png`} />
                </TouchableOpacity>
                <AppText textAlign={'center'} fontSize={20}>Thank you for using DnCreate</AppText>

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