import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { EquippedArmorModel } from '../../models/EquippedArmorModel';
import { AppText } from '../AppText';
import { Image } from 'react-native-expo-image-cache';
import { Config } from '../../../config';
import { AppButton } from '../AppButton';
import { WeaponModal } from '../../models/WeaponModal';
import { EquipmentModal } from '../../models/EquipmentModal';
import logger from '../../../utility/logger';


interface CharEquipmentTreeState {
    equipmentModal: boolean
    pickedEquipment: EquipmentModal
    armorModal: boolean,
    weaponModal: boolean,
    currentArmor: EquippedArmorModel
    currentWeapon: WeaponModal
}

export class CharEquipmentTree extends Component<{ character: CharacterModel }, CharEquipmentTreeState> {
    constructor(props: any) {
        super(props)
        this.state = {
            equipmentModal: false,
            weaponModal: false,
            armorModal: false,
            pickedEquipment: new EquipmentModal(),
            currentArmor: this.props.character.equippedArmor || new EquippedArmorModel(),
            currentWeapon: this.props.character.currentWeapon || new WeaponModal()
        }
    }

    checkForEmptySideEquipment = () => {
        try {
            if (this.props.character.equipment) {
                let list: any = this.props.character.equipment.find((equipment) => {
                    if (equipment.isEquipped) {
                        return true
                    }
                });
                if (list === undefined) {
                    return <AppText>No Equipment Selected</AppText>
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <View style={{ paddingTop: 15 }}>
                <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>Main Equipment</AppText>
                <View style={[styles.container, { justifyContent: "space-evenly", alignItems: "center", paddingTop: 10 }]}>
                    <View style={{ alignItems: "center" }}>
                        <AppText>Current Armor</AppText>
                        {(this.state.currentArmor.name && this.state.currentArmor.name !== null) && <AppText>{this.state.currentArmor.name}</AppText>}
                        <TouchableOpacity onPress={() => {
                            if (this.state.currentArmor.name && this.state.currentArmor.id !== "1") {
                                this.setState({ armorModal: true })
                            }
                        }}
                            style={[styles.square, { margin: 10, alignSelf: "center", borderColor: Colors.whiteInDarkMode }]}>
                            {this.state.currentArmor.name && this.state.currentArmor.id !== "1" ?
                                <View>
                                    <View style={{ position: 'absolute', justifyContent: "flex-start", alignItems: "center", top: 0, right: 0, left: 0, bottom: 0, zIndex: 10 }}>
                                        <AppText fontSize={12}>Equipped</AppText>
                                    </View>
                                    <View style={{ justifyContent: "space-evenly", alignItems: "center", top: 5 }}>
                                        <Image style={{ width: 120, height: 120 }} uri={`${Config.serverUrl}/assets/charEquipment/armor.png`} />
                                    </View>
                                </View>
                                :
                                <View style={{
                                    position: 'absolute', justifyContent: "center", alignItems: "center", top: 0, right: 0, left: 0, bottom: 0, zIndex: 10,
                                    transform: [{ rotate: '-15deg' }]
                                }}>
                                    <AppText textAlign={'center'} fontSize={11}>Armor{'\n'}unEquipped</AppText>
                                </View>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <AppText>Current Weapon</AppText>
                        {(this.state.currentWeapon.name && this.state.currentWeapon.name !== null) && <AppText>{this.state.currentWeapon.name}</AppText>}
                        <TouchableOpacity onPress={() => {
                            if (this.state.currentWeapon.name && this.state.currentWeapon.name !== null) {
                                this.setState({ weaponModal: true })
                            }
                        }}
                            style={[styles.square, { margin: 10, alignSelf: "center", borderColor: Colors.whiteInDarkMode }]}>
                            {this.state.currentWeapon.name && this.state.currentWeapon.name !== null ?
                                <View>
                                    <View style={{ position: 'absolute', justifyContent: "flex-start", alignItems: "center", top: 0, right: 0, left: 0, bottom: 0, zIndex: 10 }}>
                                        <AppText fontSize={12}>Equipped</AppText>
                                    </View>
                                    <View style={{ justifyContent: "space-evenly", alignItems: "center", top: 5 }}>
                                        <Image style={{ width: 120, height: 120 }} uri={`${Config.serverUrl}/assets/charEquipment/sword.png`} />
                                    </View>
                                </View>
                                :
                                <View style={{
                                    position: 'absolute', justifyContent: "center", alignItems: "center", top: 0, right: 0, left: 0, bottom: 0, zIndex: 10,
                                    transform: [{ rotate: '-15deg' }]
                                }}>
                                    <AppText textAlign={'center'} fontSize={11}>Weapon{'\n'}unEquipped</AppText>
                                </View>}
                        </TouchableOpacity>
                    </View>
                </View>
                <AppText textAlign={'center'} fontSize={20} color={Colors.berries}>Side Equipment</AppText>
                <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                    {this.props.character.equipment &&
                        this.props.character.equipment.map((equipment, index) => {
                            if (equipment.isEquipped) {
                                return <TouchableOpacity key={index} onPress={() => {
                                    this.setState({ pickedEquipment: equipment, equipmentModal: true })
                                }}
                                    style={[styles.square, { margin: 10, alignSelf: "center", borderColor: Colors.whiteInDarkMode }]}>
                                    <View>
                                        <View style={{ position: 'absolute', justifyContent: "flex-start", alignItems: "center", top: 0, right: 0, left: 0, bottom: 0, zIndex: 10 }}>
                                            <AppText fontSize={12}>{equipment.name?.substr(0, 5)} {(equipment.name && equipment.name?.length > 5) && "..."}</AppText>
                                        </View>
                                        <View style={{ justifyContent: "space-evenly", alignItems: "center", top: 15 }}>
                                            <Image style={{ width: 50, height: 50 }} uri={`${Config.serverUrl}/assets/charEquipment/${equipment.image}`} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            }
                        })
                    }
                    {this.checkForEmptySideEquipment()}
                </View>



                <Modal visible={this.state.weaponModal} animationType="slide">
                    {(this.state.currentWeapon.name && this.state.currentWeapon.name !== null) &&
                        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
                                <AppText color={Colors.berries} fontSize={22} textAlign={'center'}>{this.state.currentWeapon.name}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>{this.state.currentWeapon.description}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>`Damage Dice - {this.state.currentWeapon.diceAmount}{this.state.currentWeapon.dice}`</AppText>
                            </View>
                            {this.state.currentWeapon.specialAbilities &&
                                <AppText fontSize={17} textAlign={'center'}>this.state.currentWeapon.specialAbilities</AppText>
                            }
                            <View style={{ marginTop: 15 }}>
                                <AppButton title={"Close"} width={70} borderRadius={15} height={50} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ weaponModal: false }) }} />
                            </View>
                        </ScrollView>
                    }
                </Modal>
                <Modal visible={this.state.armorModal} animationType="slide">
                    {(this.state.currentArmor.name && this.state.currentArmor.id !== "1") &&
                        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
                                <AppText color={Colors.berries} fontSize={22} textAlign={'center'}>{this.state.currentArmor.name}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>{this.state.currentArmor.armorType}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>AC - {this.state.currentArmor.ac}</AppText>
                            </View>
                            {this.state.currentArmor.disadvantageStealth &&
                                <AppText fontSize={17} textAlign={'center'}>This Armor has stealth disadvantage</AppText>
                            }
                            <View style={{ marginTop: 15 }}>
                                <AppButton title={"Close"} width={70} borderRadius={15} height={50} backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ armorModal: false }) }} />
                            </View>
                        </ScrollView>
                    }
                </Modal>
                <Modal visible={this.state.equipmentModal} animationType="slide">
                    {this.state.pickedEquipment._id &&
                        <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                            <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
                                <AppText color={Colors.berries} fontSize={22} textAlign={'center'}>{this.state.pickedEquipment.name}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>{this.state.pickedEquipment.description}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>Equipment Type - {this.state.pickedEquipment.equipmentType}</AppText>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <AppButton title={"Close"} width={70} borderRadius={15} height={50} backgroundColor={Colors.bitterSweetRed}
                                    onPress={() => { this.setState({ pickedEquipment: new EquipmentModal(), equipmentModal: false }) }} />
                            </View>
                        </ScrollView>
                    }
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    square: {
        borderWidth: 1,
        borderRadius: 15,
        width: 70,
        height: 70
    }
});