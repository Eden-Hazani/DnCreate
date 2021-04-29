import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../../config';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import useAuthContext from '../../../hooks/useAuthContext';
import { CharacterModel } from '../../../models/characterModel';
import { WeaponModal } from '../../../models/WeaponModal';
import { removeEquippedWeapon } from './weaponFunctions';

interface Props {
    equippedWeapon: WeaponModal | null | undefined;
    openEquippedWeaponModal: Function
    removeEquipped: Function;
    character: CharacterModel;
}

export function EquippedWeapon({ equippedWeapon, openEquippedWeaponModal, removeEquipped, character }: Props) {

    const userContext = useAuthContext()

    const removeItem = async () => {
        const updatedChar = await removeEquippedWeapon(character, userContext.user?._id || '');
        removeEquipped(updatedChar)
    }

    return (
        <View style={{ alignItems: 'center', padding: 20, marginBottom: 20 }}>
            <AppText fontSize={18} color={Colors.bitterSweetRed}>Equipped Weapon</AppText>
            {equippedWeapon &&
                <View style={styles.equippedWeapon}>
                    {equippedWeapon.name === undefined || equippedWeapon.name === null ?
                        <View>
                            <AppText>No Weapon Equipped</AppText>
                        </View>
                        :
                        <View>
                            <TouchableOpacity style={{ position: 'absolute', right: 10, zIndex: 1 }}>
                                <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                    title={'Remove Weapon'} onPress={() => removeItem()} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => equippedWeapon && openEquippedWeaponModal()}>
                                <Image uri={`${Config.serverUrl}/assets/charEquipment/${equippedWeapon.image}`} style={{ height: 40, width: 40, justifyContent: "center" }} />
                                <AppText>Name: {equippedWeapon.name}</AppText>
                                <AppText>Description: {equippedWeapon.description?.substr(0, 10)}...</AppText>
                                <AppText>Damage dice: {equippedWeapon.diceAmount}-{equippedWeapon.dice}</AppText>
                                <AppText >Modifier: {equippedWeapon.modifier && equippedWeapon.modifier}</AppText>
                                {equippedWeapon.isProficient && <AppText >Proficient: {equippedWeapon.isProficient.toString()}</AppText>}
                                <AppText>Special abilities: {equippedWeapon.specialAbilities ? `${equippedWeapon.specialAbilities.substr(0, 10)}...` : "No spacial abilities"}</AppText>
                            </TouchableOpacity>
                        </View>
                    }
                </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    equippedWeapon: {
        width: '100%',
        position: "relative",
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.bitterSweetRed,
        borderRadius: 25,
        margin: 20
    },
});