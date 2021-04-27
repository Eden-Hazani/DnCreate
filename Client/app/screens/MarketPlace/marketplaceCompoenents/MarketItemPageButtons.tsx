import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';

interface Props {
    canDownload: { error: string, description: string }
    closeModel: Function
    addItem: Function
}

export function MarketItemPageButtons({ canDownload, closeModel, addItem }: Props) {


    return (
        <View style={styles.container}>
            {canDownload.error === 'MATCH_ID' && <AppText textAlign={'center'} fontSize={18} padding={15} color={Colors.paleGreen}>{canDownload.description}</AppText>}
            {canDownload.error === 'MATCH_NAME' && <AppText textAlign={'center'} fontSize={18} padding={15} color={Colors.paleGreen}>{canDownload.description}</AppText>}
            <View style={styles.downBlock}>
                <AppButton title={'Add Item'} borderRadius={15} disabled={canDownload.error !== 'OK'}
                    backgroundColor={Colors.pinkishSilver} width={150} height={50} onPress={() => addItem()} />
                <AppButton borderRadius={15} title={'Close'} backgroundColor={Colors.pinkishSilver} width={150} height={50} onPress={() => closeModel()} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    },
    downBlock: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
    }
});