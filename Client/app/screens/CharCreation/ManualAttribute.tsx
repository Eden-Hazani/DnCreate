import React, { Component } from 'react';
import { View, StyleSheet, Modal, Dimensions, ScrollView } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import * as Yup from 'yup';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { CharacterModel } from '../../models/characterModel';
import switchModifier from '../../../utility/abillityModifierSwitch';
import { RaceModel } from '../../models/raceModel';



const ValidationSchema = Yup.object().shape({
    strength: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Strength"),
    constitution: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Constitution"),
    dexterity: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Dexterity"),
    intelligence: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Intelligence"),
    wisdom: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Wisdom"),
    charisma: Yup.number().required().max(20).min(0).typeError('Amount must be a number').label("Charisma"),
})
interface ManualAttributeState {
    visible: boolean
    character: CharacterModel
}

export class ManualAttribute extends Component<{ finishedRollsAndInsertInfo: any, character: CharacterModel, race: RaceModel }, ManualAttributeState>{
    constructor(props: any) {
        super(props)
        this.state = {
            visible: false,
            character: this.props.character
        }
    }

    applyChanges = (values: any) => {
        const character = { ...this.state.character }
        const attributeArray = ["strength", "constitution", "dexterity", "intelligence", "wisdom", "charisma"]
        if (this.props.race.abilityBonus && character.modifiers) {
            for (let attribute of attributeArray) {
                character[attribute] = +values[attribute] + +this.props.race.abilityBonus[attribute]
                character.modifiers[attribute] = (switchModifier(parseInt(character[attribute])));
            }
            this.setState({ visible: false, character }, () => {
                this.props.finishedRollsAndInsertInfo(true, this.state.character)
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <AppButton backgroundColor={Colors.bitterSweetRed} title={"Enter Manually"} height={50} borderRadius={25} width={Dimensions.get('screen').width / 3.2} fontSize={20} onPress={() => this.setState({ visible: true })} />
                <Modal visible={this.state.visible} animationType="slide">
                    <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                        <AppText padding={25} color={Colors.berries} fontSize={25} textAlign={'center'}>Manual attribute input</AppText>
                        <View style={{ padding: 15 }}>
                            <AppText textAlign={'center'} fontSize={18}>If you want to use attribute values you have from an already existing character,</AppText>
                            <AppText textAlign={'center'} fontSize={18}>or just don't want to use DnCreate's dice roller</AppText>
                            <AppText textAlign={'center'} fontSize={18}>You can enter your attribute scores here</AppText>

                        </View>
                        <AppForm
                            initialValues={{
                                strength: null, constitution: null, dexterity: null, intelligence: null, wisdom: null, charisma: null
                            }}
                            onSubmit={(values: any) => this.applyChanges(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"strength"}
                                    name="strength"
                                    iconName={"text-short"}
                                    placeholder={"Strength..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"constitution"}
                                    name="constitution"
                                    iconName={"text-short"}
                                    placeholder={"Constitution..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"dexterity"}
                                    name="dexterity"
                                    iconName={"text-short"}
                                    placeholder={"Dexterity..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"intelligence"}
                                    name="intelligence"
                                    iconName={"text-short"}
                                    placeholder={"Intelligence..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"wisdom"}
                                    name="wisdom"
                                    iconName={"text-short"}
                                    placeholder={"Wisdom..."} />
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    keyboardType={"numeric"}
                                    fieldName={"charisma"}
                                    name="charisma"
                                    iconName={"text-short"}
                                    placeholder={"Charisma..."} />

                            </View>
                            <View style={{ justifyContent: "space-evenly", flexDirection: "row" }}>
                                <SubmitButton textAlign={'center'} title={"Apply"} />
                                <AppButton backgroundColor={Colors.bitterSweetRed} title={"Back"} height={50} borderRadius={25} width={Dimensions.get('screen').width / 3.2} fontSize={20} onPress={() => this.setState({ visible: false })} />
                            </View>
                        </AppForm>
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});