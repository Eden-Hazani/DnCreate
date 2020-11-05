import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Unsubscribe } from 'redux';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import colors from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import * as Yup from 'yup';
import { SubmitButton } from '../../components/forms/SubmitButton';
import userCharApi from '../../api/userCharApi';
import AuthContext from '../../auth/context';
import { AppConfirmation } from '../../components/AppConfirmation';


interface NewCharInfoState {
    characterInfo: CharacterModel
    confirmed: boolean
}

const ValidationSchema = Yup.object().shape({
    fullName: Yup.string().required().test('test-name', 'Cannot have the same same of an existing character', async function (value) {
        if (store.getState().nonUser) { return true }
        const response = await userCharApi.validateCharName(value, this.parent.user_id);
        if (response.data) {
            return false
        } else {
            return true
        }

    }).label("Full Name"),
    eyes: Yup.string().required().label("Eye Color"),
    skin: Yup.string().required().label("Skin Color"),
    hair: Yup.string().required().label("Hair Color"),
    height: Yup.number().typeError("Number").required().label("Height"),
    weight: Yup.number().typeError("Number").required().label("Weight"),
    age: Yup.number().typeError("Number").required().label("Age"),

})



export class NewCharInfo extends Component<{ props: any, navigation: any }, NewCharInfoState> {
    static contextType = AuthContext;
    private unsubscribeStore: Unsubscribe
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            characterInfo: store.getState().character
        }
        this.unsubscribeStore = store.subscribe(() => {
            store.getState().character
        })
    }

    setInfoAndContinue = (values: any) => {
        const characterInfo = { ...this.state.characterInfo };
        characterInfo.name = values.fullName;
        characterInfo.age = values.age;
        characterInfo.height = values.height;
        characterInfo.weight = values.weight;
        characterInfo.eyes = values.eyes;
        characterInfo.skin = values.skin;
        characterInfo.hair = values.hair;
        this.setState({ confirmed: true })
        this.setState({ characterInfo }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
        })
        setTimeout(() => {
            this.props.navigation.navigate("ClassPick")
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    componentWillUnmount() {
        this.unsubscribeStore()
    }


    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always">
                <View style={styles.container}>
                    {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                        <View>
                            <AppText textAlign={'center'} fontSize={20} color={colors.black}>{this.state.characterInfo.race}</AppText>
                            <AppForm
                                initialValues={{ fullName: store.getState().character.name, age: null, height: null, weight: null, eyes: '', skin: '', hair: '', user_id: store.getState().nonUser ? null : this.context.user._id }}
                                onSubmit={(values: any) => this.setInfoAndContinue(values)}
                                validationSchema={ValidationSchema}>
                                <View >
                                    <AppFormField
                                        style={{ width: "150%" }}
                                        fieldName={"fullName"}
                                        name="fullName"
                                        iconName={"text-short"}
                                        placeholder={"Character Full Name..."} />
                                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                                        <AppFormField
                                            style={{ width: "50%" }}
                                            keyboardType={"numeric"}
                                            fieldName={"age"}
                                            name="age"
                                            iconName={"text-short"}
                                            placeholder={"Age..."} />
                                        <AppFormField
                                            style={{ width: "50%" }}
                                            keyboardType={"numeric"}
                                            fieldName={"height"}
                                            name="height"
                                            iconName={"text-short"}
                                            placeholder={"Height..."} />
                                    </View>
                                    <AppFormField
                                        keyboardType={"numeric"}
                                        fieldName={"weight"}
                                        name="weight"
                                        iconName={"text-short"}
                                        placeholder={"Weight..."} />
                                    <AppFormField
                                        fieldName={"eyes"}
                                        name="eyes"
                                        iconName={"text-short"}
                                        placeholder={"Eye Color..."} />
                                    <AppFormField
                                        fieldName={"skin"}
                                        name="skin"
                                        iconName={"text-short"}
                                        placeholder={"Skin Color..."} />
                                    <AppFormField
                                        fieldName={"hair"}
                                        name="hair"
                                        iconName={"text-short"}
                                        placeholder={"Hair Color..."} />
                                </View>
                                <SubmitButton title={"Continue"} />
                            </AppForm>
                        </View>}
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 15,
        alignItems: "center"
    }
});