import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { Dimensions } from 'react-native';


interface AttributeHelpState {
    visible: boolean
}

export class AttributeHelp extends Component<{ mode: boolean }, AttributeHelpState> {
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppButton backgroundColor={Colors.bitterSweetRed} title={"Help"} height={50} borderRadius={25} width={Dimensions.get('screen').width / 3.2} fontSize={35} onPress={() => this.setState({ visible: true })} />
                <Modal visible={this.state.visible} animationType="slide">
                    <View style={[styles.modalContainer, { backgroundColor: Colors.pageBackground }]}>
                        {this.props.mode ?
                            <View>
                                <View style={styles.textBox}>
                                    <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>Welcome to the Attribute Stat picker!</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>In order to create your character you first need to pick for attribute points.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Each class has its beneficial scores, for example while a barbarian will benefit from strength and constitution</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>A wizard will benefit greatly from intelligence and dexterity</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>your choices should reflect your playstyle and the paths you are planning to take as you level up.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Please take the time to read one of the many guides available online in order to visualize your character and spend the points accordingly.</AppText>
                                </View>
                                <View style={styles.button}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} title={"close"} height={40} width={150} fontSize={20} onPress={() => this.setState({ visible: false })} />
                                </View>
                                <View style={[styles.textBox]}>
                                    <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>The Score Picker!</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Some player prefer this method over the regular dice roll.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>The standard array is a specific set of scores that you can pick from, eliminating the randomness of dice.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>You get 27 points, the lowest score is 8 and the highest one is 15.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>You decide how to distribute them among the ability scores.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Just press on the desired attribute for the current roll score.</AppText>
                                </View>
                            </View>
                            :
                            <View>
                                <View style={styles.textBox}>
                                    <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>Welcome to the Attribute Dice Roll!</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>In order to create your character you first need to roll for attribute points.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Each class has its beneficial scores, for example while a barbarian will benefit from strength and constitution</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>A wizard will benefit greatly from intelligence and dexterity</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>your choices should reflect your playstyle and the paths you are planning to take as you level up.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Please take the time to read one of the many guides available online in order to visualize your character and spend the points accordingly.</AppText>
                                </View>
                                <View style={styles.button}>
                                    <AppButton backgroundColor={Colors.bitterSweetRed} title={"close"} height={40} width={150} fontSize={20} onPress={() => this.setState({ visible: false })} />
                                </View>
                                <View style={[styles.textBox]}>
                                    <AppText textAlign={'center'} fontSize={25} color={Colors.bitterSweetRed}>The Dice Roller!</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>The roller will throw 4 D6 dice each time you hit the Roll! button</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Once the results are in pick the 3 highest rolls out of the four and they will be added to your dice pool</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Once You have completed 6 rolls the roll results will become press-able.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Once you press on a roll result the attribute squares will start vibrating.</AppText>
                                    <AppText fontSize={18} textAlign={'center'}>Just press on the desired attribute for the current roll score.</AppText>
                                </View>
                            </View>
                        }
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
    },
    textBox: {
        height: Dimensions.get('screen').height / 2.1,
        alignItems: 'center',
        padding: 15,
    },
    button: {

    }

});