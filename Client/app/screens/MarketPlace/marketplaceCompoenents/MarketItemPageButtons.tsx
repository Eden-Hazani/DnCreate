import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';

interface Props {
    canDownload: string
    closeModel: Function
    addCharacter: Function
}

export function MarketItemPageButtons({ canDownload, closeModel, addCharacter }: Props) {


    return (
        <View style={styles.container}>

            {canDownload === 'MATCH_ID' && <AppText textAlign={'center'} fontSize={18} padding={15} color={Colors.paleGreen}>You already have this character in your character hall.</AppText>}
            {canDownload === 'MATCH_NAME' && <AppText textAlign={'center'} fontSize={18} padding={15} color={Colors.paleGreen}>You already have a character with the same name in your hall, if you wish to claim this character you will need to remove the character with the same name in your hall.</AppText>}
            <View style={styles.downBlock}>
                <AppButton title={'Add Character'} borderRadius={15} disabled={canDownload !== 'OK'}
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