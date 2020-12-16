import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Vibration } from 'react-native';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { decreaseRage, increaseRage, rageInitiator } from '../../screens/charOptions/UniqueCharFunctions/barbarianFunctions';
import { changeLayOnHands, layOnHandsInitiator } from '../../screens/charOptions/UniqueCharFunctions/paladinFunctions';
import { AppText } from '../AppText';

interface BarbarianRageCounterState {
    rageTotal: number
    rageRemaining: number
}

export class BarbarianRageCounter extends Component<{ character: CharacterModel }, BarbarianRageCounterState> {
    constructor(props: any) {
        super(props)
        this.state = {
            rageTotal: this.props.character.charSpecials && this.props.character.charSpecials.rageAmount ? this.props.character.charSpecials.rageAmount : 0,
            rageRemaining: 0
        }
    }
    async componentDidMount() {
        if (this.props.character._id && this.props.character.charSpecials && this.props.character.charSpecials.rageAmount)
            rageInitiator(this.props.character._id, this.props.character.charSpecials.rageAmount).then(result => {
                this.setState({ rageRemaining: parseInt(result) })
            })
    }

    increase = () => {
        if (this.props.character._id && this.props.character.charSpecials && this.props.character.charSpecials.rageAmount)
            increaseRage(this.props.character._id, this.props.character.charSpecials.rageAmount).then((result: any) => {
                this.setState({ rageRemaining: result })
            })
    }
    decrease = () => {
        if (this.props.character._id)
            decreaseRage(this.props.character._id).then((result: any) => {
                this.setState({ rageRemaining: result })
            })
    }

    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                {this.props.character.level === 20 ?
                    <View style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                        <View style={{ paddingBottom: 15 }}>
                            <AppText fontSize={20}>Rage</AppText>
                        </View>
                        <AppText fontSize={18}>You Have unlimited rage uses.</AppText>
                    </View>
                    :
                    <TouchableOpacity
                        onPress={() => {
                            this.increase()
                        }}
                        onLongPress={() => {
                            this.decrease()
                        }} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                        <View style={{ paddingBottom: 15 }}>
                            <AppText fontSize={20}>Rage</AppText>
                        </View>
                        <AppText fontSize={18}>Total:</AppText>
                        <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.rageTotal}</AppText>
                        <AppText fontSize={18}>Remaining</AppText>
                        <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.rageRemaining}</AppText>
                    </TouchableOpacity>
                }
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