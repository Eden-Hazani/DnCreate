import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, ScrollView } from 'react-native';
import { Colors } from '../../config/colors';
import { AppText } from '../AppText';
import marketApi from '../../api/marketApi';
import logger from '../../../utility/logger';
import { AppActivityIndicator } from '../AppActivityIndicator';
import { AppForm } from '../forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../forms/AppFormField';
import { SubmitButton } from '../forms/SubmitButton';
import useAuthContext from '../../hooks/useAuthContext';
import { CreateMarketPlaceAlias } from '../../screens/MarketPlace/marketplaceCompoenents/CreateMarketPlaceAlias';
import { createNewSpellMarketOb } from '../../screens/MarketPlace/functions/createMarketObj';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomSpellModal } from '../../models/CustomSpellModal';

const { height, width } = Dimensions.get('window')
const Filter = require('bad-words')
const filter = new Filter();

const ValidationSchema = Yup.object().shape({
    description: Yup.string().min(5).max(500).test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).required().label("Description"),
})

interface Props {
    spell: CustomSpellModal
    refreshSpells: Function
}

interface Values {
    name: string,
    description: string
}


export function AddSpellToMarket({ spell, refreshSpells }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [animateStartButt, setAnimateStartButt] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 0, y: 0 }));
    const [animateForm, setAnimateForm] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 700, y: 0 }));
    const [scale, setScale] = useState<Animated.Value>(new Animated.Value(0));

    const userContext = useAuthContext()

    const submit = async (values: Values) => {
        Alert.alert("Add To Market", "This spell will be added to the marketplace",
            [{ text: 'Yes', onPress: () => addToMarket(spell, values) }, { text: 'No' }])
    }

    const addToMarket = async (spell: CustomSpellModal, values: Values) => {
        try {
            setLoading(true)
            values.name = userContext.user?.marketplaceNickname || '';
            spell.marketStatus = { creator_id: userContext.user?._id || '', isInMarket: true, market_id: '' }
            const marketObj = createNewSpellMarketOb(userContext.user?._id || '', spell, values)
            const result: any = await marketApi.addToMarket(marketObj, 'SPELL');
            if (result.data) {
                const updatedSpell: CustomSpellModal = result.data.spell
                await saveSpell(updatedSpell, spell._id || '');
                refreshSpells(updatedSpell)
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
    }

    const saveSpell = async (spell: CustomSpellModal, spell_id: string) => {
        const stringedCustomSpells = await AsyncStorage.getItem('customSpellList');
        if (!stringedCustomSpells) {
            return;
        }
        const newSpellList = JSON.parse(stringedCustomSpells)
        let index: number = 0
        for (let item of newSpellList) {
            if (item._id === spell_id) {
                newSpellList[index] = spell
            }
            index++
        }
        await AsyncStorage.setItem('customSpellList', JSON.stringify(newSpellList))
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
                                    <AppText fontSize={20} textAlign={'center'}>Add Spell To Market</AppText>
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
                                            placeholder={"Marketplace spell Description..."} />
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