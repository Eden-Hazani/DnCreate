import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import { AppText } from './AppText';
import levelUpPathChoice from '../../jsonDump/levelUpPathChoices.json'
import { pathChoiceChangePicker } from '../classFeatures/pathChoiceChnagePicker';
import logger from '../../utility/logger';

interface AppChangePathChoiceAtLevelUpState {
    loading: boolean
    choiceClicked: boolean[]
    pickedPathChoice: any
    optionsToPickFrom: any
}


export class AppChangePathChoiceAtLevelUp extends Component<{
    character: CharacterModel, newPathChoice: any
}, AppChangePathChoiceAtLevelUpState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickedPathChoice: [],
            choiceClicked: [],
            loading: true,
            optionsToPickFrom: []
        }
    }


    componentDidMount() {
        try {
            if (this.props.character.pathFeatures) {
                for (let item of this.props.character.pathFeatures) {
                    if (item.name === pathChoiceChangePicker(this.props.character)) {
                        this.setState({ pickedPathChoice: item.choice[0] }, () => {
                            this.setState({ optionsToPickFrom: levelUpPathChoice[this.props.character.path.name] }, () => {
                                this.state.optionsToPickFrom.forEach((item: any, index: number) => {
                                    if (this.state.pickedPathChoice.name === item.name) {
                                        let choiceClicked = this.state.choiceClicked;
                                        choiceClicked[index] = true;
                                        this.setState({ choiceClicked })
                                    }
                                })
                            });
                        })
                    }
                }
            }
        } catch (err) {
            logger.log(err)
        }
    }


    setChoice = (item: any, index: number) => {
        try {
            let choiceClicked = this.state.choiceClicked;
            choiceClicked = [];
            choiceClicked[index] = true;
            this.setState({ choiceClicked })
            this.props.newPathChoice(item)
        } catch (err) {
            logger.log(err)
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{ padding: 15 }}>
                    <AppText color={Colors.whiteInDarkMode} fontSize={25} textAlign={'center'}>On each level up as a {this.props.character.characterClass} of the {this.props.character.path.name}</AppText>
                    <AppText color={Colors.berries} fontSize={20} textAlign={'center'}>You are allowed to change the following effect of your path features.</AppText>
                </View>
                {this.state.optionsToPickFrom.map((item: any, index: number) =>
                    <View key={item.name}>
                        <TouchableOpacity style={[styles.item, { backgroundColor: this.state.choiceClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                            onPress={() => { this.setChoice(item, index) }}>
                            <AppText color={Colors.whiteInDarkMode} fontSize={18} textAlign={'center'}>{item.name}</AppText>
                            <AppText color={Colors.whiteInDarkMode} fontSize={15} textAlign={'center'}>{item.description.replace(/\. /g, '.\n\n').replace(/\: /g, ':\n')}</AppText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }, item: {
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