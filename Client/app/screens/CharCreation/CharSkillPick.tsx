import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Unsubscribe } from 'redux';
import skillSwitch from '../../../utility/skillsSwitch';
import userCharApi from '../../api/userCharApi';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CharSpacialModel } from '../../models/CharSpacialModel';
import { startingToolsSwitch } from '../../../utility/startingToolsSwitch';
import { Register } from '../Register';
import authApi from '../../api/authApi';
import reduxToken from '../../auth/reduxToken';
import AuthContext from '../../auth/context';
import { UserModel } from '../../models/userModel';
import { SpellsModel } from '../../models/spellsModel';
import { killToolArrayDuplicates } from '../../../utility/killToolArrayDuplicates';

interface CharSkillPickState {
    characterInfo: CharacterModel
    availableSkills: string[]
    pickedSkills: any[]
    amountToPick: number
    loading: boolean
    skillClicked: boolean[]
    confirmed: boolean
    nonUserPauseModel: boolean
    registrationEmailSent: boolean
    username: string
    userInfo: UserModel
    password: string
    resendCountDown: boolean
    countDownTimerVal: number,
    alreadyPickedSkills: boolean[]
}

export class CharSkillPick extends Component<{ navigation: any, route: any }, CharSkillPickState> {
    private UnsubscribeStore: Unsubscribe;
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyPickedSkills: [],
            countDownTimerVal: 60,
            resendCountDown: false,
            userInfo: store.getState().user,
            username: '',
            password: '',
            registrationEmailSent: false,
            nonUserPauseModel: false,
            confirmed: false,
            skillClicked: [],
            loading: true,
            amountToPick: 0,
            availableSkills: [],
            pickedSkills: [],
            characterInfo: store.getState().beforeRegisterChar.name ? store.getState().beforeRegisterChar : store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { });
    }


    componentWillUnmount() {
        this.UnsubscribeStore();
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000);
        const { skillList, amount } = skillSwitch(this.state.characterInfo.characterClass)
        const skillClicked = [];
        for (let item of skillList) {
            skillClicked.push(false);
        }
        this.setState({ availableSkills: skillList, amountToPick: amount, skillClicked }, () => {
            if (this.state.characterInfo.skills) {
                for (let item of this.state.characterInfo.skills) {
                    if (this.state.availableSkills.includes(item[0])) {
                        const alreadyPickedSkills = this.state.alreadyPickedSkills;
                        alreadyPickedSkills[this.state.availableSkills.indexOf(item[0])] = true;
                        this.setState({ alreadyPickedSkills })
                    }
                }
            }
        })
        if (this.props.route?.params?.nonUser) {
            this.insertInfoAndContinue()
        }
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (this.state.pickedSkills.length < this.state.amountToPick) {
            alert(`You still have ${this.state.amountToPick - this.state.pickedSkills.length} skills to pick`)
            return;
        }
        for (let skill of this.state.pickedSkills) {
            if (characterInfo.skills)
                characterInfo.skills.push(skill)
        }
        characterInfo.spellCastingClass = this.state.characterInfo.characterClass;
        for (let item of startingToolsSwitch(this.state.characterInfo.characterClass)) {
            if (characterInfo.tools)
                characterInfo.tools.push(item)
        }
        characterInfo.equippedArmor = {
            id: '1',
            name: 'No Armor Equipped',
            ac: 10,
            baseAc: 10,
            armorBonusesCalculationType: 'none',
            disadvantageStealth: false,
            armorType: 'none'
        }
        characterInfo.charSpecials = new CharSpacialModel();
        Object.keys(characterInfo.charSpecials).forEach(v => {
            if (characterInfo.charSpecials) {
                characterInfo.charSpecials[v] = false
                characterInfo.charSpecials.sorcererMetamagic = []
                characterInfo.charSpecials.artificerInfusions = []
                characterInfo.charSpecials.currentInfusedItems = []
                characterInfo.charSpecials.eldritchInvocations = []
                characterInfo.charSpecials.battleMasterManeuvers = []
                characterInfo.charSpecials.fightingStyle = []
                characterInfo.charSpecials.monkElementsDisciplines = []
                characterInfo.charSpecials.companion = []
                let storeChar = store.getState().character.charSpecials;
                if (storeChar)
                    characterInfo.charSpecials.dragonBornAncestry = storeChar.dragonBornAncestry
            }
        })
        characterInfo.tools = killToolArrayDuplicates(characterInfo.tools || [])
        if (store.getState().nonUser) {
            if (this.context.user && this.context.user.username) {
                this.sendInfo(characterInfo)
                return;
            }
            this.setState({ nonUserPauseModel: true })
            return;
        }
        this.sendInfo(characterInfo)
    }

    sendInfo = async (characterInfo: CharacterModel) => {
        characterInfo.user_id = this.state.userInfo._id;
        // offline Saving
        if (this.context.user._id === "Offline") {
            characterInfo.personalityTraits = [];
            characterInfo.flaws = [];
            characterInfo.bonds = [];
            characterInfo.backStory = "";
            characterInfo.ideals = [];
            characterInfo.magic = {
                cantrips: 0,
                firstLevelSpells: 0,
                secondLevelSpells: 0,
                thirdLevelSpells: 0,
                forthLevelSpells: 0,
                fifthLevelSpells: 0,
                sixthLevelSpells: 0,
                seventhLevelSpells: 0,
                eighthLevelSpells: 0,
                ninthLevelSpells: 0,
            }
            characterInfo.level = 1;
            characterInfo.items = [];
            characterInfo.currency = {
                gold: 0,
                silver: 0,
                copper: 0
            }
            characterInfo.feats = [];
            characterInfo.pathFeatures = [];
            characterInfo.spells = new SpellsModel();
            characterInfo.spells.cantrips = [];
            characterInfo.spells.firstLevelSpells = [];
            characterInfo.spells.secondLevelSpells = [];
            characterInfo.spells.thirdLevelSpells = [];
            characterInfo.spells.forthLevelSpells = [];
            characterInfo.spells.fifthLevelSpells = [];
            characterInfo.spells.sixthLevelSpells = [];
            characterInfo.spells.seventhLevelSpells = [];
            characterInfo.spells.eighthLevelSpells = [];
            characterInfo.spells.ninthLevelSpells = [];
            characterInfo.differentClassSpellsToPick = [];
            characterInfo.nonClassAvailableSpells = [];
            characterInfo._id = Math.floor(100000000 + Math.random() * 900000000).toString();
            this.setState({ characterInfo, loading: true }, async () => {
                const stringedCharacters = await AsyncStorage.getItem('offLineCharacterList');
                if (!stringedCharacters) {
                    await AsyncStorage.setItem(`offLineCharacterList`, JSON.stringify([this.state.characterInfo]))
                }
                if (stringedCharacters) {
                    const characters = JSON.parse(stringedCharacters);
                    characters.push(this.state.characterInfo);
                    await AsyncStorage.setItem(`offLineCharacterList`, JSON.stringify(characters))
                }
                this.setState({ confirmed: true, loading: false })
                store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                store.dispatch({ type: ActionType.addNewCharacter, payload: this.state.characterInfo })
                await AsyncStorage.setItem(`${this.state.characterInfo._id}FirstTimeOpened`, 'false')
                setTimeout(() => {
                    this.props.navigation.navigate("CharBackstory", { updateStory: false });
                }, 800);
                setTimeout(() => {
                    this.setState({ confirmed: false })
                }, 1100);
            })
            return;
        }
        this.setState({ characterInfo }, async () => {
            if (store.getState().beforeRegisterChar.name) {
                store.dispatch({ type: ActionType.ClearInfoBeforeRegisterChar })
                store.dispatch({ type: ActionType.StartAsNonUser, payload: false })
            }
            await AsyncStorage.removeItem(`${this.state.characterInfo.name}AttributeStage`);
            await AsyncStorage.removeItem(`${this.state.characterInfo.name}DicePool`);
            await AsyncStorage.removeItem(`${this.state.characterInfo.name}BackstoryStage`);
            userCharApi.saveChar(this.state.characterInfo).then((result: any) => {
                let characterInfo: CharacterModel;
                result.data === 'Character Already exists in system!' ? characterInfo = this.state.characterInfo : characterInfo = result.data;
                this.setState({ confirmed: true })
                this.setState({ characterInfo }, async () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
                    store.dispatch({ type: ActionType.addNewCharacter, payload: this.state.characterInfo })
                    await AsyncStorage.setItem(`${this.state.characterInfo._id}FirstTimeOpened`, 'false')
                    setTimeout(() => {
                        this.props.navigation.navigate("CharBackstory", { updateStory: false });
                    }, 800);
                    setTimeout(() => {
                        this.setState({ confirmed: false })
                    }, 1100);
                })
            });
        })
    }

    pickSkill = (skill: string, index: number) => {
        if (!this.state.skillClicked[index]) {
            if (this.state.amountToPick === this.state.pickedSkills.length) {
                alert(`${this.state.characterInfo.characterClass} has only ${this.state.amountToPick} skill to pick`)
                return
            }
            const pickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = true;
            pickedSkills.push([skill, 0])
            this.setState({ skillClicked, pickedSkills });
        }
        else if (this.state.skillClicked[index]) {
            const oldPickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = false;
            const pickedSkills = oldPickedSkills.filter(item => item[0] !== skill);
            this.setState({ skillClicked, pickedSkills });
        }
    }



    render() {
        const character = this.state.characterInfo;
        return (
            <View style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                            <View style={{ alignItems: "center" }}>
                                <AppText fontSize={30} color={Colors.bitterSweetRed}>Skill Picking</AppText>
                                <AppText>As a {this.state.characterInfo.characterClass} you can pick up to {this.state.amountToPick} skills</AppText>
                                <AppText textAlign={"center"}>Talk with your fellow adventurers before this stage and try to build a versatile team with different skills.</AppText>
                                <FlatList
                                    data={this.state.availableSkills}
                                    keyExtractor={(stats: any, index) => index.toString()}
                                    numColumns={2}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity style={[styles.item, { backgroundColor: this.state.alreadyPickedSkills[index] ? Colors.berries : this.state.skillClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]} disabled={this.state.alreadyPickedSkills[index]}
                                            onPress={() => this.pickSkill(item, index)}>
                                            <AppText>{item}</AppText>
                                        </TouchableOpacity>
                                    } />
                                <View style={{ paddingBottom: 25 }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                                </View>
                            </View>}
                    </View>}
                <Modal visible={this.state.nonUserPauseModel}>
                    <ScrollView keyboardShouldPersistTaps="always" style={{ backgroundColor: Colors.pageBackground, padding: 15, paddingTop: 20, paddingBottom: 40 }}>
                        <AppText textAlign={'center'} fontSize={35} color={Colors.berries}>Hi!</AppText>
                        <AppText textAlign={'center'} fontSize={20}>wasn't that fun?!</AppText>
                        <AppText textAlign={'center'} fontSize={20}>Told you it would be easy.</AppText>
                        <AppText textAlign={'center'} fontSize={20}>Now the last step is a FREE registration and you will be able to open and maintain an UNLIMITED number of characters!</AppText>
                        <AppText textAlign={'center'} fontSize={20}>Plus use DnCreate's adventure mode with your fellow party members!</AppText>
                        <AppText textAlign={'center'} fontSize={20}>Exciting right?, lets do this!</AppText>
                        <Register showCancelButt={true}
                            fireOnCancel={() => { this.props.navigation.navigate("Welcome") }}
                            navigation route isTutorial={this.state.characterInfo} turnOffTutorialModel={(val: boolean) => { this.setState({ nonUserPauseModel: val }) }} />
                    </ScrollView>
                </Modal>
            </View>

        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center"
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