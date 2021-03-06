import React, { Component } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Unsubscribe } from 'redux';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface SpacialProficiencyRacesState {
    characterInfo: CharacterModel
    totalPoints: number
    pickedAbilities: string[]
    abilityClicked: boolean[]
    loading: boolean
    race: RaceModel
}

const abilities = ["strength", "constitution", "dexterity", "intelligence", "wisdom", "charisma"]

export class SpacialProficiencyRaces extends Component<{ navigation: any, route: any }, SpacialProficiencyRacesState>{
    private UnsubscribeStore: Unsubscribe;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            race: this.props.route.params.race,
            loading: true,
            abilityClicked: [],
            pickedAbilities: [],
            totalPoints: 0,
            characterInfo: store.getState().character
        }
        this.UnsubscribeStore = store.subscribe(() => { })
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);

    }

    onFocus = () => {
        const characterInfo = { ...this.state.characterInfo }
        characterInfo.strength = this.state.race.abilityBonus && this.state.race.abilityBonus.strength;
        characterInfo.constitution = this.state.race.abilityBonus && this.state.race.abilityBonus.constitution;
        characterInfo.dexterity = this.state.race.abilityBonus && this.state.race.abilityBonus.dexterity;
        characterInfo.charisma = this.state.race.abilityBonus && this.state.race.abilityBonus.charisma;
        characterInfo.wisdom = this.state.race.abilityBonus && this.state.race.abilityBonus.wisdom;
        characterInfo.intelligence = this.state.race.abilityBonus && this.state.race.abilityBonus.intelligence;
        this.setState({ abilityClicked: [], pickedAbilities: [], characterInfo }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
        })
    }

    componentWillUnmount() {
        this.UnsubscribeStore()
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ loading: false })
        }, 1000);
        this.setState({ totalPoints: this.state.race.changeBaseAttributePoints?.amount || 0 })
        const abilityClicked = [];
        for (let item of abilities) {
            abilityClicked.push(false);
        }
        this.setState({ abilityClicked })
    }

    pickAbility = (ability: string, index: number) => {
        if (!this.state.abilityClicked[index]) {
            if (this.state.totalPoints === this.state.pickedAbilities.length) {
                alert(`As an${this.state.characterInfo.race} you only have ${this.state.totalPoints} abilities to pick`)
                return
            }
            const pickedAbilities = this.state.pickedAbilities;
            const abilityClicked = this.state.abilityClicked;
            abilityClicked[index] = true;
            pickedAbilities.push(ability)
            this.setState({ abilityClicked, pickedAbilities });
        }
        else if (this.state.abilityClicked[index]) {
            const oldPickedAbilities = this.state.pickedAbilities;
            const abilityClicked = this.state.abilityClicked;
            abilityClicked[index] = false;
            const pickedAbilities = oldPickedAbilities.filter(item => item !== ability);
            this.setState({ abilityClicked, pickedAbilities });
        }
    }

    insertInfoAndContinue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (this.state.pickedAbilities.length < this.state.totalPoints) {
            alert(`You still have ${this.state.totalPoints - this.state.pickedAbilities.length} ability points`)
            return;
        }
        for (let ability of this.state.pickedAbilities) {
            characterInfo[ability] = characterInfo[ability] + 1
        }
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
            this.props.navigation.navigate("SpacialRaceBonuses", { race: this.state.race });
        })
    }
    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", padding: 25 }}>
                            <AppText textAlign={'center'} fontSize={18}>You Have picked the {this.state.characterInfo.race} race</AppText>
                            <AppText fontSize={16} textAlign={'center'}>As a {this.state.characterInfo.race} you have {this.state.totalPoints} points that you can add to an ability of your choice </AppText>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <FlatList
                                data={abilities}
                                keyExtractor={(stats: any, index) => index.toString()}
                                numColumns={2}
                                renderItem={({ item, index }) =>
                                    <TouchableOpacity style={[styles.item, { backgroundColor: this.state.abilityClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                        onPress={() => this.pickAbility(item, index)}>
                                        <AppText>{item}</AppText>
                                    </TouchableOpacity>
                                } />
                        </View>
                        <View>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100}
                                width={110} height={110} title={"Continue"} onPress={() => { this.insertInfoAndContinue() }} />
                        </View>
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: Dimensions.get('screen').width / 2.5,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});