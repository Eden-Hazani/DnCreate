import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import charClassApi from '../../../api/charClassApi';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppPicker } from '../../../components/AppPicker';
import { AppText } from '../../../components/AppText';
import { Colors } from '../../../config/colors';
import { ClassModel } from '../../../models/classModel';

interface CreateNewPathState {
    classes: any
    loading: boolean
    pickedClass: ClassModel
}

export class CreateNewPath extends Component<{ navigation: any, route: any }, CreateNewPathState>{
    constructor(props: any) {
        super(props)
        this.state = {
            classes: null,
            loading: true,
            pickedClass: new ClassModel()
        }
    }
    componentDidMount() {
        this.getClassesFromServer()
    }
    getClassesFromServer = async () => {
        const result = await charClassApi.getClassesList();
        this.setState({ loading: false })
        const classes = result.data;
        this.setState({ classes })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                    <View>
                        <AppText fontSize={20} textAlign={'center'} padding={15}>Pick the Class you want to create a custom path for</AppText>
                        <View>
                            <AppPicker itemList={this.state.classes} selectedItemIcon={this.state.pickedClass.icon}
                                selectedItem={this.state.pickedClass.name} selectItem={(pickedClass: any) => { this.setState({ pickedClass: pickedClass }) }}
                                numColumns={3} placeholder={"Pick Class"} iconName={"apps"} />
                        </View>
                        {this.state.pickedClass?.name &&
                            <View style={{ paddingTop: 50 }}>
                                <AppButton borderRadius={15} width={170} height={70} backgroundColor={Colors.bitterSweetRed} title={`Continue with ${this.state.pickedClass.name}`}
                                    textAlign={"center"} fontSize={18} onPress={() => { this.props.navigation.navigate("CustomPathing", { charClass: this.state.pickedClass.name }) }} />
                            </View>
                        }
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});