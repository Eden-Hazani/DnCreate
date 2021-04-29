import React, { Component, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Switch, } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { Colors } from '../../../config/colors';
import { AppText } from '../../../components/AppText';
import { CharacterModel } from '../../../models/characterModel';
import { WeaponModal } from '../../../models/WeaponModal';
import * as Yup from 'yup';
import { AppForm } from '../../../components/forms/AppForm';
import { AppFormField } from '../../../components/forms/AppFormField';
import * as abilityScores from '../../../../jsonDump/abilityScores.json';
import NumberScroll from '../../../components/NumberScroll';
import { AppEquipmentImagePicker } from '../../../components/AppEquipmentImagePicker';
import { img } from '../../../../jsonDump/equipmentImgJson.json'
import { SubmitButton } from '../../../components/forms/SubmitButton';
import { addNewWeapon, editExistingWeapon } from './weaponFunctions'

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Weapon Name"),
    description: Yup.string().required().label("Weapon Description"),
    diceAmount: Yup.number().required().typeError('Dice Amount is required and must be a number').label("Dice Amount"),
    specialAbilities: Yup.string().label("Special Abilities"),
})

const diceArray = ["D12", "D10", "D8", "D6", "D4"]

interface Props {
    character: CharacterModel;
    weaponBeingEdited: WeaponModal | null;
    cleanEditedWeapon: Function;
    reloadWeapons: Function;
    enterLoading: Function;
}

export function AddOrEditWeapon({ character, weaponBeingEdited, cleanEditedWeapon, reloadWeapons, enterLoading }: Props) {
    const [manipulatedWeapon, setManipulatedWeapon] = useState<WeaponModal>(weaponBeingEdited === null ? new WeaponModal() : {
        _id: weaponBeingEdited._id || '',
        name: weaponBeingEdited.name || '',
        description: weaponBeingEdited.description || '',
        specialAbilities: weaponBeingEdited.specialAbilities || '',
        isProficient: weaponBeingEdited.isProficient || false,
        dice: weaponBeingEdited.dice || '',
        diceAmount: weaponBeingEdited.diceAmount || 0,
        modifier: weaponBeingEdited.modifier || '',
        addedDamage: weaponBeingEdited.addedDamage || 0,
        addedHitChance: weaponBeingEdited.addedHitChance || 0,
        image: weaponBeingEdited.image || ""
    })


    const updateWeaponObj = (parameter: string, value: any) => setManipulatedWeapon(prevState => ({ ...prevState, [parameter]: value }));



    const submitWeapon = async (values: any) => {
        enterLoading(true)
        if (weaponBeingEdited) {
            await editExistingWeapon(values, manipulatedWeapon, character);
            setManipulatedWeapon(new WeaponModal())
            reloadWeapons()
            return
        }
        await addNewWeapon(values, manipulatedWeapon, character);
        setManipulatedWeapon(new WeaponModal())
        reloadWeapons()
    }

    return (
        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
            <View style={{ marginBottom: 20 }}>
                <AppText fontSize={20} textAlign={'center'}>As a {character.characterClass} you have the following Weapon proficiencies:</AppText>
            </View>
            <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 5, margin: 15, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                {character.characterClassId && character.characterClassId.weaponProficiencies && character.characterClassId.weaponProficiencies.map((item: any) =>
                    <View key={item} style={{ margin: 5, backgroundColor: Colors.bitterSweetRed, padding: 5, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                        <AppText fontSize={18} textAlign={'center'}>{item}</AppText>
                    </View>)}
            </View>
            {character.addedWeaponProf && character.addedWeaponProf?.length > 0 &&
                <View>
                    <View style={{ marginTop: 20, marginBottom: 20 }}>
                        <AppText fontSize={20} textAlign={'center'}>You also gained the following Weapon proficiencies from your path, race, or special events in your adventure:</AppText>
                    </View>
                    <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 5, margin: 15, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                        {character.addedWeaponProf && character.addedWeaponProf.map((item: any, index: number) =>
                            <View key={index} style={{ margin: 5, backgroundColor: Colors.bitterSweetRed, padding: 5, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                <AppText fontSize={18} textAlign={'center'}>{item}</AppText>
                            </View>)}
                    </View>
                </View>
            }
            <AppText fontSize={20} textAlign={'center'}>You will buy,earn,steal and come across different weapons in your adventure.</AppText>
            <AppText fontSize={20} textAlign={'center'}>Your DM might give you a special weapon with unique abilities or an ancient relic with legendary qualities.</AppText>
            <AppText fontSize={20} textAlign={'center'}>For more information regarding weapons it is highly recommended to read the official instructions regarding them in the PHB.</AppText>
            <AppForm
                initialValues={{
                    name: manipulatedWeapon.name,
                    description: manipulatedWeapon.description,
                    diceAmount: manipulatedWeapon.diceAmount,
                    specialAbilities: manipulatedWeapon.specialAbilities,
                }}
                onSubmit={(values: any) => submitWeapon(values)}
                validationSchema={ValidationSchema}>
                <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                    <AppFormField
                        defaultValue={manipulatedWeapon.name}
                        width={Dimensions.get('screen').width / 1.4}
                        internalWidth={Dimensions.get('screen').width / 0.9}
                        fieldName={"name"}
                        iconName={"text-short"}
                        placeholder={"Weapon name..."} />
                    <AppFormField
                        defaultValue={manipulatedWeapon.description}
                        width={Dimensions.get('screen').width / 1.4}
                        internalWidth={Dimensions.get('screen').width / 0.9}
                        numberOfLines={7} multiline={true} textAlignVertical={"top"}
                        fieldName={"description"}
                        iconName={"text-short"}
                        placeholder={"Weapon Description..."} />
                    <AppFormField
                        defaultValue={manipulatedWeapon.specialAbilities}
                        width={Dimensions.get('screen').width / 1.4}
                        internalWidth={Dimensions.get('screen').width / 0.9}
                        numberOfLines={7} multiline={true} textAlignVertical={"top"}
                        fieldName={"specialAbilities"}
                        iconName={"text-short"}
                        placeholder={"Weapon Special Abilities..."} />
                    <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                        <AppText>Are you Proficient with this weapon?</AppText>
                        <Switch value={manipulatedWeapon.isProficient} onValueChange={() => {
                            if (manipulatedWeapon.isProficient) {
                                updateWeaponObj('isProficient', false)
                                return;
                            }
                            updateWeaponObj('isProficient', true)
                        }} />
                    </View>
                    <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                        <AppText>What is the damage dice this weapon rolls?</AppText>
                    </View>
                    {diceArray.map((item, index) => <TouchableOpacity key={index} onPress={() => updateWeaponObj('dice', item)}
                        style={[styles.item, { backgroundColor: manipulatedWeapon.dice === item ? Colors.bitterSweetRed : Colors.lightGray }]}>
                        <AppText>{item}</AppText>
                    </TouchableOpacity>)}
                    <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                        <AppText>What is the modifier associated with this weapon?</AppText>
                    </View>
                    {abilityScores.abilityScores.map((score, index) => {
                        return <TouchableOpacity key={index} onPress={() => updateWeaponObj('modifier', score)}
                            style={[styles.item, { backgroundColor: manipulatedWeapon.modifier === score ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText>{score}</AppText>
                        </TouchableOpacity>
                    })}
                    <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                        <AppText>How many dice can you roll for damage?</AppText>
                    </View>
                    <AppFormField
                        defaultValue={manipulatedWeapon.diceAmount?.toString()}
                        width={Dimensions.get('screen').width / 1.4}
                        internalWidth={Dimensions.get('screen').width / 0.9}
                        keyboardType={'numeric'}
                        fieldName={"diceAmount"}
                        iconName={"text-short"}
                        placeholder={"Dice Amount"} />
                    <AppText padding={15} textAlign={'center'}>Does this weapon provide any additional base damage on hit?</AppText>
                    <NumberScroll modelColor={Colors.pageBackground} max={5000}
                        startFromZero={true}
                        startingVal={manipulatedWeapon.addedDamage}
                        getValue={(val: any) => {
                            if (!val) return
                            updateWeaponObj('addedDamage', parseInt(val))
                        }} />
                    <AppText padding={15} textAlign={'center'}>Does this weapon provide any additional chance to hit?</AppText>
                    <NumberScroll modelColor={Colors.pageBackground} max={5000}
                        startFromZero={true}
                        startingVal={manipulatedWeapon.addedHitChance}
                        getValue={(val: any) => {
                            if (!val) return
                            updateWeaponObj('addedHitChance', parseInt(val))
                        }} />
                </View>
                <View>
                    <AppText padding={15} textAlign={'center'}>Pick an Image For Your Weapon?</AppText>
                    <AppEquipmentImagePicker itemList={img} selectedItemIcon={manipulatedWeapon.image}
                        resetImgPick={(val: string) => {
                            updateWeaponObj('image', val)
                        }}
                        selectedItem={manipulatedWeapon.image} selectItem={(pickedImg: any) => updateWeaponObj('image', pickedImg)}
                        numColumns={3} placeholder={"Pick Image"} iconName={"apps"} />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                    <SubmitButton textAlign={'center'} title={weaponBeingEdited ? "Edit Weapon" : "Add Weapon"} />
                    <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                        title={'close'} onPress={() => {
                            cleanEditedWeapon()
                        }} />
                </View>
            </AppForm>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});