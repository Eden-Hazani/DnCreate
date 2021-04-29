import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { WeaponModal } from '../../../models/WeaponModal';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../../../auth/context';
import logger from '../../../../utility/logger';
import { AddWeaponToMarket } from '../../../components/weaponMarketComponents/AddWeaponToMarket';
import { RemoveWeaponFromMarket } from '../../../components/weaponMarketComponents/RemoveWeaponFromMarket';
import { checkMarketWeaponValidity } from '../../MarketPlace/functions/marketInteractions';
import { EquippedWeapon } from './EquippedWeapon';
import { AddOrEditWeapon } from './AddOrEditWeapon';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { WeaponList } from './WeaponList';


interface CharWeaponsState {
    character: CharacterModel
    addWeapon: boolean
    dicePicked: string
    weaponList: WeaponModal[]
    pickedWeapon: WeaponModal
    weaponBeingEdited: WeaponModal | null
    loading: boolean
}

export class CharWeapons extends Component<{ navigation: any, route: any }, CharWeaponsState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            loading: false,
            weaponBeingEdited: null,
            pickedWeapon: new WeaponModal(),
            weaponList: [],
            dicePicked: '',
            addWeapon: false,
            character: this.props.route.params.char,
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



    marketPlaceNode = () => {
        const validity = checkMarketWeaponValidity(this.state.pickedWeapon.marketStatus, this.context.user._id);
        if (validity === 'NOT_OWNED') return <View></View>
        if (validity === 'OWNED_NOT_PUBLISHED') return <AddWeaponToMarket refreshWeapons={(updatedWeapon: WeaponModal) => this.refreshWeapons(updatedWeapon)} char_id={this.state.character._id || ''} weapon={this.state.pickedWeapon} />
        if (validity === 'OWNED_PUBLISHED') return <RemoveWeaponFromMarket refreshWeapons={(updatedWeapon: WeaponModal) => this.refreshWeapons(updatedWeapon)} char_id={this.state.character._id || ''} weapon={this.state.pickedWeapon} />
        return <View></View>
    }


    render() {
        return (
            <View style={styles.container}>

                <EquippedWeapon character={this.state.character} equippedWeapon={this.state.character.currentWeapon}
                    removeEquipped={(character: CharacterModel) => this.setState({ character })}
                    openEquippedWeaponModal={() => {
                        this.state.character.currentWeapon &&
                            this.setState({ pickedWeapon: this.state.character.currentWeapon })
                    }} />



                <AppButton marginBottom={15} backgroundColor={Colors.berries} color={Colors.totalWhite} width={80} height={50} borderRadius={25}
                    title={'Add Weapon'} onPress={() => this.setState({ addWeapon: true })} />
                <Modal isVisible={this.state.addWeapon || this.state.weaponBeingEdited !== null} animationIn="bounce" style={{
                    margin: 0,
                    marginTop: 30,
                    alignItems: undefined,
                    justifyContent: undefined,
                    backgroundColor: Colors.pageBackground,
                }} >
                    {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                        <AddOrEditWeapon
                            reloadWeapons={() => {
                                this.refreshWeapons(new WeaponModal())
                                this.setState({ addWeapon: false, weaponBeingEdited: null, loading: false })
                            }}
                            enterLoading={(val: boolean) => this.setState({ loading: val })}
                            character={this.state.character}
                            weaponBeingEdited={this.state.weaponBeingEdited}
                            cleanEditedWeapon={() => this.setState({ weaponBeingEdited: null, addWeapon: false, loading: false })} />
                    }
                </Modal>



                {
                    this.state.weaponList &&
                    <WeaponList
                        startEditWeapon={(weapon: WeaponModal) => this.setState({ weaponBeingEdited: weapon })}
                        weaponList={this.state.weaponList}
                        setPickedWeapon={(weapon: WeaponModal) => this.setState({ pickedWeapon: weapon })}
                        refreshList={() => this.refreshWeapons(new WeaponModal())}
                        sendEquippedCharacter={(character: CharacterModel) => this.setState({ character })}
                        character={this.state.character} />
                }
                <Modal isVisible={this.state.pickedWeapon.name !== undefined}>
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
                                        title={'Close'} onPress={() => { this.setState({ pickedWeapon: new WeaponModal() }) }} />
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
});