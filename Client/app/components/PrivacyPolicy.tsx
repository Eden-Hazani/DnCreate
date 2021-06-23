import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../config/colors';
import { AppButton } from './AppButton';
import { AppText } from './AppText'
import * as Linking from 'expo-linking';

export function PrivacyPolicy() {
    return (
        <ScrollView style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center', paddingTop: '10%', paddingBottom: '5%' }}>
                <AppText fontSize={22}>Your Privacy Is Important To Us</AppText>
                <View style={{ backgroundColor: Colors.metallicBlue, padding: 15, borderRadius: 25, marginLeft: 10, marginRight: 10 }}>
                    <AppText color={Colors.totalWhite} fontSize={16}>DnCreate uses your account information for registration and authorization purposes only</AppText>
                    <AppText color={Colors.totalWhite} fontSize={16}>The information collected upon registration your email address and it is stored within the DnCreate server</AppText>
                    <AppText color={Colors.totalWhite} fontSize={16}>(in case of using the google sign-in feature your google profile picture link will also be collected)</AppText>
                    <AppText color={Colors.totalWhite} fontSize={16}>Permission to access your device media library is solely for the ability to allow you tp upload images to DnCreate to share with your friends</AppText>
                </View>
                <AppText fontSize={30} textAlign={'center'} color={Colors.bitterSweetRed}>Remember!</AppText>
                <AppText fontSize={22} textAlign={'center'}>You always have the option to remove all of your information from the DnCreate servers. that can be done in one of two ways:</AppText>
                <View style={{ backgroundColor: Colors.earthYellow, marginBottom: 10, padding: 5, borderRadius: 25, marginLeft: 10, marginRight: 10 }}>
                    <AppText color={Colors.totalWhite} fontSize={16}> - Sending us an email to dncreateteam@gmail.com with a request to remove all of your information from our servers.</AppText>
                </View>
                <View style={{ backgroundColor: Colors.orange, marginBottom: 10, padding: 5, borderRadius: 25, marginLeft: 10, marginRight: 10 }}>
                    <AppText color={Colors.totalWhite} paddingBottom={5} fontSize={16} > - Deleting your account yourself with the delete account option in the settings menu of the account page here in the app.</AppText>
                </View>
                <AppText fontSize={22} textAlign={'center'}>If you wish to read the full privacy policy of DnCreate please tap on the button below</AppText>

                <TouchableOpacity style={{ backgroundColor: Colors.paleGreen, padding: 25, borderRadius: 10 }} onPress={() => { Linking.openURL('https://eden-hazani.github.io/DnCreatePrivacyPolicy/') }}>
                    <AppText fontSize={22} color={Colors.totalWhite}>Full Privacy Policy</AppText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: '15%',
    }
});