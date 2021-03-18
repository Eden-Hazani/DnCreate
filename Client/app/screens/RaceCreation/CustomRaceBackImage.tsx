import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import * as Yup from 'yup';
import { Config } from '../../../config';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import { FormImagePicker } from '../../components/forms/FormImagePicker';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { RaceModel } from '../../models/raceModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';

const ValidationSchema = Yup.object().shape({
    image: Yup.mixed().label("Image"),
})

interface CustomRaceBackImageState {
    customRace: RaceModel
    confirmed: boolean
}
export class CustomRaceBackImage extends Component<{ navigation: any }, CustomRaceBackImageState>{
    constructor(props: any) {
        super(props)
        this.state = {
            confirmed: false,
            customRace: store.getState().customRace
        }
    }

    addImageAndContinue = (values: any) => {
        console.log(values)
        const storeItem = { ...store.getState().customRace };
        storeItem.image = values.image;
        this.setState({ confirmed: true })
        store.dispatch({ type: ActionType.UpdateCustomRace, payload: storeItem })
        setTimeout(() => {
            this.props.navigation.navigate("CustomRaceFinishScreen");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View style={{ paddingTop: 20 }}>
                        <AppForm
                            initialValues={{ image: store.getState().customRace.image || null }}
                            onSubmit={(values: any) => this.addImageAndContinue(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ paddingBottom: 15 }}>
                                    <AppText padding={20} textAlign={'center'} fontSize={18}>Optional - Upload a Portrait image for your race!</AppText>

                                    <FormImagePicker name="image" />
                                </View>
                            </View>
                            <SubmitButton width={250} title={"Continue"} />
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