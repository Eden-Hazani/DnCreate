import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';

interface Props {
    canDownload: boolean
    closeModel: Function
    addCharacter: Function
}

export function MarketItemPageButtons({ canDownload, closeModel, addCharacter }: Props) {


    return (
        <View style={styles.container}>
            {canDownload && <AppText textAlign={'center'} fontSize={18} padding={15} color={Colors.paleGreen}>You already have this character in your character hall.</AppText>}
            <View style={styles.downBlock}>
                <AppButton title={'Add Character'} borderRadius={15} disabled={canDownload}
                    backgroundColor={Colors.pinkishSilver} width={150} height={50} onPress={() => addCharacter()} />
                <AppButton borderRadius={15} title={'Close'} backgroundColor={Colors.pinkishSilver} width={150} height={50} onPress={() => closeModel()} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    downBlock: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
    }
});