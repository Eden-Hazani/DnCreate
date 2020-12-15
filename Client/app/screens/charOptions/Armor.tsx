import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Switch, Modal, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import * as Yup from 'yup';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import userCharApi from '../../api/userCharApi';
import { EquippedArmorModel } from '../../models/EquippedArmorModel';
import { armorBonusCalculator } from './helperFunctions/armorBonusCalculator';
import AuthContext from '../../auth/context';


const ValidationSchema = Yup.object().shape({
    armorName: Yup.string().required().label("Name"),
    armorAc: Yup.number().required().typeError('Ac is required and must be a number').label("Ac")
})

interface ArmorState {
    heavyArmor: boolean
    mediumArmor: boolean
    lightArmor: boolean
    armorList: any[]
    dexModifier: boolean
    disadvantageStealth: boolean
    character: CharacterModel
    tutorialOn: boolean
    armorType: string
    addArmor: boolean
}

export class Armor extends Component<{ navigation: any, route: any }, ArmorState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            addArmor: false,
            armorType: '',
            heavyArmor: false,
            lightArmor: false,
            mediumArmor: false,
            tutorialOn: false,
            dexModifier: false,
            disadvantageStealth: false,
            armorList: [],
            character: this.props.route.params.char
        }
    }
    async componentDidMount() {
        const armorList = await AsyncStorage.getItem(`${this.state.character._id}ArmorList`);
        if (armorList) {
            this.setState({ armorList: JSON.parse(armorList) })
        }
    }

    validateArmor = () => {
        if (this.state.heavyArmor === false && this.state.lightArmor === false && this.state.mediumArmor === false) {
            return false;
        }
        return true;

    }

    addArmor = async (values: any) => {
        if (!this.validateArmor()) {
            alert('Must pick armor type');
            return;
        }
        let armorName = values.armorName;
        let armorAc = values.armorAc;
        const armor: any = {
            id: armorName + Math.floor((Math.random() * 1000000) + 1),
            name: armorName,
            ac: armorAc,
            baseAc: armorAc,
            disadvantageStealth: this.state.disadvantageStealth,
            armorType: this.state.armorType,
            armorBonusesCalculationType: this.state.armorType,
            removable: true
        }
        let armorList = await AsyncStorage.getItem(`${this.state.character._id}ArmorList`);
        if (!armorList) {
            const armorList = [armor]
            AsyncStorage.setItem(`${this.state.character._id}ArmorList`, JSON.stringify(armorList))
            this.setState({ armorList: armorList, lightArmor: false, mediumArmor: false, heavyArmor: false, addArmor: false })
            return;
        }
        const newArmorList = JSON.parse(armorList)
        newArmorList.push(armor)
        AsyncStorage.setItem(`${this.state.character._id}ArmorList`, JSON.stringify(newArmorList))
        this.setState({ addArmor: false, armorList: newArmorList, lightArmor: false, mediumArmor: false, heavyArmor: false });

    }
    removeSet = async (setId: string) => {
        let armorList = await AsyncStorage.getItem(`${this.state.character._id}ArmorList`);
        if (armorList) {
            let newArmorList = JSON.parse(armorList)
            newArmorList = newArmorList.filter((armor: any) => armor.id !== setId);
            AsyncStorage.setItem(`${this.state.character._id}ArmorList`, JSON.stringify(newArmorList))
            this.setState({ armorList: newArmorList });
        }
    }
    removeEquippedSet = () => {
        const character = { ...this.state.character };
        character.equippedArmor = {
            id: '1',
            name: 'No Armor Equipped',
            ac: 10,
            baseAc: 10,
            armorBonusesCalculationType: 'none',
            disadvantageStealth: false,
            armorType: 'none'
        }
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            if (this.context.user._id === "Offline") {
                this.updateOfflineCharacter();
                return;
            }
            userCharApi.updateChar(this.state.character);
        });
    }

    updateOfflineCharacter = async () => {
        const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
        if (stringifiedChars) {
            const characters = JSON.parse(stringifiedChars);
            for (let index in characters) {
                if (characters[index]._id === this.state.character._id) {
                    characters[index] = this.state.character;
                    break;
                }
            }
            await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
        }
    }

    equipSet = (set: EquippedArmorModel) => {
        if (set.baseAc) {
            const newSet = JSON.parse(JSON.stringify(set))
            const character = { ...this.state.character };
            newSet.ac = +set.baseAc;
            character.equippedArmor = newSet;
            this.setState({ character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                if (this.context.user._id === "Offline") {
                    this.updateOfflineCharacter();
                    return;
                }
                userCharApi.updateChar(this.state.character)
            });
        }
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ alignItems: 'center', padding: 20, marginBottom: 20 }}>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>Equipped Armor Set</AppText>
                    {this.state.character.equippedArmor &&
                        <View style={styles.equippedArmor}>
                            {this.state.character.equippedArmor.name === 'No Armor Equipped' ? null :
                                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                                    <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Remove Set'} onPress={() => { this.removeEquippedSet() }} />
                                </TouchableOpacity>
                            }
                            <View>
                                <AppText>Name: {this.state.character.equippedArmor.name}</AppText>
                                <AppText>Type: {this.state.character.equippedArmor.armorType}</AppText>
                                <AppText>AC: {this.state.character.equippedArmor.ac}</AppText>
                            </View>
                        </View>}
                </View>
                <View>
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25} disabled={this.props.route.params.isDm}
                        title={'Add Armor Set'} onPress={() => { this.setState({ addArmor: true }) }} />
                </View>
                <Modal visible={this.state.addArmor}>
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <AppText textAlign={'center'} fontSize={30} color={Colors.bitterSweetRed}>Add new armor to inventory</AppText>
                        <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                            title={'tutorial'} onPress={() => { this.setState({ tutorialOn: true }) }} />
                        <View style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
                            <View style={{ marginBottom: 20 }}>
                                <AppText fontSize={20} textAlign={'center'}>As a {this.state.character.characterClass} you have the following armor proficiencies:</AppText>
                            </View>
                            <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 10, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                {this.state.character.characterClassId && this.state.character.characterClassId.armorProficiencies && this.state.character.characterClassId.armorProficiencies.map((item: any) =>
                                    <View key={item} style={{ margin: 5, backgroundColor: Colors.bitterSweetRed, padding: 5, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                        <AppText fontSize={18} textAlign={'center'}>{item}</AppText>
                                    </View>)}
                            </View>
                            <View style={{ marginTop: 20, marginBottom: 20 }}>
                                <AppText fontSize={20} textAlign={'center'}>You also gained the following armor proficiencies from your path, race, or special events in your adventure:</AppText>
                            </View>
                            <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 10, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                {this.state.character.addedArmorProf && this.state.character.addedArmorProf.map((item: any, index: number) =>
                                    <View key={index} style={{ margin: 5, backgroundColor: Colors.bitterSweetRed, padding: 5, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                        <AppText fontSize={18} textAlign={'center'}>{item}</AppText>
                                    </View>)}
                            </View>
                        </View>
                        <Modal visible={this.state.tutorialOn} >
                            <View style={{ alignItems: "center", padding: 20, backgroundColor: Colors.pageBackground }}>
                                <AppText fontSize={18} textAlign={'center'}>There are three departments of armor</AppText>
                                <AppText padding={17} fontSize={18}>Heavy Armor</AppText>
                                <AppText textAlign={'center'} fontSize={15}>Of all the armor categories, Heavy Armor offers the best Protection. These suits of armor cover the entire body and are designed to stop a wide range of attacks.</AppText>
                                <AppText padding={15} textAlign={'center'} fontSize={18}>Medium Armor</AppText>
                                <AppText textAlign={'center'} fontSize={15}>Medium Armor offers more Protection than Light Armor, but it also impairs Movement more.</AppText>
                                <AppText padding={15} fontSize={18}>Light Armor</AppText>
                                <AppText textAlign={'center'} fontSize={15}>Made from supple and thin materials, Light Armor favors agile adventurers since it offers some Protection without sacrificing mobility.</AppText>
                                <View style={{ marginTop: 20, alignItems: "center" }}>
                                    <AppText textAlign={'center'}>You can only ware armor types you are proficient with.</AppText>
                                    <AppText textAlign={'center'}>Your class, the {this.state.character.characterClass} offers the following armor proficiencies:</AppText>
                                    <AppText fontSize={16}>{this.state.character.characterClassId && this.state.character.characterClassId.armorProficiencies} {this.state.character.addedArmorProf}</AppText>
                                </View>
                                <AppText padding={20} textAlign={'center'}>You can unlock new proficiencies with some class paths or your DM might give you spacial proficiencies during your adventure.</AppText>
                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'close'} onPress={() => { this.setState({ tutorialOn: false }) }} />
                            </View>
                        </Modal>
                        <AppForm
                            initialValues={{ armorName: '', armorAc: null }}
                            onSubmit={(values: any) => this.addArmor(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    fieldName={"armorName"}
                                    iconName={"text-short"}
                                    placeholder={"Armor name..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={'numeric'}
                                    fieldName={"armorAc"}
                                    iconName={"lock-outline"}
                                    placeholder={"AC..."} />
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText>Does this armor have disadvantage at stealth?</AppText>
                                    <Switch value={this.state.disadvantageStealth} onValueChange={() => {
                                        if (this.state.disadvantageStealth) {
                                            this.setState({ disadvantageStealth: false })
                                            return;
                                        }
                                        this.setState({ disadvantageStealth: true })
                                    }} />
                                </View>
                                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <AppButton backgroundColor={this.state.heavyArmor ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                        title={'Heavy Armor'} onPress={() => { this.setState({ armorType: 'Heavy Armor', heavyArmor: true, mediumArmor: false, lightArmor: false }) }} />

                                    <AppButton backgroundColor={this.state.mediumArmor ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                        title={'Medium Armor'} onPress={() => { this.setState({ armorType: 'Medium Armor', heavyArmor: false, mediumArmor: true, lightArmor: false }) }} />

                                    <AppButton backgroundColor={this.state.lightArmor ? Colors.bitterSweetRed : Colors.lightGray} width={100} height={50} borderRadius={25}
                                        title={'Light Armor'} onPress={() => { this.setState({ armorType: 'Light Armor', heavyArmor: false, mediumArmor: false, lightArmor: true }) }} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <SubmitButton textAlign={'center'} title={"Add Armor"} />
                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'close'} onPress={() => { this.setState({ addArmor: false }) }} />
                            </View>
                        </AppForm>
                    </ScrollView>
                </Modal>
                {this.state.armorList &&
                    <View>
                        {this.state.armorList.map(armor =>
                            <View key={armor.id} style={styles.armorUnit}>
                                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Equip Set'} onPress={() => { this.equipSet(armor) }} />
                                </TouchableOpacity>
                                {armor.removable ?
                                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 70, zIndex: 1 }}>
                                        <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                            title={'Delete Set'} onPress={() => { this.removeSet(armor.id) }} />
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <AppText color={Colors.danger} fontSize={16}>This armor is not removable</AppText>
                                    </View>
                                }
                                <View style={{ width: '65%' }}>
                                    <AppText fontSize={16}>Name: {armor.name}</AppText>
                                    <AppText fontSize={16}>AC: {armor.baseAc}</AppText>
                                    <AppText fontSize={16}>Type: {armor.armorType}</AppText>
                                    <AppText fontSize={16} >{armor.disadvantageStealth ? `This armor has stealth disadvantage` : `This armor does not have stealth disadvantage`}</AppText>
                                </View>
                            </View>)}
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, armorUnit: {
        position: "relative",
        padding: 15,
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 25,
        margin: 20
    }, equippedArmor: {
        width: '100%',
        position: "relative",
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.bitterSweetRed,
        borderRadius: 25,
        margin: 20
    }
});