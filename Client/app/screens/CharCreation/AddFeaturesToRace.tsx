import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

interface AddFeaturesToRaceState {
    race: RaceModel
    amountToPick: number
    featureClicked: boolean[]
    featuresAdded: any[]
    characterInfo: CharacterModel,
    confirmed: boolean
}
export class AddFeaturesToRace extends Component<{ navigation: any, route: any }, AddFeaturesToRaceState>{
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            featuresAdded: [],
            featureClicked: [],
            amountToPick: this.props.route.params.race.numberOfFeaturesToPick,
            race: this.props.route.params.race,
            characterInfo: store.getState().character
        }
    }
    pickFeature = (feature: any, index: number) => {
        if (!this.state.featureClicked[index]) {
            if (this.state.amountToPick === this.state.featuresAdded.length) {
                alert(`As a ${this.state.race.name} you only have ${this.state.amountToPick} features to pick`)
                return
            }
            const featuresAdded = this.state.featuresAdded;
            const featureClicked = this.state.featureClicked;
            featureClicked[index] = true;
            featuresAdded.push(feature)
            this.setState({ featureClicked, featuresAdded });
        }
        else if (this.state.featureClicked[index]) {
            const oldFeaturesAdded = this.state.featuresAdded;
            const featureClicked = this.state.featureClicked;
            featureClicked[index] = false;
            const featuresAdded = oldFeaturesAdded.filter(item => item.name !== feature.name);
            this.setState({ featureClicked, featuresAdded });
        }
    }


    continue = () => {
        const characterInfo = { ...this.state.characterInfo };
        if (this.state.featuresAdded.length < this.state.amountToPick) {
            alert(`You still have ${this.state.amountToPick - this.state.featuresAdded.length} features to add`)
            return;
        }
        this.setState({ confirmed: true })
        characterInfo.addedRaceFeatures = this.state.featuresAdded
        for (let item of this.state.featuresAdded) {
            if (item.changeAbilityScore) {
                characterInfo[item.changeAbilityScore[0]] = characterInfo[item.changeAbilityScore[0]] + item.changeAbilityScore[1]
            }
        }
        this.setState({ characterInfo }, () => {
            console.log(this.state.characterInfo)
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo });
            setTimeout(() => {
                if (this.state.race.changeBaseAttributePoints?.changePoints) {
                    this.props.navigation.navigate("SpacialProficiencyRaces", { race: this.state.race });
                    return;
                }
                this.props.navigation.navigate("SpacialRaceBonuses", { race: this.state.race });
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        })

    }


    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <AppText fontSize={22} textAlign={'center'}>Your picked race offers some customization regarding it's features.</AppText>
                        <AppText fontSize={22} textAlign={'center'}>Pick your Preferred feature</AppText>
                        <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 15 }}>
                            {this.state.race.userPickedFeatures?.map((item, index) => {
                                return <TouchableOpacity key={index} onPress={() => this.pickFeature(item, index)}
                                    style={[styles.item, { backgroundColor: this.state.featureClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                    <AppText fontSize={22} textAlign={'center'}>{item.name}</AppText>
                                    <View style={{ paddingLeft: 10 }}>
                                        <AppText fontSize={18}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                                    </View>
                                </TouchableOpacity>
                            })}
                        </View>
                        <View style={{ paddingBottom: 70 }}>
                            <AppButton padding={20} backgroundColor={Colors.metallicBlue} onPress={() => this.continue()}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Continue"} />
                        </View>
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 50
    },
    item: {
        margin: 10,
        borderRadius: 15,
        width: Dimensions.get('window').width / 1.2
    }
});