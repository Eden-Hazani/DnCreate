import React, { Component } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { AppTextInput } from '../../../components/forms/AppTextInput';
import NumberScroll from '../../../components/NumberScroll';
import { Colors } from '../../../config/colors';

interface ChoiceCreatorState {
    choices: any[]
    amountToPick: number,
    beforeChangesChoices: any[]
    beforeChangesAmount: any
}
export class ChoiceCreator extends Component<{ closeModal: any, existingChoices: any[], loadChoices: any, amountToPick: number }, ChoiceCreatorState>{
    constructor(props: any) {
        super(props)
        this.state = {
            beforeChangesAmount: JSON.parse(JSON.stringify(this.props.amountToPick)),
            amountToPick: this.props.amountToPick,
            choices: this.props.existingChoices,
            beforeChangesChoices: JSON.parse(JSON.stringify(this.props.existingChoices))
        }
    }
    approveChoices = () => {
        this.props.loadChoices({ choices: this.state.choices, amount: this.state.amountToPick })
    }

    addChoice = () => {
        const choices = this.state.choices;
        choices.push({ name: '', description: '' })
        this.setState({ choices })
    }
    removeChoice = (index: number) => {
        const choices = this.state.choices;
        choices.splice(index, 1);
        this.setState({ choices })
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ justifyContent: "center", alignItems: "center", paddingTop: 20, paddingBottom: 10 }}>
                    <AppText textAlign={'center'} fontSize={18}>Here you can add any amount of options you want for the player to choose from.</AppText>
                    <AppText textAlign={'center'} fontSize={18}>At the bottom you will have a slider to dictate the amount of choices the player can pick.</AppText>
                </View>
                <AppButton fontSize={20} title={'Add Choice'} onPress={() => this.addChoice()}
                    borderRadius={10}
                    backgroundColor={Colors.bitterSweetRed} width={120} height={45} />

                {this.state.choices.map((item, index) => <View style={[styles.item, { borderColor: Colors.whiteInDarkMode }]} key={index}>
                    <AppTextInput
                        onChangeText={(name: string) => {
                            const choices = this.state.choices
                            choices[index].name = name
                            this.setState({ choices })
                        }}
                        placeholder={"Choice Name"}
                        defaultValue={this.state.choices[index].name}
                    />
                    <AppTextInput
                        onChangeText={(description: string) => {
                            const choices = this.state.choices
                            choices[index].description = description
                            this.setState({ choices })
                        }}
                        placeholder={"Choice Description"}
                        defaultValue={this.state.choices[index].description}
                        numberOfLines={7} multiline={true} textAlignVertical={"top"} />
                </View>)}
                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 15 }}>
                    <View style={{
                        borderColor: Colors.whiteInDarkMode,
                        width: 170, borderWidth: 1, borderRadius: 15,
                    }}>
                        <AppText textAlign={'center'}>Choice Amount</AppText>
                        <NumberScroll modelColor={Colors.pageBackground} max={this.state.choices.length !== 0 ? this.state.choices.length : 1}
                            startingVal={this.props.amountToPick}
                            getValue={(amountToPick: number) => { this.setState({ amountToPick }) }} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 15 }}>
                    <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                        borderRadius={10}
                        backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                    <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                        Alert.alert("Cancel?", "All changes will be lost",
                            [{
                                text: 'Yes', onPress: () => {
                                    this.setState({ choices: this.state.beforeChangesChoices }, () => {
                                        this.props.closeModal({ choices: this.state.beforeChangesChoices, amount: this.state.beforeChangesAmount })
                                    })
                                }
                            }, { text: 'No' }])
                    }}
                        borderRadius={10}
                        backgroundColor={Colors.metallicBlue} width={120} height={45} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        justifyContent: "center", alignItems: "center",
        borderRadius: 25,
        borderWidth: 1,
        margin: 10,
        padding: 5
    }
});