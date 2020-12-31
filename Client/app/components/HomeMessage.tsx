import React, { Component } from 'react';
import { View, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../config';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText';

export class HomeMessage extends Component<{ close: any }> {
    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Hello!</AppText>
                <AppText textAlign={'center'} fontSize={17}>As you have probably seen I have removed all ads from DnCreate.</AppText>
                <AppText textAlign={'center'} fontSize={25}>Yay!</AppText>

                <AppText textAlign={'center'} fontSize={17}>But they are coming back...</AppText>
                <AppText textAlign={'center'} fontSize={17}>I hate the fact of needing to monetize this app, but server maintenance and my actual time spent developing this app
                    (developing alone) are starting to cost more and more money..</AppText>
                <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>As the user base of DnCreate grows so do the server fees, in addition to that I am adding more and more online
                    features such as the recently added Quest system.</AppText>
                <AppText textAlign={'center'} fontSize={17}>And I can promise you there is tons of more stuff to come.</AppText>

                <AppText textAlign={'center'} fontSize={30}>So to the point.</AppText>
                <AppText textAlign={'center'} fontSize={20}>The ads are going to be disabled for about two weeks, to give everyone a better experience with DnCreate, after that the ads will return.</AppText>
                <AppText textAlign={'center'} fontSize={20}>For those of you that hate ads, I have opened a Patreon account with a tier that can permanently disable ads.</AppText>
                <AppText textAlign={'center'} fontSize={17}>(plus other tiers if you like my work and want to support me, huge thanks in advance)</AppText>
                <TouchableOpacity style={{ padding: 10, justifyContent: "center", alignItems: "center" }} onPress={() => { Linking.openURL('https://www.patreon.com/Edenhazani?fan_landing=true') }}>
                    <Image style={{ height: 100, width: 100 }} uri={`${Config.serverUrl}/assets/logos/patreon.png`} />
                </TouchableOpacity>
                <AppText textAlign={'center'} fontSize={20}>On a final note, DnCreate's core features will</AppText>
                <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>ALWAYS BE FREE TO USE</AppText>
                <AppText textAlign={'center'} fontSize={20}>I hate paywalls and limiting people just because they cant afford it or just don't want to pay right now.</AppText>
                <AppText textAlign={'center'} fontSize={20}>I will never make you pay for the number of characters you have or the number of adventures you open with friends</AppText>

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