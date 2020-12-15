import React, { Component } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { changeLayOnHands, layOnHandsInitiator } from '../../screens/charOptions/UniqueCharFunctions/paladinFunctions';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
import { AppTextInput } from '../forms/AppTextInput';

interface PaladinLayOnHandsCounterState {
    layOnHandsTotal: number
    layOnHandsRemaining: number
    changeWindow: boolean
    newValue: number
}

export class PaladinLayOnHandsCounter extends Component<{ character: CharacterModel }, PaladinLayOnHandsCounterState> {
    constructor(props: any) {
        super(props)
        this.state = {
            newValue: 0,
            changeWindow: false,
            layOnHandsTotal: 0,
            layOnHandsRemaining: 0
        }
    }
    async componentDidMount() {
        let _id: string = "";
        if (this.props.character._id !== undefined) {
            _id = this.props.character._id
        }
        let level: number = 1;
        if (this.props.character.level !== undefined) {
            level = this.props.character.level
        }
        layOnHandsInitiator(_id, level).then(result => {
            this.setState({ layOnHandsTotal: result.layOnHandsAmount, layOnHandsRemaining: parseInt(result.storedNumber) })
        })
    }

    pushChange = () => {
        let _id: string = "";
        if (this.props.character._id !== undefined) {
            _id = this.props.character._id
        }
        let level: number = 1;
        if (this.props.character.level !== undefined) {
            level = this.props.character.level
        }
        changeLayOnHands(_id, this.state.newValue, level).then(result => {
            this.setState({ changeWindow: result.stayOpen, layOnHandsRemaining: result.newNumber })
        })
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => { this.setState({ changeWindow: true }) }} style={[styles.statContainer, { borderColor: Colors.whiteInDarkMode }]}>
                    <View style={{ paddingBottom: 15 }}>
                        <AppText fontSize={20}>Lay On Hands</AppText>
                    </View>
                    <AppText fontSize={18}>Total:</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.layOnHandsTotal}</AppText>
                    <AppText fontSize={18}>Remaining</AppText>
                    <AppText fontSize={18} color={Colors.bitterSweetRed}>{this.state.layOnHandsRemaining}</AppText>
                </TouchableOpacity>
                <Modal visible={this.state.changeWindow}>
                    <View style={{ backgroundColor: Colors.pageBackground, paddingTop: 150 }}>
                        <AppText textAlign={'center'}>Enter your current lay on hands amount.</AppText>
                        <AppTextInput keyboardType={'numeric'} onChangeText={(val: number) => { this.setState({ newValue: val }) }} />
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.pushChange() }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"O.K"} />
                            <AppButton backgroundColor={Colors.bitterSweetRed} onPress={() => { this.setState({ changeWindow: false }) }}
                                fontSize={18} borderRadius={25} width={120} height={65} title={"Cancel"} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    statContainer: {
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        padding: 10,
        borderRadius: 15
    }
});