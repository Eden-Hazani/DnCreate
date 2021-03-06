import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import AuthContext from '../../auth/context';
import adventureApi from '../../api/adventureApi';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';
import { ScrollView } from 'react-native-gesture-handler';
import logger from '../../../utility/logger';
import { FormImagePicker } from '../../components/forms/FormImagePicker';


const ValidationSchema = Yup.object().shape({
    adventureName: Yup.string().required().label("Adventure Name"),
    adventureSetting: Yup.string().required().label('Adventure Setting'),
    backGroundImage: Yup.string().label("Background Image").typeError("Must Choose A picture")
})


export class StartAdventure extends Component<{ navigation: any }> {
    static contextType = AuthContext;
    startAdventure = (values: any) => {
        try {
            adventureApi.saveAdventure(values).then((adventure) => {
                store.dispatch({ type: ActionType.UpdateLeadingAdv, payload: adventure.data })
                this.props.navigation.navigate("SelectedLeadingAdv", { adventure: adventure.data })
            });
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <AppForm
                    initialValues={{ adventureName: '', adventureSetting: '', leader_id: this.context.user._id }}
                    onSubmit={(values: any) => this.startAdventure(values)}
                    validationSchema={ValidationSchema}>
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <AppText fontSize={18} textAlign={'center'}>Adventure Name</AppText>
                        <AppFormField
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            fieldName={"adventureName"}
                            name="adventureName"
                            iconName={"text-short"}
                            placeholder={"Adventure Name...."} />
                        <AppText fontSize={18} textAlign={'center'}>Adventure Setting</AppText>
                        <AppFormField
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            multiline={true}
                            numberOfLines={10}
                            textAlignVertical={"top"}
                            fieldName={"adventureSetting"}
                            name="adventureSetting"
                            iconName={"text-short"}
                            placeholder={"Adventure Setting..."} />
                        <View style={{ paddingBottom: 15 }}>
                            <AppText padding={20} textAlign={'center'} fontSize={18}>Optional - Upload a background Image for your adventure!</AppText>
                            <FormImagePicker name="backgroundImage" />
                        </View>
                    </View>
                    <SubmitButton width={250} title={"Start Adventure"} />
                </AppForm>
            </ScrollView>
        )
    }
}




const styles = StyleSheet.create({
    container: {

    }
});