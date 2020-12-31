import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import logger from '../../../utility/logger';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { decreaseInspiration, increaseInspiration, inspirationInitiator } from '../../screens/charOptions/UniqueCharFunctions/bardFunctions';
import { AppText } from '../AppText';

interface BardInspirationCounterState {
    inspectionTotal: number
    inspectionRemaining: number
}

export class BardInspirationCounter extends Component<{ character: CharacterModel }, BardInspirationCounterState> {
    constructor(props: any) {
        super(props)
        this.state = {
            inspectionTotal: this.props.character.modifiers && this.props.character.modifiers.charisma && this.props.character.modifiers.charisma >= 1 ? this.props.character.modifiers.charisma : 1,
            inspectionRemaining: 0
        }
    }
    async componentDidMount() {
        try {
            if (this.props.character._id && this.props.character.modifiers && this.props.character.modifiers.charisma)
                inspirationInitiator(this.props.character._id, this.props.character.modifiers.charisma).then(result => {
                    this.setState({ inspectionRemaining: parseInt(result) })
                })
        } catch (err) {
            logger.log(err)
        }
    }

    increase = () => {
        try {
            if (this.props.character._id && this.props.character.modifiers && this.props.character.modifiers.charisma)
                increaseInspiration(this.props.character._id, this.props.character.modifiers.charisma).then((result: any) => {
                    this.setState({ inspectionRemaining: result })
                })
        } catch (err) {
            logger.log(err)
        }
    }
    decrease = () => {
        try {
            if (this.props.character._id)
                decreaseInspiration(this.props.character._id).then((result: any) => {
                    this.setState({ inspectionRemaining: result })
                })
        } catch (err) {
            logger.log(err)
        }
    }

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => {
                        this.increase()
                    }}
                    onLongPress={() => {
                        this.decrease()
                    }} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                    <View style={{ paddingBottom: 15 }}>
                        <AppText fontSize={20}>Inspiration Dice</AppText>
                    </View>
                    <AppText fontSize={18}>Total:</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.inspectionTotal}</AppText>
                    <AppText fontSize={18}>Remaining</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.inspectionRemaining}</AppText>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    statContainer: {
        width: Dimensions.get('screen').width / 2,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    }
});