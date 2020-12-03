import React, { Component } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { ConfirmFormPart } from '../../../animations/ConfirmFormPart';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { AppTextInput } from '../../../components/forms/AppTextInput';
import { Colors } from '../../../config/colors';
import { CreateChoice } from './CreateChoice';

interface AddCustomFeatureState {
    values: any
    featureList: any[]
    completed: boolean
    featureDetailModal: boolean[]
}


export class AddCustomFeature extends Component<{ sendValues: any }, AddCustomFeatureState>{
    constructor(props: any) {
        super(props)
        this.state = {
            featureDetailModal: [],
            values: {
                // name: '',
                // description: '',
                // choice: []
            },
            completed: false,
            featureList: []
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.completed ?
                    <View>
                        <ConfirmFormPart visible={this.state.completed} />
                        <View>
                            {this.state.featureList.map((item, index) => <View key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                                <AppText textAlign={'center'} fontSize={22} color={Colors.berries}>{item.name}</AppText>
                                <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>{item.description}</AppText>
                            </View>)}
                        </View>
                    </View>
                    :
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                borderRadius={25} width={100} height={60} title={"Add Feature"} onPress={() => {
                                    const featureList = this.state.featureList;
                                    const featureDetailModal = this.state.featureDetailModal;
                                    featureDetailModal.push(false)
                                    featureList.push(this.state.values)
                                    this.setState({ featureList, featureDetailModal })
                                }} />
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                borderRadius={25} width={100} height={60} title={"Remove Feature"}
                                onPress={() => {
                                    const featureList = this.state.featureList;
                                    const featureDetailModal = this.state.featureDetailModal;
                                    featureDetailModal.splice(-1, 1)
                                    featureList.splice(-1, 1)
                                    this.setState({ featureList, featureDetailModal })
                                }} />
                        </View>
                        {this.state.featureList.map((item, index) => <View key={index} style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, margin: 15 }}>
                            <AppTextInput placeholder={"Feature name"} iconName={"text"}
                                onChangeText={(name: string) => {
                                    let featureList = [...this.state.featureList];
                                    let item = { ...featureList[index] }
                                    item.name = name
                                    featureList[index] = item;
                                    this.setState({ featureList })
                                }} />
                            <AppTextInput placeholder={"Feature description"} iconName={"text"} numberOfLines={5} multiline={true} textAlignVertical={"top"}
                                onChangeText={(description: string) => {
                                    let featureList = [...this.state.featureList];
                                    let item = { ...featureList[index] }
                                    item.description = description
                                    featureList[index] = item;
                                    this.setState({ featureList })
                                }} />
                            <View style={{ padding: 15 }}>
                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                    borderRadius={25} width={100} height={60} title={"Feature Details"}
                                    onPress={() => {
                                        const featureDetailModal = this.state.featureDetailModal;
                                        featureDetailModal[index] = true;
                                        this.setState({ featureDetailModal })
                                    }} />
                            </View>
                            <Modal visible={this.state.featureDetailModal[index]}>
                                <ScrollView style={{ backgroundColor: Colors.pageBackground }}>
                                    <AppText textAlign={'center'} fontSize={16} padding={5}>Does this feature offer a single choice to pick out of many?</AppText>
                                    <CreateChoice sendChoiceArrayBack={(array: any) => {
                                        let featureList = [...this.state.featureList];
                                        let item = { ...featureList[index] }
                                        item.choice = array
                                        featureList[index] = item;
                                        this.setState({ featureList })
                                    }} />
                                    <View>
                                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                            borderRadius={25} width={150} height={60} title={"Close and save changes"}
                                            onPress={() => {
                                                const featureDetailModal = this.state.featureDetailModal;
                                                featureDetailModal[index] = false;
                                                this.setState({ featureDetailModal })
                                            }} />
                                    </View>
                                </ScrollView>
                            </Modal>
                        </View>)}
                        <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                            borderRadius={100} width={100} height={100} title={"Approve"} onPress={() => {
                                if (this.state.featureList.length === 0) {
                                    alert("You must provide at least one feature per path level");
                                    return
                                }
                                this.props.sendValues({ feature: this.state.featureList, isDone: true })
                                this.setState({ completed: true })
                            }} />
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