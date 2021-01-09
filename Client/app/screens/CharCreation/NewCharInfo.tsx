import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Unsubscribe } from 'redux';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import * as Yup from 'yup';
import { SubmitButton } from '../../components/forms/SubmitButton';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppConfirmation } from '../../components/AppConfirmation';
import AsyncStorage from '@react-native-community/async-storage';
import { TriangleColorPicker, toHsv, fromHsv } from 'react-native-color-picker'
import NumberScroll from '../../components/NumberScroll';

interface NewCharInfoState {
    characterInfo: CharacterModel
    confirmed: boolean
    pickedGender: string
    colorPickWindow: boolean
    pickedEyeColor: string
    pickedHairColor: string
    pickedSkinColor: string
    pickedAge: number
    pickedHeight: number
    pickedWeight: number
    colorPickOrder: string
}

const ValidationSchema = Yup.object().shape({
    fullName: Yup.string().required().test('test-name', 'Cannot have the same same of an existing character', async function (value) {
        if (store.getState().nonUser) { return true }
        const isOffline = await AsyncStorage.getItem('isOffline');
        if (isOffline) {
            const stringedCharacters = await AsyncStorage.getItem('offLineCharacterList');
            if (!stringedCharacters) {
                return true
            }
            const characters = JSON.parse(stringedCharacters)
            for (let char of characters) {
                if (char.name === value) {
                    return false
                }
            }
            return true;
        }
        if (store.getState().nonUser) { return true }
        if (value) {
            const response = await userCharApi.validateCharName(value, this.parent.user_id);
            if (response.data) {
                return false
            } else {
                return true
            }
        }
        return true

    }).label("Full Name"),
})



export class NewCharInfo extends Component<{ route: any, navigation: any }, NewCharInfoState> {
    static contextType = AuthContext;
    private unsubscribeStore: Unsubscribe
    private scrollView: any
    constructor(props: any) {
        super(props)
        this.state = {
            pickedAge: 1,
            pickedHeight: 1,
            pickedWeight: 1,
            colorPickOrder: '',
            pickedEyeColor: '',
            pickedHairColor: '',
            pickedSkinColor: '',
            colorPickWindow: false,
            pickedGender: '',
            confirmed: false,
            characterInfo: store.getState().character
        }
        this.unsubscribeStore = store.subscribe(() => {
            store.getState().character
        })
        this.scrollView
    }

    setInfoAndContinue = (values: any) => {
        const characterInfo = { ...this.state.characterInfo };
        if (this.state.pickedGender === '') {
            alert('Please pick a gender');
        }
        characterInfo.name = values.fullName;
        characterInfo.age = this.state.pickedAge;
        characterInfo.height = this.state.pickedHeight;
        characterInfo.weight = this.state.pickedWeight;
        characterInfo.eyes = this.state.pickedEyeColor
        characterInfo.skin = this.state.pickedSkinColor;
        characterInfo.hair = this.state.pickedHairColor;
        characterInfo.gender = this.state.pickedGender;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
        })
        setTimeout(() => {
            this.props.navigation.navigate("ClassPick", { race: this.props.route.params.race })
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    componentWillUnmount() {
        this.unsubscribeStore()
    }


    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always" ref={view => this.scrollView = view}>
                <View style={styles.container}>
                    {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                        <View>
                            <AppText textAlign={'center'} fontSize={20}>{this.state.characterInfo.race}</AppText>
                            <AppForm
                                initialValues={{ fullName: store.getState().character.name, user_id: store.getState().nonUser ? null : this.context.user._id }}
                                onSubmit={(values: any) => this.setInfoAndContinue(values)}
                                validationSchema={ValidationSchema}>
                                <View style={{ paddingBottom: 15 }}>
                                    <AppFormField
                                        style={{ width: Dimensions.get('screen').width }}
                                        fieldName={"fullName"}
                                        name="fullName"
                                        moveToErrorPosition={() => this.scrollView.scrollTo({ x: 0, y: 0, animated: true })}
                                        iconName={"text-short"}
                                        placeholder={"Character Full Name..."} />
                                    <View style={{ paddingLeft: 35, paddingRight: 35, paddingBottom: 10 }}>
                                        <AppText fontSize={19} textAlign={'center'}>Slide the numbers to pick your character's information.</AppText>
                                        <AppText fontSize={16} textAlign={'center'}>You can also click the number to manually input.</AppText>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingLeft: 20, paddingRight: 20 }}>
                                        <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 50 }}>
                                            <AppText textAlign={'center'} fontSize={18}>Age</AppText>
                                            <NumberScroll max={5000} getValue={(val: any) => {
                                                this.setState({ pickedAge: val.viewableItems[0].item })
                                            }} />
                                        </View>

                                        <View style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 50 }}>
                                            <AppText textAlign={'center'} fontSize={18}>Height</AppText>
                                            <NumberScroll max={450} getValue={(val: any) => {
                                                this.setState({ pickedHeight: val.viewableItems[0].item })
                                            }} />
                                        </View>
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 15, paddingBottom: 10 }}>
                                        <View style={{ width: Dimensions.get('window').width / 2, borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 50 }}>
                                            <AppText textAlign={'center'} fontSize={18}>Weight</AppText>
                                            <NumberScroll max={1000} getValue={(val: any) => {
                                                this.setState({ pickedWeight: val.viewableItems[0].item })
                                            }} />
                                        </View>
                                    </View>



                                    <AppButton highlightText={true} backgroundColor={this.state.pickedEyeColor ? this.state.pickedEyeColor : Colors.lightGray} width={110} height={110} borderRadius={110}
                                        title={'Pick Eye Color'} onPress={() => { this.setState({ colorPickWindow: true, colorPickOrder: "pickedEyeColor" }) }} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>

                                        <AppButton highlightText={true} backgroundColor={this.state.pickedHairColor ? this.state.pickedHairColor : Colors.lightGray} width={110} height={110} borderRadius={110}
                                            title={'Pick Hair Color'} onPress={() => { this.setState({ colorPickWindow: true, colorPickOrder: "pickedHairColor" }) }} />

                                        <AppButton highlightText={true} backgroundColor={this.state.pickedSkinColor ? this.state.pickedSkinColor : Colors.lightGray} width={110} height={110} borderRadius={110}
                                            title={'Pick Skin Color'} onPress={() => { this.setState({ colorPickWindow: true, colorPickOrder: "pickedSkinColor" }) }} />
                                    </View>

                                    <AppText fontSize={20} textAlign={'center'}>Gender</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <AppButton backgroundColor={this.state.pickedGender === "Male" ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                            title={'Male'} onPress={() => { this.setState({ pickedGender: "Male" }) }} />
                                        <AppButton backgroundColor={this.state.pickedGender === "Female" ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                            title={'Female'} onPress={() => { this.setState({ pickedGender: "Female" }) }} />
                                        <AppButton backgroundColor={this.state.pickedGender === "Other" ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                            title={'Other'} onPress={() => { this.setState({ pickedGender: "Other" }) }} />
                                    </View>
                                </View>
                                <SubmitButton title={"Continue"} />
                            </AppForm>
                            <Modal visible={this.state.colorPickWindow} animationType="slide">
                                <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                                    <TriangleColorPicker
                                        defaultColor={this.state[this.state.colorPickOrder]}
                                        hideControls={true}
                                        onColorChange={(color) => {
                                            const pickedColor = fromHsv(color)
                                            this.setState({ [this.state.colorPickOrder]: pickedColor } as any)
                                        }}
                                        style={{ flex: .5 }}
                                    />
                                    <AppText textAlign={'center'}>Pick Color</AppText>
                                    <AppButton backgroundColor={this.state[this.state.colorPickOrder] ? this.state[this.state.colorPickOrder] : Colors.lightGray} width={150} height={80} borderRadius={25}
                                        title={'Pick Color'} onPress={() => { this.setState({ colorPickWindow: false }) }} />
                                </View>
                            </Modal>
                        </View>}
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        alignItems: "center"
    },
    item: {

    }
});