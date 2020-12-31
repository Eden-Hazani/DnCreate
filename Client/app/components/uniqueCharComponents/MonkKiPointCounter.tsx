import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import logger from '../../../utility/logger';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { decreaseKiPoint, increaseKiPoints, kiPointInitiator } from '../../screens/charOptions/UniqueCharFunctions/monkFunctions';
import { AppText } from '../AppText';

interface MonkKiPointCounterState {
    kiTotal: number
    kiRemaining: number
}

export class MonkKiPointCounter extends Component<{ character: CharacterModel }, MonkKiPointCounterState> {
    constructor(props: any) {
        super(props)
        this.state = {
            kiTotal: this.props.character.charSpecials && this.props.character.charSpecials.kiPoints ? this.props.character.charSpecials.kiPoints : 0,
            kiRemaining: 0
        }
    }
    async componentDidMount() {
        try {
            kiPointInitiator(this.props.character.charSpecials && this.props.character.charSpecials.kiPoints ? this.props.character.charSpecials.kiPoints : 0, this.props.character._id ? this.props.character._id : '').then(result => {
                this.setState({ kiRemaining: parseInt(result) })
            })
        } catch (err) {
            logger.log(err)
        }
    }

    increase = () => {
        try {
            increaseKiPoints(this.props.character._id ? this.props.character._id : '', this.props.character.charSpecials && this.props.character.charSpecials.kiPoints ? this.props.character.charSpecials.kiPoints : 0).then((result: any) => {
                this.setState({ kiRemaining: result })
            })
        } catch (err) {
            logger.log(err)
        }
    }
    decrease = () => {
        try {
            decreaseKiPoint(this.props.character._id ? this.props.character._id : '').then((result: any) => {
                this.setState({ kiRemaining: result })
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
                        <AppText fontSize={20}>Ki points</AppText>
                    </View>
                    <AppText fontSize={18}>Total:</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.kiTotal}</AppText>
                    <AppText fontSize={18}>Remaining</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.kiRemaining}</AppText>
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