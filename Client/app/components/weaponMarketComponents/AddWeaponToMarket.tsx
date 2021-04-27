import React, { Component, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, ScrollView } from 'react-native';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { AppText } from '../AppText';
import marketApi from '../../api/marketApi';
import logger from '../../../utility/logger';
import userCharApi from '../../api/userCharApi';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { AppActivityIndicator } from '../AppActivityIndicator';
import { AppForm } from '../forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../forms/AppFormField';
import { SubmitButton } from '../forms/SubmitButton';
import { updateMarketStatusFromPreviousLevels } from '../../../utility/charHallFunctions/characterStorage';
import useAuthContext from '../../hooks/useAuthContext';
import { CreateMarketPlaceAlias } from '../../screens/MarketPlace/marketplaceCompoenents/CreateMarketPlaceAlias';
import { WeaponModal } from '../../models/WeaponModal';
import { createNewWeaponMarketObj } from '../../screens/MarketPlace/functions/createMarketObj';
import { MarketWeaponItemModel } from '../../models/MarketWeaponItemModel';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window')
const Filter = require('bad-words')
const filter = new Filter();

const ValidationSchema = Yup.object().shape({
    description: Yup.string().min(20).max(500).test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).required().label("Description"),
})

interface Props {
    weapon: WeaponModal
    char_id: string
    refreshWeapons: Function
}

interface Values {
    name: string,
    description: string
}


export function AddWeaponToMarket({ weapon, char_id, refreshWeapons }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [animateStartButt, setAnimateStartButt] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 0, y: 0 }))
    const [animateForm, setAnimateForm] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 700, y: 0 }))
    const [scale, setScale] = useState<Animated.Value>(new Animated.Value(0))

    const userContext = useAuthContext()

    const submit = async (values: Values) => {
        Alert.alert("Add To Market", "This weapon will be added to the marketplace",
            [{ text: 'Yes', onPress: () => addToMarket(weapon, values) }, { text: 'No' }])
    }

    const addToMarket = async (weapon: WeaponModal, values: Values) => {
        try {
            setLoading(true)
            values.name = userContext.user?.marketplaceNickname || '';
            weapon.marketStatus = { creator_id: userContext.user?._id || '', isInMarket: true, market_id: '' }
            const marketObj = createNewWeaponMarketObj(userContext.user?._id || '', weapon, values)
            const result: any = await marketApi.addToMarket(marketObj, 'WEAP');
            if (result.data) {
                const updatedWeapon: WeaponModal = result.data.weaponInfo
                await saveWeapon(updatedWeapon, weapon._id || '');
                refreshWeapons(updatedWeapon)
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
    }

    const saveWeapon = async (weapon: WeaponModal, weapon_id: string) => {
        let weaponList = await AsyncStorage.getItem(`${char_id}WeaponList`);
        if (!weaponList) {
            return;
        }
        const newWeaponList = JSON.parse(weaponList)
        let index: number = 0
        for (let item of newWeaponList) {
            if (item._id === weapon_id) {
                newWeaponList[index] = weapon
            }
            index++
        }
        await AsyncStorage.setItem(`${char_id}WeaponList`, JSON.stringify(newWeaponList))
    }

    const handleClick = () => {
        Animated.parallel([
            Animated.timing(animateStartButt, {
                toValue: { x: 0, y: 700 },
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(animateForm, {
                toValue: { x: 0, y: 0 },
                duration: 300,
                useNativeDriver: false
            }),
            Animated.timing(scale, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }),
        ]).start();
    }


    return (
        <View style={styles.container}>
            {loading ? <AppActivityIndicator visible={loading} /> :
                <View>
                    {userContext.user?.marketplaceNickname ?
                        <View>

                            <Animated.View style={[animateStartButt.getLayout(), {
                                height: scale.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [width / 5, 0],
                                })
                            },]}>
                                <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors.paleGreen }]} onPress={() => handleClick()}>
                                    <AppText fontSize={20} textAlign={'center'}>Add Weapon To Market</AppText>
                                </TouchableOpacity>
                            </Animated.View>
                            <Animated.View style={[animateForm.getLayout(), {
                                height: scale.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, height / 1.9],
                                })
                            }]}>
                                <AppForm
                                    initialValues={{
                                        description: '',
                                    }}
                                    onSubmit={(values: Values) => submit(values)}
                                    validationSchema={ValidationSchema}>
                                    <View style={{ marginBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                        <AppFormField
                                            width={Dimensions.get('screen').width / 1.2}
                                            numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                            fieldName={"description"}
                                            iconName={"text-short"}
                                            placeholder={"Marketplace character Description..."} />
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <SubmitButton backgroundColor={Colors.paleGreen} title={"Finish"} marginBottom={1} />
                                    </View>
                                </AppForm>
                            </Animated.View>
                        </View>
                        :
                        <View>
                            <CreateMarketPlaceAlias />
                        </View>
                    }
                </View>

            }
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center'
    },
    addButton: {
        width: 300,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
    }
});