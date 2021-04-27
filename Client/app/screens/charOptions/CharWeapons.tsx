import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { WeaponModal } from '../../models/WeaponModal';
import * as Yup from 'yup';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import userCharApi from '../../api/userCharApi';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import AuthContext from '../../auth/context';
import logger from '../../../utility/logger';
import * as abilityScores from '../../../jsonDump/abilityScores.json';
import NumberScroll from '../../components/NumberScroll';
import { AddWeaponToMarket } from '../../components/weaponMarketComponents/AddWeaponToMarket';
import { RemoveWeaponFromMarket } from '../../components/weaponMarketComponents/RemoveWeaponFromMarket';
import { checkMarketWeaponValidity } from '../MarketPlace/functions/marketInteractions';
import { AppEquipmentImagePicker } from '../../components/AppEquipmentImagePicker';
import { img } from '../../../jsonDump/equipmentImgJson.json'
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Weapon Name"),
    description: Yup.string().required().label("Weapon Description"),
    diceAmount: Yup.number().required().typeError('Dice Amount is required and must be a number').label("Dice Amount"),
    specialAbilities: Yup.string().label("Special Abilities"),
})

const dice = ["D12", "D10", "D8", "D6", "D4"]


interface CharWeaponsState {
    character: CharacterModel
    addWeapon: boolean
    dicePicked: string
    scorePicked: string
    weaponList: WeaponModal[]
    weaponInfoModal: boolean
    pickedWeapon: WeaponModal
    editingWeapon: boolean
    weaponBeingEdited: WeaponModal
    isProficient: boolean
    addedDamage: number
    pickedImg: string
    addedHitChance: number
}

export class CharWeapons extends Component<{ navigation: any, route: any }, CharWeaponsState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            weaponBeingEdited: new WeaponModal(),
            editingWeapon: false,
            scorePicked: '',
            pickedWeapon: new WeaponModal(),
            weaponInfoModal: false,
            weaponList: [],
            dicePicked: '',
            addWeapon: false,
            character: this.props.route.params.char,
            isProficient: false,
            addedDamage: 0,
            pickedImg: '',
            addedHitChance: 0
        }
    }
    componentDidMount() {
        try {
            this.refreshWeapons(new WeaponModal())
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    refreshWeapons = async (currentWeapon: WeaponModal) => {
        const character = { ...this.state.character };
        const weaponList = await AsyncStorage.getItem(`${this.state.character._id}WeaponList`);
        if (weaponList) {
            this.setState({ weaponList: JSON.parse(weaponList) })
        }
        if (!this.state.character.currentWeapon) {
            character.currentWeapon = new WeaponModal();
        }
        this.setState({ character, pickedWeapon: currentWeapon })
    }

    updateOfflineCharacter = async () => {
        try {
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
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    validateWeapon = () => {
        try {
            if (this.state.dicePicked === '') {
                return false
            }
            if (this.state.scorePicked === '') {
                return false
            }
            return true
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addWeapon = async (values: any) => {
        try {
            if (!this.validateWeapon()) {
                alert('Must pick damage dice and weapon modifier');
                return;
            }
            let WeaponName = values.name;
            let dice = this.state.dicePicked;
            const weapon: WeaponModal = {
                _id: WeaponName + Math.floor((Math.random() * 1000000) + 1),
                name: WeaponName,
                dice: dice,
                specialAbilities: values.specialAbilities,
                isProficient: this.state.isProficient,
                modifier: this.state.scorePicked,
                description: values.description,
                addedDamage: this.state.addedDamage,
                addedHitChance: this.state.addedHitChance,
                diceAmount: values.diceAmount,
                removable: true,
                image: this.state.pickedImg === "" ? 'sword.png' : this.state.pickedImg
            }
            let weaponList = await AsyncStorage.getItem(`${this.state.character._id}WeaponList`);
            if (!weaponList) {
                const weaponList = [weapon]
                AsyncStorage.setItem(`${this.state.character._id}WeaponList`, JSON.stringify(weaponList))
                this.setState({ weaponList: weaponList, addWeapon: false })
                return;
            }
            const newWeaponList = JSON.parse(weaponList)
            newWeaponList.push(weapon)
            AsyncStorage.setItem(`${this.state.character._id}WeaponList`, JSON.stringify(newWeaponList))
            this.setState({ addWeapon: false, weaponList: newWeaponList });
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    removeWeapon = async (weaponId: string) => {
        try {
            let weaponList = await AsyncStorage.getItem(`${this.state.character._id}WeaponList`);
            if (weaponList) {
                let newWeaponList = JSON.parse(weaponList)
                newWeaponList = newWeaponList.filter((weapon: any) => weapon._id !== weaponId);
                AsyncStorage.setItem(`${this.state.character._id}WeaponList`, JSON.stringify(newWeaponList))
                this.setState({ weaponList: newWeaponList });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    equipWeapon = (weapon: WeaponModal) => {
        try {
            if (weapon) {
                const newWeapon = JSON.parse(JSON.stringify(weapon))
                const character = { ...this.state.character };
                character.currentWeapon = newWeapon;
                this.setState({ character }, () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                    if (this.context.user._id === "Offline") {
                        this.updateOfflineCharacter();
                        return;
                    }
                    userCharApi.updateChar(this.state.character)
                });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    removeEquippedWeapon = () => {
        try {
            const character = { ...this.state.character };
            character.currentWeapon = new WeaponModal();
            this.setState({ character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                if (this.context.user._id === "Offline") {
                    this.updateOfflineCharacter();
                    return;
                }
                userCharApi.updateChar(this.state.character);
            });
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    startEditWeapon = (weapon: WeaponModal) => {
        this.setState({ isProficient: weapon.isProficient || false, editingWeapon: true, weaponBeingEdited: weapon, dicePicked: weapon.dice || '', scorePicked: weapon.modifier || '' })
    }

    editWeapon = async (values: any) => {
        try {
            if (!this.validateWeapon()) {
                alert('Must pick damage dice and weapon modifier');
                return;
            }
            let WeaponName = values.name;
            let dice = this.state.dicePicked;
            const weapon: WeaponModal = {
                _id: this.state.weaponBeingEdited._id,
                name: WeaponName,
                dice: dice,
                specialAbilities: values.specialAbilities,
                isProficient: this.state.isProficient,
                modifier: this.state.scorePicked,
                description: values.description,
                diceAmount: values.diceAmount,
                addedDamage: this.state.addedDamage,
                addedHitChance: this.state.addedHitChance,
                removable: true,
                image: this.state.pickedImg === "" ? this.state.weaponBeingEdited.image : this.state.pickedImg,
                marketStatus: this.state.weaponBeingEdited.marketStatus
            }
            let weaponList = await AsyncStorage.getItem(`${this.state.character._id}WeaponList`);
            if (!weaponList) {
                return;
            }
            const newWeaponList = JSON.parse(weaponList)
            let index: number = 0
            for (let item of newWeaponList) {
                if (item._id === this.state.weaponBeingEdited._id) {
                    newWeaponList[index] = weapon
                }
                index++
            }
            AsyncStorage.setItem(`${this.state.character._id}WeaponList`, JSON.stringify(newWeaponList))
            this.setState({ dicePicked: '', scorePicked: '', isProficient: false, weaponBeingEdited: new WeaponModal(), editingWeapon: false, weaponList: newWeaponList });
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    marketPlaceNode = () => {
        const validity = checkMarketWeaponValidity(this.state.pickedWeapon.marketStatus, this.context.user._id);
        if (validity === 'NOT_OWNED') return <View></View>
        if (validity === 'OWNED_NOT_PUBLISHED') return <AddWeaponToMarket refreshWeapons={(updatedWeapon: WeaponModal) => this.refreshWeapons(updatedWeapon)} char_id={this.state.character._id || ''} weapon={this.state.pickedWeapon} />
        if (validity === 'OWNED_PUBLISHED') return <RemoveWeaponFromMarket refreshWeapons={(updatedWeapon: WeaponModal) => this.refreshWeapons(updatedWeapon)} char_id={this.state.character._id || ''} weapon={this.state.pickedWeapon} />
        return <View></View>
    }

    marketValidity = (weapon: WeaponModal) => {
        const validity = checkMarketWeaponValidity(weapon.marketStatus, this.context.user._id);
        if (validity === 'NOT_OWNED') return <AppText color={Colors.deepGold}>Market - Not Owned</AppText>
        if (validity === 'OWNED_NOT_PUBLISHED') return <AppText color={Colors.danger}>Market - Not Published</AppText>
        if (validity === 'OWNED_PUBLISHED') return <AppText color={Colors.paleGreen}>Market - Published</AppText>
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: 'center', padding: 20, marginBottom: 20 }}>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>Equipped Weapon</AppText>
                    {this.state.character.currentWeapon &&
                        <View style={styles.equippedWeapon}>
                            {this.state.character.currentWeapon.name === undefined || this.state.character.currentWeapon.name === null ?
                                <View>
                                    <AppText>No Weapon Equipped</AppText>
                                </View>
                                :
                                <View>
                                    <TouchableOpacity style={{ position: 'absolute', right: 10, zIndex: 1 }}>
                                        <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                            title={'Remove Weapon'} onPress={() => { this.removeEquippedWeapon() }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        this.state.character.currentWeapon &&
                                            this.setState({ pickedWeapon: this.state.character.currentWeapon, weaponInfoModal: true })
                                    }}>
                                        <Image uri={`${Config.serverUrl}/assets/charEquipment/${this.state.character.currentWeapon.image}`} style={{ height: 40, width: 40, justifyContent: "center" }} />
                                        <AppText>Name: {this.state.character.currentWeapon.name}</AppText>
                                        <AppText>Description: {this.state.character.currentWeapon.description?.substr(0, 10)}...</AppText>
                                        <AppText>Damage dice: {this.state.character.currentWeapon.diceAmount}-{this.state.character.currentWeapon.dice}</AppText>
                                        <AppText >Modifier: {this.state.character.currentWeapon.modifier && this.state.character.currentWeapon.modifier}</AppText>
                                        {this.state.character.currentWeapon.isProficient && <AppText >Proficient: {this.state.character.currentWeapon.isProficient.toString()}</AppText>}
                                        <AppText>Special abilities: {this.state.character.currentWeapon.specialAbilities ? `${this.state.character.currentWeapon.specialAbilities.substr(0, 10)}...` : "No spacial abilities"}</AppText>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>}
                </View>
                <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                    title={'Add Weapon'} onPress={() => { this.setState({ addWeapon: true }) }} />
                <Modal visible={this.state.addWeapon || this.state.editingWeapon} animationType="slide" >
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <View style={{ marginBottom: 20 }}>
                            <AppText fontSize={20} textAlign={'center'}>As a {this.state.character.characterClass} you have the following Weapon proficiencies:</AppText>
                        </View>
                        <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 5, margin: 15, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                            {this.state.character.characterClassId && this.state.character.characterClassId.weaponProficiencies && this.state.character.characterClassId.weaponProficiencies.map((item: any) =>
                                <View key={item} style={{ margin: 5, backgroundColor: Colors.bitterSweetRed, padding: 5, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                    <AppText fontSize={18} textAlign={'center'}>{item}</AppText>
                                </View>)}
                        </View>
                        {this.state.character.addedWeaponProf && this.state.character.addedWeaponProf?.length > 0 &&
                            <View>
                                <View style={{ marginTop: 20, marginBottom: 20 }}>
                                    <AppText fontSize={20} textAlign={'center'}>You also gained the following Weapon proficiencies from your path, race, or special events in your adventure:</AppText>
                                </View>
                                <View style={{ justifyContent: "center", flexWrap: 'wrap', padding: 5, margin: 15, flexDirection: "row", backgroundColor: Colors.pinkishSilver, borderWidth: 1, borderColor: Colors.berries, borderRadius: 15 }}>
                                    {this.state.character.addedWeaponProf && this.state.character.addedWeaponProf.map((item: any, index: number) =>
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
                                name: this.state.editingWeapon ? this.state.weaponBeingEdited.name : '',
                                description: this.state.editingWeapon ? this.state.weaponBeingEdited.description : '',
                                diceAmount: this.state.editingWeapon ? this.state.weaponBeingEdited.diceAmount : null,
                                specialAbilities: this.state.editingWeapon ? this.state.weaponBeingEdited.specialAbilities : '',
                            }}
                            onSubmit={(values: any) => this.state.editingWeapon ? this.editWeapon(values) : this.addWeapon(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    defaultValue={this.state.editingWeapon ? this.state.weaponBeingEdited.name : ''}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"name"}
                                    iconName={"text-short"}
                                    placeholder={"Weapon name..."} />
                                <AppFormField
                                    defaultValue={this.state.editingWeapon ? this.state.weaponBeingEdited.description : ''}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"description"}
                                    iconName={"text-short"}
                                    placeholder={"Weapon Description..."} />
                                <AppFormField
                                    defaultValue={this.state.editingWeapon ? this.state.weaponBeingEdited.specialAbilities : ''}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"specialAbilities"}
                                    iconName={"text-short"}
                                    placeholder={"Weapon Special Abilities..."} />
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText>Are you Proficient with this weapon?</AppText>
                                    <Switch value={this.state.isProficient} onValueChange={() => {
                                        if (this.state.isProficient) {
                                            this.setState({ isProficient: false })
                                            return;
                                        }
                                        this.setState({ isProficient: true })
                                    }} />
                                </View>
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText>What is the damage dice this weapon rolls?</AppText>
                                </View>
                                {dice.map((item, index) => <TouchableOpacity key={index} onPress={() => this.setState({ dicePicked: item })}
                                    style={[styles.item, { backgroundColor: this.state.dicePicked === item ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                    <AppText>{item}</AppText>
                                </TouchableOpacity>)}
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText>What is the modifier associated with this weapon?</AppText>
                                </View>
                                {abilityScores.abilityScores.map((score, index) => {
                                    return <TouchableOpacity key={index} onPress={() => this.setState({ scorePicked: score })}
                                        style={[styles.item, { backgroundColor: this.state.scorePicked === score ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText>{score}</AppText>
                                    </TouchableOpacity>
                                })}
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText>How many dice can you roll for damage?</AppText>
                                </View>
                                <AppFormField
                                    defaultValue={this.state.editingWeapon ? this.state.weaponBeingEdited.diceAmount : ''}
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    keyboardType={'numeric'}
                                    fieldName={"diceAmount"}
                                    iconName={"text-short"}
                                    placeholder={"Dice Amount"} />
                                <AppText padding={15} textAlign={'center'}>Does this weapon provide any additional base damage on hit?</AppText>
                                <NumberScroll modelColor={Colors.pageBackground} max={5000}
                                    startFromZero={true}
                                    startingVal={this.state.editingWeapon ? this.state.weaponBeingEdited.addedDamage : 0}
                                    getValue={(val: any) => {
                                        if (!val) return
                                        this.setState({ addedDamage: val })
                                    }} />
                                <AppText padding={15} textAlign={'center'}>Does this weapon provide any additional chance to hit?</AppText>
                                <NumberScroll modelColor={Colors.pageBackground} max={5000}
                                    startFromZero={true}
                                    startingVal={this.state.editingWeapon ? this.state.weaponBeingEdited.addedHitChance : 0}
                                    getValue={(val: any) => {
                                        if (!val) return
                                        this.setState({ addedHitChance: val })
                                    }} />
                            </View>
                            <View>
                                <AppText padding={15} textAlign={'center'}>Pick an Image For Your Weapon?</AppText>
                                <AppEquipmentImagePicker itemList={img} selectedItemIcon={this.state.pickedImg}
                                    resetImgPick={(val: string) => {
                                        this.setState({ pickedImg: val })
                                    }}
                                    selectedItem={this.state.editingWeapon ? this.state.weaponBeingEdited.image : this.state.pickedImg} selectItem={(pickedImg: any) => { this.setState({ pickedImg: pickedImg }) }}
                                    numColumns={3} placeholder={"Pick Image"} iconName={"apps"} />
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <SubmitButton textAlign={'center'} title={this.state.editingWeapon ? "Edit Weapon" : "Add Weapon"} />
                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'close'} onPress={() => { this.setState({ addWeapon: false, editingWeapon: false, weaponBeingEdited: new WeaponModal() }) }} />
                            </View>
                        </AppForm>
                    </ScrollView>
                </Modal>
                {
                    this.state.weaponList &&
                    <ScrollView style={{ flex: 1 }}>
                        {this.state.weaponList.map(weapon =>
                            <View key={weapon._id} style={styles.weaponUnit}>
                                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Equip Weapon'} onPress={() => { this.equipWeapon(weapon) }} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 65, zIndex: 1 }}>
                                    <AppButton backgroundColor={Colors.earthYellow} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Edit Weapon'} onPress={() => this.startEditWeapon(weapon)} />
                                </TouchableOpacity>
                                {weapon.removable ?
                                    <TouchableOpacity style={{ position: 'absolute', right: 10, top: 120, zIndex: 1 }}>
                                        <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                            title={'Delete Weapon'} onPress={() => { this.removeWeapon(weapon._id ? weapon._id : '') }} />
                                    </TouchableOpacity>
                                    :
                                    <View>
                                        <AppText color={Colors.danger} fontSize={16}>This Weapon is not removable</AppText>
                                    </View>
                                }
                                <TouchableOpacity style={{ width: '65%' }} onPress={() => { this.setState({ pickedWeapon: weapon, weaponInfoModal: true }) }}>
                                    <Image uri={`${Config.serverUrl}/assets/charEquipment/${weapon.image}`} style={{ height: 40, width: 40, justifyContent: "center" }} />
                                    <AppText fontSize={16}>Name: {weapon.name}</AppText>
                                    <AppText fontSize={16}>Damage dice: {weapon.diceAmount}-{weapon.dice}</AppText>
                                    <AppText fontSize={16}>Description: {weapon.description?.substr(0, 10)}...</AppText>
                                    <AppText fontSize={16}>Modifier: {weapon.modifier && weapon.modifier}</AppText>
                                    {weapon.isProficient && <AppText >Proficient: {weapon.isProficient.toString()}</AppText>}
                                    <AppText fontSize={16}>{weapon.specialAbilities ? `Special abilities: ${weapon.specialAbilities.substr(0, 10)}...` : "No spacial abilities"}</AppText>
                                    {this.marketValidity(weapon)}
                                </TouchableOpacity>
                            </View>)}
                    </ScrollView>
                }
                <Modal visible={this.state.weaponInfoModal} animationType="slide">
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        {this.state.pickedWeapon.name &&
                            <View>
                                <View>
                                    <AppText textAlign={'center'} fontSize={22} padding={5}>Name: {this.state.pickedWeapon.name}</AppText>
                                    <AppText textAlign={'center'} fontSize={16} padding={5}>Damage dice: {this.state.pickedWeapon.diceAmount}-{this.state.pickedWeapon.dice}</AppText>
                                    <AppText textAlign={'center'} fontSize={16} padding={5}>Description: {this.state.pickedWeapon.description}</AppText>
                                    <AppText textAlign={'center'} fontSize={16} padding={5}>Modifier: {this.state.pickedWeapon.modifier && this.state.pickedWeapon.modifier}</AppText>
                                    {this.state.pickedWeapon.isProficient && <AppText textAlign={'center'} fontSize={16}>Proficient: {this.state.pickedWeapon.isProficient.toString()}</AppText>}
                                    <AppText textAlign={'center'} fontSize={16}>{this.state.pickedWeapon.specialAbilities ? `Special abilities:\n ${this.state.pickedWeapon.specialAbilities}` : null}</AppText>
                                </View>
                                <View style={{ paddingTop: 10 }}>
                                    {this.marketPlaceNode()}
                                </View>
                                <View>
                                    <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                        title={'Close'} onPress={() => { this.setState({ weaponInfoModal: false }) }} />
                                </View>
                            </View>
                        }
                    </ScrollView>
                </Modal>
            </View >
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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
    }, equippedWeapon: {
        width: '100%',
        position: "relative",
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.bitterSweetRed,
        borderRadius: 25,
        margin: 20
    },
    weaponUnit: {
        height: 220,
        position: "relative",
        padding: 15,
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 25,
        margin: 2
    }
});