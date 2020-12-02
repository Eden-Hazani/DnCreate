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

interface SpacialRaceBonusesState {
    character: CharacterModel
    choice: any
    itemClicked: boolean[],
    itemPicked: any[]
    amountToPick: number
    confirmed: boolean
    extraLanguages: string[]
    extraLanguagesNumber: number
    race: RaceModel

    secondItemClicked: boolean[],
    secondItemPicked: any[]
    secondAmountToPick: number
}

export class SpacialRaceBonuses extends Component<{ navigation: any, route: any }, SpacialRaceBonusesState>{
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            extraLanguages: [],
            confirmed: false,
            amountToPick: null,
            itemClicked: [],
            itemPicked: [],
            choice: null,
            character: store.getState().character,
            extraLanguagesNumber: null,
            race: this.props.route.params.race,
            secondItemClicked: [],
            secondItemPicked: [],
            secondAmountToPick: null
        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    onFocus = () => {
        const character = { ...this.state.character };
        character.languages = [];
        character.skills = [];
        character.addedWeaponProf = [];
        character.tools = [];
        this.setState({ character }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
        })
    }

    componentDidMount() {
        const character = { ...this.state.character };
        character.languages = [];
        character.skills = [];
        character.addedWeaponProf = [];
        character.tools = [];
        if (this.state.character.race === "DragonBorn") {
            this.setState({ amountToPick: 1 })
        }
        if (this.state.character.race === "Warforged") {
            this.setState({ amountToPick: 1, secondAmountToPick: 1, extraLanguagesNumber: 1 })
        }
        if (this.state.character.race === "Human") {
            this.setState({ extraLanguagesNumber: 1 })
        }
        if (this.state.character.race === "Dwarf") {
            this.setState({ amountToPick: 1 })
        }
        if (this.state.character.race === "Kenku") {
            this.setState({ amountToPick: 2 })
        }
        if (this.state.character.race === "Half Elf") {
            this.setState({ extraLanguagesNumber: 1, amountToPick: 2 })
        }
        if (this.state.character.race === "Changeling") {
            this.setState({ extraLanguagesNumber: 2, amountToPick: 2 })
        }
        this.setState({ character })
    }

    pickItem = (item: any, index: number) => {
        if (!this.state.itemClicked[index]) {
            if (this.state.amountToPick === this.state.itemPicked.length) {
                alert(`You can only pick ${this.state.amountToPick}`)
                return
            }
            const itemPicked = this.state.itemPicked;
            const itemClicked = this.state.itemClicked;
            itemClicked[index] = true;
            itemPicked.push(item)
            this.setState({ itemClicked, itemPicked });
        }
        else if (this.state.itemClicked[index]) {
            const oldPickedItems = this.state.itemPicked;
            const itemClicked = this.state.itemClicked;
            itemClicked[index] = false;
            if (this.state.character.race === "Changeling") {
                const itemPicked = oldPickedItems.filter(skill => skill[0] !== item[0]);
                this.setState({ itemClicked, itemPicked });
                return
            }
            const itemPicked = oldPickedItems.filter(item => item.name !== item.name);
            this.setState({ itemClicked, itemPicked });
        }
    }

    pickSecondItem = (item: any, index: number) => {
        if (!this.state.secondItemClicked[index]) {
            if (this.state.secondAmountToPick === this.state.secondItemPicked.length) {
                alert(`You can only pick ${this.state.secondAmountToPick}`)
                return
            }
            const secondItemPicked = this.state.secondItemPicked;
            const secondItemClicked = this.state.secondItemClicked;
            secondItemClicked[index] = true;
            secondItemPicked.push(item)
            this.setState({ secondItemClicked, secondItemPicked });
        }
        else if (this.state.secondItemClicked[index]) {
            const oldPickedItems = this.state.secondItemPicked;
            const secondItemClicked = this.state.secondItemClicked;
            secondItemClicked[index] = false;
            if (this.state.character.race === "Changeling") {
                const secondItemPicked = oldPickedItems.filter(skill => skill[0] !== item[0]);
                this.setState({ secondItemClicked, secondItemPicked });
                return
            }
            const secondItemPicked = oldPickedItems.filter(item => item.name !== item.name);
            this.setState({ secondItemClicked, secondItemPicked });
        }
    }

    insertInfoAndContinue = () => {
        const character = { ...this.state.character };
        if (this.state.character.race === "Changeling") {
            character.languages.push("Common")
        }
        if (this.state.character.race === "Goblin") {
            character.languages.push("Common", "Goblin")
        }
        if (this.state.character.race === "Kenku") {
            if (this.state.amountToPick > this.state.itemPicked.length) {
                alert('Must pick 2 skills from the list')
                return;
            }
            for (let item of this.state.itemPicked) {
                character.skills.push([item, 0])
            }
            character.languages.push("Common", "Auran")
        }
        if (this.state.character.race === "DragonBorn") {
            if (this.state.amountToPick > this.state.itemPicked.length) {
                alert('Must pick ancestry')
                return
            }
            character.charSpecials.dragonBornAncestry = this.state.itemPicked[0];
            character.languages.push("Common", "Draconic")
        }
        if (this.state.character.race === "Human") {
            if (this.state.extraLanguagesNumber > this.state.extraLanguages.length) {
                alert('You have another language to add')
                return
            }
            character.languages.push("Common")
        }
        if (this.state.character.race === "Dwarf") {
            if (this.state.amountToPick > this.state.itemPicked.length) {
                alert('Must pick tool proficiency')
                return
            }
            character.addedWeaponProf.push("battleaxe", "handaxe", "light hammer", "warhammer")
            character.languages.push("Common", "Dwarvish")
            character.tools.push([this.state.itemPicked[0], 0])
        }
        if (this.state.character.race === "Elf") {
            character.skills.push(["Perception", 0])
            character.languages.push("Common", "Elven")
        }
        if (this.state.character.race === "Half Orc") {
            character.skills.push(["Intimidation", 0])
            character.languages.push("Common", "Orc")
        }
        if (this.state.character.race === "Gnome") {
            character.languages.push("Common", "Gnomish")
        }
        if (this.state.character.race === "Half Elf") {
            if (this.state.extraLanguagesNumber > this.state.extraLanguages.length) {
                alert('You have another language to add')
                return
            }
            if (this.state.amountToPick > this.state.itemPicked.length) {
                alert('Must pick 2 skills from the list')
                return;
            }
            for (let item of this.state.itemPicked) {
                character.skills.push([item, 0])
            }
            character.languages.push("Common", "Elven")
        }
        if (this.state.character.race === "Halfling") {
            character.languages.push("Common", "Halfling")
        }
        if (this.state.character.race === "Tiefling") {
            character.languages.push("Common", "Infernal")
        }

        if (this.state.character.race === "Warforged") {
            if (this.state.amountToPick > this.state.itemPicked.length) {
                alert('Must pick 1 tool from the list')
                return;
            }
            if (this.state.secondAmountToPick > this.state.secondItemPicked.length) {
                alert('Must pick 1 skill from the list')
                return;
            }
            if (this.state.extraLanguagesNumber > this.state.extraLanguages.length) {
                alert('You have another language to add')
                return
            }
        }
        for (let language of this.state.race?.languages) {
            character.languages.push(language)
        }
        for (let item of this.state.extraLanguages) {
            character.languages.push(item)
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


    render() {
        const dwarfTools = ["Smith's tools", "Brewer's supplies", "Mason's tools"];
        const kenkuSkills = ["Acrobatics", "Deception", "Stealth", "Sleight of Hand"]
        const fullSkillList = ['Athletics', 'Acrobatics', 'Sleight of Hand', 'Stealth', 'Arcana', 'History', 'Investigation',
            'Nature', 'Religion', 'Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival', 'Deception',
            'Intimidation', 'Performance', 'Persuasion']
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
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.race.raceAbilities.age.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Alignment:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.race.raceAbilities.alignment.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Languages:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.race.raceAbilities.languages.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={20} padding={10} color={Colors.whiteInDarkMode} textAlign={'left'}>Size:</AppText>
                            <AppText fontSize={18} padding={5} color={Colors.berries} textAlign={'center'}>{this.state.race.raceAbilities.size.replace(/\. /g, '.\n\n')}</AppText>
                            <AppText fontSize={18} padding={10} color={Colors.berries} textAlign={'center'}>Speed: {this.state.race.raceAbilities.speed}ft</AppText>
                        </View>
                        {this.state.race.raceAbilities?.uniqueAbilities &&
                            Object.values(this.state.race.raceAbilities.uniqueAbilities)
                                .map((item, index) => <View key={index} style={[styles.featureItem, { backgroundColor: Colors.pinkishSilver, borderColor: Colors.berries }]}>
                                    <AppText fontSize={22}>{item.name}</AppText>
                                    <AppText fontSize={17} color={Colors.berries}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                                </View>)}

                        {this.state.character.race === "Changeling" &&
                            <View style={{ padding: 15 }}>
                                <AppText textAlign={'center'} fontSize={18}>As a Changeling you can read speak and write Common.</AppText>
                            </View>
                        }
                        {this.state.character.race === "Kenku" &&
                            <View style={{ padding: 15 }}>
                                <AppText textAlign={'center'} fontSize={18}>As a Kenku You can read and write Common and Auran, but you can speak only by using your Mimicry trait.</AppText>
                                <AppText textAlign={'center'} fontSize={18}>You also gain proficiency in two skills of your choice</AppText>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    {kenkuSkills.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                            onPress={() => this.pickItem(item, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                                        </TouchableOpacity>)}
                                </View>
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
                                    {dragonAncestry.ancestry.map((ancestry, index) =>
                                        <TouchableOpacity key={index} style={[styles.largeItem, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray, borderColor: Colors.whiteInDarkMode }]}
                                            onPress={() => this.pickItem(ancestry, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>Dragon color: {ancestry.color}</AppText>
                                            <AppText textAlign={'center'} fontSize={18}>Damage type: {ancestry.damageType}</AppText>
                                            <AppText textAlign={'center'} fontSize={18}>Breath Attack: {ancestry.breath}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                            </View>
                        }
                        {this.state.character.race === "Human" &&
                            <View style={{ padding: 15 }}>
                                <AppText textAlign={'center'} fontSize={18}>As a Human you can read speak and write Common and another extra language of your choice.</AppText>
                                <AppTextInput placeholder={"Language..."} onChangeText={(txt: string) => {
                                    const extraLanguages = this.state.extraLanguages;
                                    extraLanguages[0] = txt;
                                    this.setState({ extraLanguages })
                                }} />
                            </View>
                        }
                        {this.state.character.race === "Dwarf" &&
                            <View>
                                <View style={{ padding: 15 }}>
                                    <AppText textAlign={'center'} fontSize={22}>You also get to pick one tool to get proficiency with</AppText>
                                </View>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    {dwarfTools.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                            onPress={() => this.pickItem(item, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                            </View>
                        }

                        {this.state.character.race === "Warforged" &&
                            <View>
                                <View style={{ padding: 15 }}>
                                    <AppText textAlign={'center'} fontSize={22}>As a Warforged you get to pick one tool proficiency</AppText>
                                </View>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    {toolJson.tools.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                            onPress={() => this.pickItem(item, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                                <View style={{ padding: 15 }}>
                                    <AppText textAlign={'center'} fontSize={22}>You also pick one skill proficiency</AppText>
                                </View>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    {skillJson.skillList.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.secondItemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                            onPress={() => this.pickSecondItem(item, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                                <AppText textAlign={'center'} fontSize={22}>And one extra language</AppText>
                                <AppTextInput placeholder={"Language..."} onChangeText={(txt: string) => {
                                    const extraLanguages = this.state.extraLanguages;
                                    extraLanguages[0] = txt;
                                    this.setState({ extraLanguages })
                                }} />
                            </View>
                        }

                        {this.state.character.race === "Half Elf" &&
                            <View style={{ padding: 15 }}>
                                <AppText textAlign={'center'} fontSize={18}>As a Half Elf you can read speak and write Common, Elven and another extra language of your choice.</AppText>
                                <AppText textAlign={'center'} fontSize={18}> You also gain proficiency in two skills of your choice.</AppText>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: 'center' }}>
                                    {fullSkillList.map((item, index) =>
                                        <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.itemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray, borderColor: Colors.whiteInDarkMode }]}
                                            onPress={() => this.pickItem(item, index)}>
                                            <AppText textAlign={'center'} fontSize={18}>{item}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                                <AppTextInput placeholder={"Language..."} onChangeText={(txt: string) => {
                                    const extraLanguages = this.state.extraLanguages;
                                    extraLanguages[0] = txt;
                                    this.setState({ extraLanguages })
                                }} />
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