import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { RaceModel } from '../../models/raceModel';
import * as Yup from 'yup';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { AppText } from '../../components/AppText';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import NumberScroll from '../../components/NumberScroll';
import { Colors } from '../../config/colors';
const Filter = require('bad-words')
const filter = new Filter();

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Race Name").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }),
    description: Yup.string().required().label("Race description").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }),
    age: Yup.string().required().label("Age description").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }),
    alignment: Yup.string().required().label("Alignment description").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }),
    size: Yup.string().required().label("Size description").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }),
    languages: Yup.string().required().label("Languages description").test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    })
})

interface BasicRaceInfoState {
    customRace: RaceModel
    confirmed: boolean
    speed: number
}

export class BasicRaceInfo extends Component<{ navigation: any }, BasicRaceInfoState>{
    constructor(props: any) {
        super(props)
        this.state = {
            speed: 0,
            customRace: store.getState().customRaceEditing ? store.getState().customRace : new RaceModel(),
            confirmed: false,
        }
    }


    confirmAndContinue = (values: any) => {
        const customRace = { ...this.state.customRace };
        customRace.name = values.name;
        customRace.description = values.description;
        customRace.raceAbilities = {
            age: values.age,
            languages: values.languages,
            alignment: values.alignment,
            size: values.size,
            uniqueAbilities: store.getState().customRaceEditing ? store.getState().customRace.raceAbilities?.uniqueAbilities : [],
            speed: this.state.speed
        }
        this.setState({ confirmed: true })
        this.setState({ customRace }, () => {
            store.dispatch({ type: ActionType.UpdateCustomRace, payload: this.state.customRace })
        })
        setTimeout(() => {
            this.props.navigation.navigate("RaceAttributeBonus");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }


    render() {
        const storeState = store.getState().customRace;
        const speedState = store.getState().customRace.raceAbilities?.speed || 0;
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View>
                            <AppText padding={10} textAlign={'center'} fontSize={25}>Racial Info</AppText>
                            <AppText padding={5} textAlign={'center'} fontSize={18}>Here you need to fill out the basic racial information.</AppText>
                            <AppText padding={5} textAlign={'center'} fontSize={18}>Be descriptive, don't just write number ranges.</AppText>
                            <AppText padding={5} textAlign={'center'} fontSize={18}>Try to give depth and examples to the different racial attributes.</AppText>
                            <AppText padding={5} textAlign={'center'} fontSize={18}>A good start is to compare sizes and ages to humans for example proposes.</AppText>
                        </View>
                        <AppForm
                            initialValues={{
                                name: storeState.name || '',
                                description: storeState.description || '',
                                age: storeState.raceAbilities?.age || '',
                                alignment: storeState.raceAbilities?.alignment || '',
                                size: storeState.raceAbilities?.size || '',
                                languages: storeState.raceAbilities?.languages || ''
                            }}
                            onSubmit={(values: any) => this.confirmAndContinue(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    defaultValue={storeState.name}
                                    width={Dimensions.get('screen').width / 1.2}
                                    fieldName={"name"}
                                    iconName={"text-short"}
                                    placeholder={"Race Name..."} />
                                <AppFormField
                                    defaultValue={storeState.description}
                                    width={Dimensions.get('screen').width / 1.2}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"description"}
                                    iconName={"text-short"}
                                    placeholder={"Race Description..."} />
                                <AppFormField
                                    defaultValue={storeState.raceAbilities?.age}
                                    width={Dimensions.get('screen').width / 1.2}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"age"}
                                    iconName={"text-short"}
                                    placeholder={"Age Description..."} />
                                <AppFormField
                                    defaultValue={storeState.raceAbilities?.alignment}
                                    width={Dimensions.get('screen').width / 1.2}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"alignment"}
                                    iconName={"text-short"}
                                    placeholder={"Alignment Description..."} />
                                <AppFormField
                                    defaultValue={storeState.raceAbilities?.size}
                                    width={Dimensions.get('screen').width / 1.2}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"size"}
                                    iconName={"text-short"}
                                    placeholder={"Size Description..."} />
                                <AppFormField
                                    defaultValue={storeState.raceAbilities?.languages}
                                    width={Dimensions.get('screen').width / 1.2}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    fieldName={"languages"}
                                    iconName={"text-short"}
                                    placeholder={"Languages Description..."} />
                                <View style={{ borderColor: Colors.whiteInDarkMode, width: 170, borderWidth: 1, borderRadius: 15, }}>
                                    <AppText textAlign={'center'}>Movement speed</AppText>
                                    <NumberScroll modelColor={Colors.pageBackground} max={50}
                                        startingVal={speedState}
                                        getValue={(speed: number) => { this.setState({ speed }) }} />
                                </View>
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <SubmitButton title={"Continue"} marginBottom={1} />
                            </View>
                        </AppForm>
                    </View>
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});