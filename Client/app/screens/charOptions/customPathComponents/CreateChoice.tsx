import React, { Component } from 'react';
import { View, StyleSheet, Switch, Dimensions, Modal } from 'react-native';
import { ConfirmFormPart } from '../../../animations/ConfirmFormPart';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { AppTextInput } from '../../../components/forms/AppTextInput';
import { Colors } from '../../../config/colors';
import { CustomSkillPick } from './CustomSkillPick';

interface CreateChoiceState {
    currentIndex: number
    choiceOn: boolean
    choiceList: any[]
    skillListOn: boolean
    skillList: []
    choiceApprovedList: boolean[]
}

export class CreateChoice extends Component<{ sendChoiceArrayBack: any }, CreateChoiceState>{
    constructor(props: any) {
        super(props)
        this.state = {
            currentIndex: 0,
            skillListOn: false,
            skillList: [],
            choiceOn: false,
            choiceList: [],
            choiceApprovedList: []
        }
    }
    render() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={{ padding: 15 }}>
                    <Switch value={this.state.choiceOn} onValueChange={() => {
                        if (this.state.choiceOn) {
                            this.setState({ choiceOn: false })
                            return;
                        }
                        this.setState({ choiceOn: true })
                    }} />
                </View>
                {this.state.choiceOn &&
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                borderRadius={25} width={100} height={60} title={"Add Choice"} onPress={() => {
                                    const choiceList = this.state.choiceList;
                                    const choiceApprovedList = this.state.choiceApprovedList;
                                    choiceList.push({})
                                    choiceApprovedList.push(false)
                                    this.setState({ choiceList, choiceApprovedList })
                                }} />
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                borderRadius={25} width={100} height={60} title={"Remove Choice"}
                                onPress={() => {
                                    const choiceList = this.state.choiceList;
                                    const choiceApprovedList = this.state.choiceApprovedList;
                                    choiceList.splice(-1, 1)
                                    choiceApprovedList.splice(-1, 1)
                                    this.setState({ choiceList, choiceApprovedList })
                                }} />
                        </View>
                        <View style={{ width: Dimensions.get('screen').width }}>
                            {this.state.choiceList.map((item, index) => <View key={index} style={{ borderColor: Colors.whiteInDarkMode, borderWidth: 1, borderRadius: 15, margin: 15 }}>
                                {this.state.choiceApprovedList[index] ? <ConfirmFormPart visible={this.state.choiceApprovedList[index]} /> :
                                    <View>
                                        <AppTextInput placeholder={"Choice name"} iconName={"text"}
                                            onChangeText={(name: string) => {
                                                let choiceList = [...this.state.choiceList];
                                                let item = { ...choiceList[index] }
                                                item.name = name
                                                choiceList[index] = item;
                                                this.setState({ choiceList })
                                            }} />
                                        <AppTextInput placeholder={"Choice description"} iconName={"text"} numberOfLines={5} multiline={true} textAlignVertical={"top"}
                                            onChangeText={(description: string) => {
                                                let choiceList = [...this.state.choiceList];
                                                let item = { ...choiceList[index] }
                                                item.description = description
                                                choiceList[index] = item;
                                                this.setState({ choiceList })
                                            }} />
                                        <View>
                                            <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                                                <AppText>Does this choice offer picking skills out of a list?</AppText>
                                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                                    borderRadius={25} width={100} height={60} title={"Add Skills"}
                                                    onPress={() => {
                                                        this.setState({ skillListOn: true, currentIndex: index })
                                                    }} />
                                            </View>
                                            {/* <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                                                <AppText>Does this choice gives the player new spells?</AppText>
                                                <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                                    borderRadius={25} width={100} height={60} title={"Add Skills"}
                                                    onPress={() => {
                                                        this.setState({ skillListOn: true, currentIndex: index })
                                                    }} />
                                            </View> */}
                                            <Modal visible={this.state.skillListOn}>
                                                <CustomSkillPick sendSkillsBack={(skills: any) => {
                                                    let choiceList = [...this.state.choiceList];
                                                    let item = { ...choiceList[this.state.currentIndex] }
                                                    item.skillList = skills.skills;
                                                    item.amountToPick = skills.amountToPick;
                                                    choiceList[this.state.currentIndex] = item;
                                                    this.setState({ skillListOn: false, choiceList, currentIndex: 0 })
                                                }} />
                                            </Modal>
                                            {this.state.choiceList[index].choiceSkillList &&
                                                <View style={{ justifyContent: "center", alignItems: "center", padding: 15 }}>
                                                    <AppText textAlign={'center'} color={Colors.berries} fontSize={20}>Skills that have been picked</AppText>
                                                    <AppText fontSize={17}>Number of skills available to pick: {this.state.choiceList[index].choiceSkillList.amountToPick}</AppText>
                                                    {this.state.choiceList[index].choiceSkillList.skillList.map((skill: any) => <AppText key={skill}>{skill}</AppText>)}
                                                </View>
                                            }
                                        </View>


                                        <View>
                                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                                borderRadius={25} width={100} height={60} title={"Approve choice"}
                                                onPress={() => {
                                                    const choiceApprovedList = this.state.choiceApprovedList;
                                                    choiceApprovedList[index] = true;
                                                    this.setState({ choiceApprovedList })
                                                    this.props.sendChoiceArrayBack(this.state.choiceList)
                                                }} />
                                        </View>
                                    </View>
                                }
                            </View>)}
                        </View>
                    </View>

                }
            </View>
        )
    }
}


const styles = StyleSheet.create({

});