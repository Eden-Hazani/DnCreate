import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import InformationScroller from '../../../components/InformationScroller';
import marketPlaceInfo from '../../../../jsonDump/marketPlaceInformation.json';
import { firstMarketPlaceUse, setFirstMarketPlaceUse } from '../functions/storageFunctions';
import AsyncStorage from '@react-native-community/async-storage';



export function WelcomeToMarket() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    useEffect(() => {
        checkOpenStatus();
    }, [])

    const checkOpenStatus = async () => {
        await AsyncStorage.removeItem('isMarketPlaceFirstUse')
        setIsOpen(await firstMarketPlaceUse())
    }

    return (
        <Modal visible={isOpen}>
            <InformationScroller list={marketPlaceInfo.list} PressClose={async (val: boolean) => {
                setFirstMarketPlaceUse();
                setIsOpen(false)
            }} />
        </Modal>
    )
}


const styles = StyleSheet.create({
    container: {

    }
});