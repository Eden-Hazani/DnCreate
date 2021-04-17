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
import createNewMarketObj from '../../../utility/charHallFunctions/createMarketObj';
import { updateMarketStatusFromPreviousLevels } from '../../../utility/charHallFunctions/characterStorage';

const { height, width } = Dimensions.get('window')
const Filter = require('bad-words')
const filter = new Filter();

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).label("Name"),
    description: Yup.string().test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).matches(/^.{50,500}$/, "Must be 50-500 Characters").required().label("Description"),
})

interface Props {
    character: CharacterModel
    index: number
}

interface Values {
    name: string,
    description: string
}


export function AddCharToMarket({ character, index }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [animateStartButt, setAnimateStartButt] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 0, y: 0 }))
    const [animateForm, setAnimateForm] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 700, y: 0 }))
    const [scale, setScale] = useState<Animated.Value>(new Animated.Value(0))

    const submit = async (values: Values) => {
        Alert.alert("Add To Market", "This character will be added to the market at it's current level including backstory, traits, abilities, magic, and more. ",
            [{ text: 'Yes', onPress: () => addToMarket(values) }, { text: 'No' }])
    }

    const addToMarket = async (values: Values) => {
        try {
            setLoading(true)
            const updatedMarketCharData = await userCharApi.getChar(character._id || '');
            const updatedMarketChar = updatedMarketCharData.data;

            if (updatedMarketChar) {
                updatedMarketChar.marketStatus = { creator_id: character.user_id || '', isInMarket: true, market_id: '' }
                const marketObj = await createNewMarketObj(updatedMarketChar, values)
                const result = await marketApi.addCharToMarket(marketObj);

                if (result.data) {
                    updatedMarketChar.marketStatus = { creator_id: character.user_id || '', isInMarket: true, market_id: result.data }
                    const charResult = await userCharApi.updateCharacterAndReturnInfo(updatedMarketChar);
                    store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: index, character: charResult.data } })
                    await updateMarketStatusFromPreviousLevels(updatedMarketChar, { creator_id: character.user_id || '', isInMarket: true, market_id: result.data })
                }
                setLoading(false)
            }
        } catch (err) {
            setLoading(false)
            logger.log(err)
        }
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
                <View >
                    <Animated.View style={[animateStartButt.getLayout(), {
                        height: scale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [width / 5, 0],
                        })
                    },]}>
                        <TouchableOpacity style={[styles.addButton, { backgroundColor: Colors.paleGreen }]} onPress={() => handleClick()}>
                            <AppText fontSize={20} textAlign={'center'}>Add Character To Market</AppText>
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
                                name: '',
                                description: '',
                            }}
                            onSubmit={(values: Values) => submit(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.2}
                                    fieldName={"name"}
                                    iconName={"text-short"}
                                    placeholder={"Your alias..."} />
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