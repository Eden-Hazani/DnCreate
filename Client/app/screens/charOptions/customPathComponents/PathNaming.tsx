import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppForm } from '../../../components/forms/AppForm';
import { AppFormField } from '../../../components/forms/AppFormField';
import * as Yup from 'yup';
import { SubmitButton } from '../../../components/forms/SubmitButton';
import { ConfirmFormPart } from '../../../animations/ConfirmFormPart';
import { Colors } from '../../../config/colors';
import { AppText } from '../../../components/AppText';

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    description: Yup.string().required().label("Description"),

})

interface PathNamingState {
    name: string
    pathHasBeenAdded: boolean
}

export class PathNaming extends Component<{ customPathComplete: any }, PathNamingState>{
    constructor(props: any) {
        super(props)
        this.state = {
            name: '',
            pathHasBeenAdded: false
        }
    }

    componentDidMount() {
        this.props.customPathComplete({ done: false })
    }

    addPath = (values: any) => {
        const path = {
            name: values.name,
            description: values.description,
            isCustom: true
        }
        this.setState({ pathHasBeenAdded: true })
        this.props.customPathComplete({ done: true, path: path })
    }

    render() {
        return (
            <View style={[styles.container, { borderColor: this.state.pathHasBeenAdded ? "transparent" : Colors.whiteInDarkMode }]}>
                {this.state.pathHasBeenAdded ?
                    <View>
                        <AppText textAlign={'center'} fontSize={20} padding={5}>Path name and description</AppText>
                        <ConfirmFormPart visible={this.state.pathHasBeenAdded} />
                    </View>
                    :
                    <View>
                        <AppText textAlign={'center'} padding={25} fontSize={20} >Lets start by entering a name and a description.</AppText>
                        <AppForm
                            initialValues={{
                                name: '', description: ''
                            }}
                            onSubmit={(values: any) => this.addPath(values)}
                            validationSchema={ValidationSchema}>
                            <View >
                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    fieldName={"name"}
                                    name="name"
                                    iconName={"fountain-pen"}
                                    placeholder={"Path name..."} />

                                <AppFormField
                                    style={{ width: Dimensions.get('screen').width / 1.2 }}
                                    fieldName={"description"}
                                    name="description"
                                    iconName={"card-text-outline"}
                                    textAlignVertical={"top"}
                                    multiline={true} numberOfLines={10}
                                    placeholder={"Path description..."} />
                            </View>
                            <SubmitButton title={"Approve"} textAlign={'center'} />
                        </AppForm>
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        borderWidth: 1,
        margin: 20
    }
});