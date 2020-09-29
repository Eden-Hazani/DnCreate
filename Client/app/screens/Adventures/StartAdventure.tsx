import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../../components/AppText';
import { AppForm } from '../../components/forms/AppForm';
import * as Yup from 'yup';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import AuthContext from '../../auth/context';
import adventureApi from '../../api/adventureApi';


const ValidationSchema = Yup.object().shape({
    adventureName: Yup.string().required().label("Adventure Name"),
    adventureSetting: Yup.string().required().label('Adventure Setting')
})


export class StartAdventure extends Component<{ navigation: any }> {
    static contextType = AuthContext;
    startAdventure = (values: any) => {
        adventureApi.saveAdventure(values).then((adventure) => {
            this.props.navigation.navigate("SelectedLeadingAdv", { adventure: adventure.data })
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText></AppText>
                <AppForm
                    initialValues={{ adventureName: '', adventureSetting: '', leader_id: this.context.user._id }}
                    onSubmit={(values: any) => this.startAdventure(values)}
                    validationSchema={ValidationSchema}>
                    <View >
                        <AppText fontSize={18} textAlign={'center'}>Adventure Name</AppText>
                        <AppFormField
                            fieldName={"adventureName"}
                            name="adventureName"
                            iconName={"text-short"}
                            placeholder={"Adventure Name...."} />
                        <AppText fontSize={18} textAlign={'center'}>Adventure Setting</AppText>
                        <AppFormField
                            multiline={true}
                            numberOfLines={10}
                            textAlignVertical={"top"}
                            fieldName={"adventureSetting"}
                            name="adventureSetting"
                            iconName={"text-short"}
                            placeholder={"Adventure Setting..."} />
                    </View>
                    <SubmitButton width={250} title={"Start Adventure"} />
                </AppForm>
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {

    }
});