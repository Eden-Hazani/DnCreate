import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import errorHandler from '../../utility/errorHander';
import logger from '../../utility/logger';
import userCharApi from '../api/userCharApi';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import { AppActivityIndicator } from './AppActivityIndicator';
import { AppSkillItemPicker } from './AppSkillItemPicker';
import { AppText } from './AppText';

interface AppExtraPathChoicePickerState {
    disabledChoice: boolean[]
}

export class AppExtraPathChoicePicker extends Component<{
    character: CharacterModel, numberOfChoices: any,
    item: any, extraPathChoiceClicked: any, applyExtraPathChoice: any, isExtraChoice: any
    isAdditionalSkillChoice: any, loadSkills: any, resetExpertiseSkills: any
}, AppExtraPathChoicePickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            disabledChoice: []
        }
    }

    componentDidMount() {
        try {
            const multipleChoices: any = []
            this.props.isExtraChoice(true)
            this.props.numberOfChoices(this.props.item.numberOfChoices)
            const disabledChoice = this.state.disabledChoice;
            multipleChoices.push(this.props.item);
            if (this.props.item.excludePreviousLevelChoices && this.props.character.pathFeatures) {
                for (let charChoice of this.props.character.pathFeatures) {
                    if (charChoice.choice) {
                        const takenChoiceArray = charChoice.choice.map((takenChoice: any) => { return takenChoice.name });
                        this.props.item.choice.forEach((newChoice: any, index: number) => {
                            if (takenChoiceArray.includes(newChoice.name)) {
                                disabledChoice[index] = true;
                            }
                        })
                    }
                }
                this.setState({ disabledChoice })
            }

        } catch (err) {
            logger.log(new Error(err))
        }
    }
    componentWillUnmount() {
        this.props.isExtraChoice(false)
    }



    render() {
        return (
            <View style={styles.container}>
                {this.props.item.choice.map((item: any, index: number) =>
                    <View key={`${item.name}${index}`}>
                        <TouchableOpacity disabled={this.state.disabledChoice[index]} style={[styles.item, { backgroundColor: this.state.disabledChoice[index] ? Colors.berries : this.props.extraPathChoiceClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                            onPress={() => { this.props.applyExtraPathChoice(item, index) }}>
                            <AppText color={Colors.whiteInDarkMode} fontSize={18} textAlign={'center'}>{item.name}</AppText>
                            <AppText color={Colors.whiteInDarkMode} fontSize={15} textAlign={'center'}>{item.description.replace(/\. /g, '.\n\n')}</AppText>
                        </TouchableOpacity>
                        {item.skillList && this.props.extraPathChoiceClicked[index] &&
                            <AppSkillItemPicker extraSkillsTotal withConditions pathChosen skillsStartAsExpertise={this.props.item.skillsStartAsExpertise} resetExpertiseSkills={(val: any) => { this.props.resetExpertiseSkills(val) }} character={this.props.character}
                                setAdditionalSkillPicks={(val: boolean) => { this.props.isAdditionalSkillChoice(val) }} sendSkillsBack={(val: any) => { this.props.loadSkills(val) }}
                                itemList={item.skillList} amount={item.skillPickNumber} />}
                    </View>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    },
});