import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';

export function DmNoPremium({ close }: any) {
    return (
        <View style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
            <AppText textAlign={'center'} padding={15} fontSize={22}>Adventure chat is a premium feature</AppText>
            <AppText textAlign={'center'} fontSize={18}>If you wish for your entire party to have access to adventure chat please visit our Patreon and consider donating to DnCreate</AppText>
            <AppText textAlign={'center'} padding={15} fontSize={18}>Thanks for understanding :)</AppText>
            <AppButton title={'close'} padding={10} borderRadius={15} width={70} height={50} backgroundColor={Colors.bitterSweetRed} onPress={() => close()} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});