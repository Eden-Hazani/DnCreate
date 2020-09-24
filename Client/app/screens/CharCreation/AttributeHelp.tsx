import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import colors from '../../config/colors';

interface AttributeHelpState {
    visible: boolean
}

export class AttributeHelp extends Component<{}, AttributeHelpState> {
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppButton backgroundColor={colors.bitterSweetRed} title={"Help"} height={40} width={150} fontSize={20} onPress={() => this.setState({ visible: true })} />
                <Modal visible={this.state.visible} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.textBox}>
                            <AppText textAlign={'center'} fontSize={25} color={colors.bitterSweetRed}>Welcome to the Attribute Dice Roll!</AppText>
                            <AppText fontSize={18} textAlign={'center'}>In order to create your character you first need to roll for attribute points.</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Each class has its beneficial scores, for example while a barbarian will benefit from strength and constitution</AppText>
                            <AppText fontSize={18} textAlign={'center'}>A wizard will benefit greatly from intelligence and dexterity</AppText>
                            <AppText fontSize={18} textAlign={'center'}>your choices should reflect your playstyle and the paths you are planning to take as you level up.</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Please take the time to read one of the many guides available online in order to visualize your character and spend the points accordingly.</AppText>
                        </View>
                        <View style={[styles.textBox, { flex: .5 }]}>
                            <AppText textAlign={'center'} fontSize={25} color={colors.bitterSweetRed}>The Dice Roller!</AppText>
                            <AppText fontSize={18} textAlign={'center'}>The roller will throw 4 D6 dice each time you hit the Roll! button</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Once the results are in pick the 3 highest rolls out of the four and they will be added to your dice pool</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Once You have completed 6 rolls the roll results will become press-able.</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Once you press on a roll result the attribute squares will start vibrating.</AppText>
                            <AppText fontSize={18} textAlign={'center'}>Just press on the desired attribute for the current roll score.</AppText>
                        </View>
                        <View style={{ flex: .2 }}>
                            <AppButton backgroundColor={colors.bitterSweetRed} title={"close"} height={40} width={150} fontSize={20} onPress={() => this.setState({ visible: false })} />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        flex: 1
    },
    textBox: {
        flex: .6,
        alignItems: 'center',
        padding: 15,
    },

});