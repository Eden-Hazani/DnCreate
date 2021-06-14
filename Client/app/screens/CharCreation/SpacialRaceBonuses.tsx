import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { CharacterModel } from '../../models/characterModel';
import { store } from '../../redux/store';
import dragonAncestry from '../../../jsonDump/dragonAncestry.json'
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { ActionType } from '../../redux/action-type';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppTextInput } from '../../components/forms/AppTextInput';
import { RaceModel } from '../../models/raceModel';
import skillJson from '../../../jsonDump/skillList.json';
import toolJson from '../../../jsonDump/toolList.json';
import { PickSingleItem } from './helperFunctions/PickSingleItem';
import { SearchableTextDropDown } from '../../components/SearchableTextDropDown';
import { PickLanguage } from '../../components/PickLanguage';

interface SpacialRaceBonusesState {
    character: CharacterModel
    confirmed: boolean
    extraLanguages: string[]
    race: RaceModel
    weaponProficiencies: string[]
    pickedAncestry: any,
    pickedSkills: any[]
    pickedTools: any[]
    customWeapons: any[]
    customArmor: any[]
}

export class SpacialRaceBonuses extends Component<{ navigation: any, route: any }, SpacialRaceBonusesState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            pickedAncestry: null,
            weaponProficiencies: [],
            extraLanguages: [],
            confirmed: false,
            character: store.getState().character,
            race: this.props.route.params.race,


            customWeapons: [],
            customArmor: [],
            pickedSkills: [],
            pickedTools: []
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        const character = { ...this.state.character };
        character.languages = [];
        character.skills = [];
        character.addedWeaponProf = [];
        character.addedArmorProf = [];
        character.tools = [];
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
        })
    }

    insertInfoAndContinue = () => {
        if (!this.validate()) {
            return
        }
        const character = { ...this.state.character };
        character.languages = [];
        character.skills = [];
        character.addedWeaponProf = [];
        character.addedArmorProf = [];
        character.tools = [];
        character.languages = [];

        if (this.state.race?.languages) {
            for (let language of this.state.race?.languages) {
                character.languages.push(language)
            }
        }
        if (this.state.race.baseAddedSkills) {
            for (let item of this.state.race.baseAddedSkills) {
                character.skills.push([item, 0])
            }
        }
        if (this.state.race.baseArmorProficiencies) {
            for (let item of this.state.race.baseArmorProficiencies) {
                character.addedArmorProf.push(item)
            }
        }
        if (this.state.race.baseWeaponProficiencies) {
            for (let item of this.state.race.baseWeaponProficiencies) {
                character.addedWeaponProf.push(item)
            }
        }
        if (this.state.race.name === "DragonBorn") {
            if (this.state.pickedAncestry === null) {
                alert('Must pick Ancestry');
                return
            }
            if (character.charSpecials) {
                character.charSpecials.dragonBornAncestry = this.state.pickedAncestry
            }
        }
        for (let item of this.state.extraLanguages) {
            character.languages.push(item)
        }
        for (let item of this.state.pickedSkills) {
            character.skills.push([item, 0])
        }
        for (let item of this.state.pickedTools) {
            character.tools.push([item, 0])
        }
        for (let item of this.state.customArmor) {
            character.addedArmorProf.push(item)
        }
        for (let item of this.state.customWeapons) {
            character.addedWeaponProf.push(item)
        }
        this.setState({ character, confirmed: true }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
            setTimeout(() => {
                this.props.navigation.navigate("NewCharInfo", { race: this.state.race });
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        })
    }

    displayExtraLanguages = (amount: number) => {
        let jsx: any[] = []
        for (let i = 0; i < amount; i++) {
            jsx.push(
                <PickLanguage resetLanguage={undefined} width={'100%'} key={i} passLanguage={(language: string) => {
                    const extraLanguages = this.state.extraLanguages;
                    extraLanguages[i] = language;
                    this.setState({ extraLanguages })
                }} />
            )
        }
        return jsx
    }
    displayCustomWeapons = (amount: number) => {
        let jsx: any[] = []
        for (let i = 0; i < amount; i++) {
            jsx.push(<AppTextInput key={i} placeholder={"Weapon..."} onChangeText={(txt: string) => {
                const customWeapons = this.state.customWeapons;
                customWeapons[i] = txt;
                this.setState({ customWeapons })
            }} />)
        }
        return jsx
    }
    displayCustomArmor = (amount: number) => {
        let jsx: any[] = []
        for (let i = 0; i < amount; i++) {
            jsx.push(<AppTextInput key={i} placeholder={"Armor..."} onChangeText={(txt: string) => {
                const customArmor = this.state.customArmor;
                customArmor[i] = txt;
                this.setState({ customArmor })
            }} />)
        }
        return jsx
    }

    validate = () => {
        if (this.state.race.extraLanguages && this.state.race.extraLanguages > 0) {
            if (this.state.extraLanguages.length < this.state.race.extraLanguages) {
                alert("You still have languages to pick");
                return false;
            }
            for (let item of this.state.extraLanguages) {
                if (item === '') {
                    alert("You still have languages to pick");
                    return false;
                }
            }
        }
        if (this.state.race.skillPickChoice && this.state.race.skillPickChoice?.amountToPick > 0) {
            if (this.state.pickedSkills.length < this.state.race.skillPickChoice?.amountToPick) {
                alert("You still have skills to pick");
                return false;
            }
        }
        if (this.state.race.toolProficiencyPick && this.state.race.toolProficiencyPick?.amountToPick > 0) {
            if (this.state.pickedTools.length < this.state.race.toolProficiencyPick?.amountToPick) {
                alert("You still have tools to pick");
                return false;
            }
        }
        return true;
    }


    render() {
        return (
            <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ padding: 15, justifyContent: "center", alignItems: 'center' }}>
                            <Image style={{ width: 150, height: 150 }} source={require("../../../assets/raceDragon.png")} />

                            <AppText textAlign={'center'} fontSize={22}>Below is the information related to your chosen race.</AppText>
                            <AppText textAlign={'center'} fontSize={22}>Take the time to read about your unique abilities.</AppText>
                        </View>
                        <View style={{ padding: 15 }}>
                            <AppText textAlign={'center'} fontSize={22}>As a {this.state.character.race} you get the following features.</AppText>
                        </View>
                        <View style={[styles.featureItem, { backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries }]}>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Age:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{(this.state.race.raceAbilities !== undefined && this.state.race.raceAbilities.age !== undefined) && this.state.race.raceAbilities.age.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Alignment:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{(this.state.race.raceAbilities !== undefined && this.state.race.raceAbilities.alignment !== undefined) && this.state.race.raceAbilities.alignment.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Languages:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{(this.state.race.raceAbilities !== undefined && this.state.race.raceAbilities.languages !== undefined) && this.state.race.raceAbilities.languages.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Size:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{(this.state.race.raceAbilities !== undefined && this.state.race.raceAbilities.size !== undefined) && this.state.race.raceAbilities.size.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Speed: {this.state.race.raceAbilities !== undefined && this.state.race.raceAbilities.speed}ft</AppText>
                            {(this.state.race.addedACPoints !== 0) &&
                                <View>
                                    <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>AC Bonus Points: {this.state.race.addedACPoints}</AppText>
                                </View>
                            }
                            {this.state.race.baseAddedSkills && this.state.race.baseAddedSkills?.length > 0 &&
                                <View>
                                    <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'center'}>You gain the following skill proficiencies:</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: 'wrap' }}>
                                        {this.state.race.baseAddedSkills.map((item, index) => <View style={{ margin: 3 }} key={index}>
                                            <AppText color={Colors.berries} fontSize={17}>{item},</AppText>
                                        </View>
                                        )}
                                    </View>
                                </View>
                            }
                            {this.state.race.baseAddedTools && this.state.race.baseAddedTools?.length > 0 &&
                                <View>
                                    <AppText textAlign={'center'} fontSize={20} padding={5} color={Colors.whiteInDarkMode} >You gain the following tool proficiencies:</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: 'wrap' }}>
                                        {this.state.race.baseAddedTools.map((item, index) => <View style={{ margin: 3 }} key={index}>
                                            <AppText color={Colors.berries} fontSize={17}>{item},</AppText>
                                        </View>)}
                                    </View>
                                </View>
                            }
                            {this.state.race.baseWeaponProficiencies && this.state.race.baseWeaponProficiencies?.length > 0 &&
                                <View>
                                    <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>You gain the following weapon proficiencies:</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: 'wrap' }}>
                                        {this.state.race.baseWeaponProficiencies.map((item, index) => <View style={{ margin: 3 }} key={index}>
                                            <AppText color={Colors.berries} fontSize={17}>{item},</AppText>
                                        </View>)}
                                    </View>
                                </View>
                            }
                            {this.state.race.baseArmorProficiencies && this.state.race.baseArmorProficiencies?.length > 0 &&
                                <View>
                                    <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>You gain the following Armor proficiencies:</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: 'wrap' }}>
                                        {this.state.race.baseArmorProficiencies.map((item, index) => <View style={{ margin: 3 }} key={index}>
                                            <AppText color={Colors.berries} fontSize={17}>{item},</AppText>
                                        </View>)}
                                    </View>
                                </View>
                            }
                        </View>

                        {this.state.race.raceAbilities?.uniqueAbilities &&
                            Object.values(this.state.race.raceAbilities.uniqueAbilities)
                                .map((item, index) => <View key={index} style={[styles.featureItem, { backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries }]}>
                                    <AppText fontSize={22}>{item.name}</AppText>
                                    <AppText fontSize={17} color={Colors.berries}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                                </View>)}

                        {this.state.character.addedRaceFeatures &&
                            this.state.character.addedRaceFeatures.map((item, index) => {
                                return <View key={index} style={[styles.featureItem, { backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries }]}>
                                    <AppText fontSize={22}>{item.name}</AppText>
                                    <AppText fontSize={17} color={Colors.berries}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                                </View>
                            })
                        }

                        {this.state.race.extraLanguages !== undefined && this.state.race.extraLanguages !== 0 &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText textAlign={'center'} fontSize={18}>You can learn {this.state.race.extraLanguages} extra languages</AppText>
                                {this.displayExtraLanguages(this.state.race.extraLanguages).map((item, index) => item)}
                            </View>
                        }

                        {this.state.race.skillPickChoice && this.state.race.skillPickChoice?.amountToPick > 0 &&
                            <View>
                                <AppText textAlign={'center'} fontSize={18}>You can choose {this.state.race.skillPickChoice.amountToPick} extra skills</AppText>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    <PickSingleItem isObject={false} amountToPick={this.state.race.skillPickChoice.amountToPick}
                                        onPick={(pickedSkills: any) => this.setState({ pickedSkills })}
                                        itemList={this.state.race.skillPickChoice.skillList} />
                                </View>
                            </View>
                        }

                        {this.state.race.toolProficiencyPick && this.state.race.toolProficiencyPick?.amountToPick > 0 &&
                            <View>
                                <AppText textAlign={'center'} fontSize={18}>You can choose {this.state.race.toolProficiencyPick.amountToPick} extra tools</AppText>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    <PickSingleItem isObject={false} amountToPick={this.state.race.toolProficiencyPick.amountToPick}
                                        onPick={(pickedTools: any) => this.setState({ pickedTools })}
                                        itemList={this.state.race.toolProficiencyPick.toolList} />
                                </View>
                            </View>
                        }

                        {this.state.race.customWeaponProficiencies &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText textAlign={'center'} fontSize={18}>You can learn {this.state.race.customWeaponProficiencies.amount} extra
                                    {this.state.race.customWeaponProficiencies.type} Weapon Proficiencies</AppText>
                                {this.displayCustomWeapons(this.state.race.customWeaponProficiencies.amount).map((item, index) => item)}
                            </View>
                        }

                        {this.state.race.customArmorProficiencies &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText textAlign={'center'} fontSize={18}>You can learn {this.state.race.customArmorProficiencies.amount}
                                    extra {this.state.race.customArmorProficiencies.type} Armor Proficiencies</AppText>
                                {this.displayCustomArmor(this.state.race.customArmorProficiencies.amount).map((item, index) => item)}
                            </View>
                        }

                        {this.state.character.race === "DragonBorn" &&
                            <View>
                                <View style={{ padding: 15 }}>
                                    <AppText textAlign={'center'} fontSize={18}>As a DragonBorn you gain damage resistance to the damage type associated with your ancestry.</AppText>
                                    <AppText textAlign={'center'} fontSize={18}>You also read speak and write Draconic</AppText>
                                </View>
                                <AppText textAlign={'center'} fontSize={18}>Pick your Draconic ancestry</AppText>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    <PickSingleItem amountToPick={1}
                                        onPick={(pickedAncestry: any) => this.setState({ pickedAncestry })}
                                        isObject={true}
                                        itemList={dragonAncestry.ancestry} />
                                </View>
                            </View>
                        }

                        <View style={{ paddingBottom: 25 }}>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                        </View>
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    largeItem: {
        width: 170,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 5,
        borderWidth: 1,
        borderRadius: 25
    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 5,
        borderWidth: 1,
        borderRadius: 25
    },
    featureItem: {
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderRadius: 15,

    }
});