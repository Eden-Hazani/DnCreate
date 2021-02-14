import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import * as Yup from 'yup';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import { SubClassModal } from '../../models/SubClassModal';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import * as classList from '../../../jsonDump/classList.json'
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { AppConfirmation } from '../../components/AppConfirmation';
import { ScrollView } from 'react-native-gesture-handler';
import * as customPathLevelList from '../../../jsonDump/customPathLevelList.json'
const Filter = require('bad-words')
const filter = new Filter();

const ValidationSchema = Yup.object().shape({
    name: Yup.string().required().test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).label("SubClass Name"),
    description: Yup.string().required().min(70).test('test-name', ' Cannot contain profanity', function (value) {
        if (filter.isProfane(value)) {
            return false
        }
        return true
    }).label("SubClass Description"),
})

interface CreateSubClassState {
    customSubclass: SubClassModal
    confirmed: boolean
    pickClass: string
    classClicked: boolean[]
}
export class CreateSubClass extends Component<{ navigation: any }, CreateSubClassState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickClass: "",
            classClicked: [],
            confirmed: false,
            customSubclass: store.getState().customSubClass
        }
    }
    insertInfoAndContinue = (values: any) => {
        if (this.state.pickClass === '') {
            alert('Must pick base class');
            return;
        }
        const storeItem: SubClassModal = { ...store.getState().customSubClass };
        storeItem.name = values.name;
        storeItem.description = values.description;
        storeItem.baseClass = this.state.pickClass;
        if (storeItem.levelUpChart) {
            for (let item of customPathLevelList[this.state.pickClass]) {
                storeItem.levelUpChart[`${item}`] = {}
            }
        }
        this.setState({ confirmed: true })
        store.dispatch({ type: ActionType.UpdateSubclass, payload: storeItem })
        setTimeout(() => {
            this.props.navigation.navigate("LevelChartSetUp");
        }, 800);
        setTimeout(() => {
            this.setState({ confirmed: false })
        }, 1100);
    }

    pickClass = (pickClass: string, index: number) => {
        let classClicked = this.state.classClicked;
        classClicked = [];
        classClicked[index] = true;
        this.setState({ pickClass, classClicked })
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View>
                            <AppText>In this section you need to insert the name and description of your subclass</AppText>
                            <AppText>Take your time thinking of a fitting description and name for your subclass</AppText>
                        </View>
                        <AppForm
                            initialValues={{ name: '', description: '' }}
                            onSubmit={(values: any) => this.insertInfoAndContinue(values)}
                            validationSchema={ValidationSchema}>
                            <View style={{ marginBottom: 5, justifyContent: "center", alignItems: "center" }}>
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.2}
                                    fieldName={"name"}
                                    iconName={"text-short"}
                                    placeholder={"Subclass Name..."} />
                                <AppFormField
                                    width={Dimensions.get('screen').width / 1.2}
                                    fieldName={"description"}
                                    iconName={"text-short"}
                                    numberOfLines={7} multiline={true} textAlignVertical={"top"}
                                    placeholder={"Subclass Description..."} />
                            </View>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText padding={5} textAlign={'center'}>The classes Cleric, Druid, and Paladin are locked for now, they will be released at a later date</AppText>
                                <AppText padding={5} textAlign={'center'}>If you would like to help with the development speed please consider donating to us on Patreon</AppText>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                                    {classList.classList.map((item: any, index: any) => <TouchableOpacity
                                        disabled={item === "Druid" || item === "Cleric" || item === "Paladin"}
                                        key={index} onPress={() => this.pickClass(item, index)}
                                        style={[styles.item, {
                                            backgroundColor:
                                                (item === "Druid" || item === "Cleric" || item === "Paladin") ? Colors.earthYellow :
                                                    this.state.classClicked[index] ? Colors.bitterSweetRed : Colors.lightGray
                                        }]}>
                                        <AppText textAlign={'center'}>{item}</AppText>
                                    </TouchableOpacity>)}
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <SubmitButton title={"Continue"} marginBottom={1} />
                            </View>
                        </AppForm>
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    }
});