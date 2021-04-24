import React, { Component } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity, Switch, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { boolean } from 'yup';
import { AppForm } from '../../components/forms/AppForm';
import * as Yup from 'yup';
import { EquipmentModal } from '../../models/EquipmentModal';
import { store } from '../../redux/store';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userCharApi from '../../api/userCharApi';
import { AppFormField } from '../../components/forms/AppFormField';
import { AppText } from '../../components/AppText';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { AppButton } from '../../components/AppButton';
import * as equipmentImgList from "../../../jsonDump/equipmentImgJson.json";
import { Colors } from '../../config/colors';
import { AppEquipmentImagePicker } from '../../components/AppEquipmentImagePicker';
import { Image, CacheManager } from 'react-native-expo-image-cache'
import { Config } from '../../../config';
import AuthContext from '../../auth/context';
import logger from '../../../utility/logger';
import NumberScroll from '../../components/NumberScroll';


const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Equipment Name"),
    description: Yup.string().required().label("Equipment Description"),
    equipmentType: Yup.string().required().label("Equipment Type"),
})

interface CharEquipmentState {
    addNewEquipmentModal: boolean
    character: CharacterModel
    pickedImg: string
    pickedEquipment: EquipmentModal
    equipmentInfoModal: boolean
    addedAc: number
    addedDam: number
}

export class CharEquipment extends Component<{ route: any }, CharEquipmentState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            addedDam: 0,
            addedAc: 0,
            equipmentInfoModal: false,
            pickedEquipment: new EquipmentModal(),
            pickedImg: '',
            character: store.getState().character,
            addNewEquipmentModal: false
        }
    }


    addEquipment = async (values: any) => {
        try {
            const equipment: EquipmentModal = {
                _id: values.name + Math.floor((Math.random() * 1000000) + 1),
                name: values.name,
                addedAc: this.state.addedAc,
                addedDam: this.state.addedDam,
                description: values.description,
                equipmentType: values.equipmentType,
                image: this.state.pickedImg ? this.state.pickedImg : undefined,
                isEquipped: false
            }

            const character = store.getState().character;
            if (!character.equipment) {
                character.equipment = [];
            }
            character.equipment.push(equipment)
            this.setState({ character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                this.setState({ addNewEquipmentModal: false })
            })
            this.setState({ pickedImg: "" })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    removeEquipment = async (_id: string) => {
        try {
            const character = { ...this.state.character };
            const newList = character.equipment?.filter((item) => item._id !== _id);
            character.equipment = newList;
            this.setState({ character }, () => {
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                this.setState({ addNewEquipmentModal: false })
            })
        } catch (err) {
            logger.log(new Error(err))
        }
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

    equipItem = (_id: string) => {
        try {
            const character = { ...this.state.character };
            if (character.equipment) {
                const newList = character.equipment.find((item, index) => {
                    if (item._id === _id) {
                        item.isEquipped === true ? item.isEquipped = false : item.isEquipped = true
                    }
                })
                this.setState({ character }, () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
                    this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
                })
                return newList
            }
            if (!character.equipment) {
                return []
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ padding: 15, paddingTop: 40 }}>
                    <AppText textAlign={'center'} fontSize={17}>During your travels you will come across unique and powerful gear or items.</AppText>
                    <AppText textAlign={'center'} fontSize={17}>These items can be official items from the PHB or unique relics from the mind of your DM.</AppText>
                    <AppText textAlign={'center'} fontSize={17}>Here you can add new items, and add their effects in the description.</AppText>
                    <AppText textAlign={'center'} fontSize={17}>After acquiring the item in order to equip it just toggle the equip switch and the Item will appear in your character sheet.</AppText>
                </View>
                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                    title={'Add Equipment'} onPress={() => { this.setState({ addNewEquipmentModal: true }) }} />
                <Modal visible={this.state.addNewEquipmentModal}>
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <AppForm
                            initialValues={{ name: '', description: '', equipmentType: '' }}
                            onSubmit={(values: any) => this.addEquipment(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    fieldName={"name"}
                                    iconName={"text-short"}
                                    placeholder={"Equipment name..."} />
                                <View style={{ padding: 5, marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText textAlign={'center'}>What does this piece of equipment give you when you wear it?</AppText>
                                </View>
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"description"}
                                    iconName={"text-short"}
                                    placeholder={"Equipment Description..."} />
                                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText textAlign={'center'}>Is it a hat? a magical ring or a powerful spoon? {'\n'} What type of equipment did you acquire?</AppText>
                                </View>
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.4}
                                    internalWidth={Dimensions.get('screen').width / 0.9}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"equipmentType"}
                                    iconName={"text-short"}
                                    placeholder={"Equipment type..."} />

                                <AppText textAlign={'center'} padding={10} fontSize={18}>Does this equipment add additional AC?</AppText>
                                <NumberScroll modelColor={Colors.pageBackground} max={50}
                                    startFromZero={true}
                                    startingVal={0}
                                    getValue={(val: any) => {
                                        this.setState({ addedAc: val })
                                    }} />

                                <AppText textAlign={'center'} padding={10} fontSize={18}>Does this equipment add additional Damage on hit?</AppText>
                                <NumberScroll modelColor={Colors.pageBackground} max={50}
                                    startFromZero={true}
                                    startingVal={0}
                                    getValue={(val: any) => {
                                        this.setState({ addedDam: val })
                                    }} />


                                <View style={{ padding: 5, marginTop: 15, justifyContent: 'center', alignItems: "center" }}>
                                    <AppText textAlign={'center'}>If you wish, you can add an image to better visualize your item</AppText>
                                </View>
                                <View style={{ flex: .15, width: Dimensions.get('screen').width / 1.2 }}>
                                    <AppEquipmentImagePicker itemList={equipmentImgList.img} selectedItemIcon={this.state.pickedImg}
                                        resetImgPick={(val: string) => {
                                            this.setState({ pickedImg: val })
                                        }}
                                        selectedItem={this.state.pickedImg} selectItem={(pickedImg: any) => { this.setState({ pickedImg: pickedImg }) }}
                                        numColumns={3} placeholder={"Pick Image"} iconName={"apps"} />
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <SubmitButton width={150} textAlign={'center'} title={"Add Equipment"} />
                                <AppButton backgroundColor={Colors.bitterSweetRed} width={140} height={50} borderRadius={25}
                                    title={'close'} onPress={() => { this.setState({ addNewEquipmentModal: false, pickedImg: "" }) }} />
                            </View>
                        </AppForm>
                    </ScrollView>
                </Modal>
                {
                    (this.state.character.equipment && this.state.character.equipment.length > 0) &&
                    <View >
                        {this.state.character.equipment.map((equipment, index) =>
                            <View key={equipment._id} style={[styles.weaponUnit]}>
                                {equipment.image &&
                                    <View style={{ flex: .3 }}>
                                        <Image style={{ resizeMode: "stretch", width: 50, height: 50 }} uri={`${Config.serverUrl}/assets/charEquipment/${equipment.image}`} />
                                    </View>
                                }
                                <TouchableOpacity style={{ flex: .5 }} onPress={() => { this.setState({ pickedEquipment: equipment, equipmentInfoModal: true }) }}>
                                    <AppText fontSize={16}>Name: {equipment.name}</AppText>
                                    <AppText fontSize={16}>Description: {equipment.description?.substr(0, 10)}...</AppText>
                                </TouchableOpacity>
                                <View style={{ flex: .5, alignItems: "flex-end", justifyContent: "space-evenly" }}>
                                    <TouchableOpacity >
                                        <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={90} height={50} borderRadius={25}
                                            title={'Delete Equipment'} onPress={() => {
                                                Alert.alert("Delete", "Remove Equipment?", [{ text: 'Yes', onPress: () => this.removeEquipment(equipment._id ? equipment._id : '') }, { text: 'No' }])
                                            }} />
                                    </TouchableOpacity>
                                    <View style={{ alignItems: "center" }}>
                                        <AppText>Equip Item:</AppText>
                                        <Switch value={this.state.character.equipment ? this.state.character.equipment[index].isEquipped : false} onValueChange={() => {
                                            if (this.state.character.equipment && this.state.character.equipment[index]._id) {
                                                this.equipItem(this.state.character.equipment[index]._id as any)
                                            }
                                        }} />
                                    </View>
                                </View>
                            </View>)}
                    </View>
                }
                <Modal visible={this.state.equipmentInfoModal} animationType="slide">
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <View>
                            <AppText textAlign={'center'} fontSize={22}>Name: {this.state.pickedEquipment.name}</AppText>
                            <AppText textAlign={'center'} fontSize={16}>Description: {this.state.pickedEquipment.description}</AppText>
                            <AppText textAlign={'center'} fontSize={16}>Type: {this.state.pickedEquipment.equipmentType}</AppText>
                        </View>
                        <View>
                            <AppButton backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                                title={'Close'} onPress={() => { this.setState({ equipmentInfoModal: false }) }} />
                        </View>
                    </ScrollView>
                </Modal>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, weaponUnit: {
        flexDirection: 'row',
        alignSelf: "center",
        width: Dimensions.get('screen').width / 1.1,
        position: "relative",
        padding: 15,
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 25,
        margin: 2
    }
});