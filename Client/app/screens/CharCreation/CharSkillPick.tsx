import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Unsubscribe } from 'redux';
import skillSwitch from '../../../utility/skillsSwitch';
import userCharApi from '../../api/userCharApi';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import AsyncStorage from '@react-native-community/async-storage';
import { CharSpacialModel } from '../../models/CharSpacialModel';
import { startingToolsSwitch } from '../../../utility/startingToolsSwitch';


interface CharSkillPickState {
    characterInfo: CharacterModel
    availableSkills: string[]
    pickedSkills: any[]
    amountToPick: number
    loading: boolean
    skillClicked: boolean[]
    confirmed: boolean
}

export class CharSkillPick extends Component<{ navigation: any }, CharSkillPickState> {
    private UnsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            skillClicked: [],
            loading: true,
            amountToPick: null,
            availableSkills: [],
            pickedSkills: [],
            characterInfo: store.getState().character
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
        this.setState({ availableSkills: skillList, amountToPick: amount, skillClicked })
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (this.state.pickedSkills.length < this.state.amountToPick) {
            alert(`You still have ${this.state.amountToPick - this.state.pickedSkills.length} skills to pick`)
            return;
        }
        characterInfo.skills = this.state.pickedSkills;
        characterInfo.tools = startingToolsSwitch(this.state.characterInfo.characterClass);
        characterInfo.charSpecials = new CharSpacialModel();
        Object.keys(characterInfo.charSpecials).forEach(v => {
            characterInfo.charSpecials[v] = false
            characterInfo.charSpecials.sorcererMetamagic = []
            characterInfo.charSpecials.eldritchInvocations = []
        })
        this.setState({ characterInfo }, () => {
            userCharApi.saveChar(this.state.characterInfo).then(result => {
                let characterInfo: CharacterModel;
                result.data === 'Character Already exists in system!' ? characterInfo = this.state.characterInfo : characterInfo = result.data;
                this.setState({ confirmed: true })
                this.setState({ characterInfo }, async () => {
                    store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
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
                                <AppText fontSize={30} color={colors.bitterSweetRed}>Skill Picking</AppText>
                                <AppText>As a {this.state.characterInfo.characterClass} you can pick up to {this.state.amountToPick} skills</AppText>
                                <AppText textAlign={"center"}>Talk with your fellow adventurers before this stage and try to build a versatile team with different skills.</AppText>
                                <FlatList
                                    data={this.state.availableSkills}
                                    keyExtractor={(stats: any, index) => index.toString()}
                                    numColumns={2}
                                    renderItem={({ item, index }) =>
                                        <TouchableOpacity style={[styles.item, { backgroundColor: this.state.skillClicked[index] ? colors.bitterSweetRed : colors.lightGray }]}
                                            onPress={() => this.pickSkill(item, index)}>
                                            <AppText>{item}</AppText>
                                        </TouchableOpacity>
                                    } />
                                <View style={{ paddingBottom: 25 }}>
                                    <AppButton fontSize={18} backgroundColor={colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                                </View>
                            </View>}
                    </View>}
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
        borderColor: colors.black,
        borderRadius: 25
    }
});