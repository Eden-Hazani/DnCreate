import React, { Component, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Config } from '../../../../config';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import useAuthContext from '../../../hooks/useAuthContext';
import { CharacterModel } from '../../../models/characterModel';
import { WeaponModal } from '../../../models/WeaponModal';
import { checkMarketWeaponValidity } from '../../MarketPlace/functions/marketInteractions';
import { equipWeapon, removeWeapon } from './weaponFunctions';

interface Props {
    weaponList: WeaponModal[];
    sendEquippedCharacter: Function;
    character: CharacterModel;
    startEditWeapon: Function;
    refreshList: Function;
    setPickedWeapon: Function;
}

export function WeaponList({ weaponList, sendEquippedCharacter, character, startEditWeapon, refreshList, setPickedWeapon }: Props) {

    const [loading, setLoading] = useState<boolean>(false)
    const userAuth = useAuthContext()

    const startEquipWeapon = async (weapon: WeaponModal) => {
        setLoading(true)
        const newCharacter = await equipWeapon(weapon, character, userAuth.user?._id || '');
        sendEquippedCharacter(newCharacter);
        setLoading(false)
    }


    const marketValidity = (weapon: WeaponModal) => {
        const validity = checkMarketWeaponValidity(weapon.marketStatus, userAuth.user?._id || '');
        if (validity === 'NOT_OWNED') return <AppText color={Colors.deepGold}>Market - Not Owned</AppText>
        if (validity === 'OWNED_NOT_PUBLISHED') return <AppText color={Colors.danger}>Market - Not Published</AppText>
        if (validity === 'OWNED_PUBLISHED') return <AppText color={Colors.paleGreen}>Market - Published</AppText>
    }

    const removeWeaponForRefresh = async (weapon: WeaponModal) => {
        await removeWeapon(weapon._id ? weapon._id : '', character);
        refreshList();
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            {weaponList.map(weapon =>
                <View key={weapon._id} style={styles.weaponUnit}>
                    {loading ? <View style={{ width: 150, position: 'absolute', right: 10, marginTop: 15 }}>
                        <AppActivityIndicator visible={loading} />
                    </View> :
                        <View style={{ position: 'absolute', right: 10, zIndex: 1, marginTop: 15 }}>
                            <TouchableOpacity style={{ marginBottom: 15, zIndex: 1 }}>
                                <AppButton backgroundColor={Colors.bitterSweetRed} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                    title={'Equip Weapon'} onPress={() => { startEquipWeapon(weapon) }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginBottom: 15, zIndex: 1 }}>
                                <AppButton backgroundColor={Colors.earthYellow} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                    title={'Edit Weapon'} onPress={() => startEditWeapon(weapon)} />
                            </TouchableOpacity>
                            {weapon.removable ?
                                <TouchableOpacity style={{ marginBottom: 15, zIndex: 1 }}>
                                    <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Delete Weapon'} onPress={() => { removeWeaponForRefresh(weapon) }} />
                                </TouchableOpacity>
                                :
                                <View>
                                    <AppText color={Colors.danger} fontSize={16}>This Weapon is not removable</AppText>
                                </View>
                            }
                        </View>
                    }
                    <TouchableOpacity style={{ width: '65%' }} onPress={() => setPickedWeapon(weapon)}>
                        <Image uri={`${Config.serverUrl}/assets/charEquipment/${weapon.image}`} style={{ height: 40, width: 40, justifyContent: "center" }} />
                        <AppText fontSize={16}>Name: {weapon.name}</AppText>
                        <AppText fontSize={16}>Damage dice: {weapon.diceAmount}-{weapon.dice}</AppText>
                        <AppText fontSize={16}>Description: {weapon.description?.substr(0, 10)}...</AppText>
                        <AppText fontSize={16}>Modifier: {weapon.modifier && weapon.modifier}</AppText>
                        {weapon.isProficient && <AppText >Proficient: {weapon.isProficient.toString()}</AppText>}
                        <AppText fontSize={16}>{weapon.specialAbilities ? `Special abilities: ${weapon.specialAbilities.substr(0, 10)}...` : "No spacial abilities"}</AppText>
                        {marketValidity(weapon)}
                    </TouchableOpacity>
                </View>)}
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    weaponUnit: {
        flex: 1,
        height: 220,
        padding: 15,
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 25,
        margin: 2
    }
});