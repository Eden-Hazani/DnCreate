import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../../../components/AppText';
import skillsListJson from '../../../../jsonDump/skillList.json'
import { AppTextInput } from '../../../components/forms/AppTextInput';
import { Colors } from '../../../config/colors';
import { AppButton } from '../../../components/AppButton';

interface CustomSkillPickState {
    pickedSkills: any[]
    amountToPick: number
    skillClicked: boolean[]
}

export class CustomSkillPick extends Component<{ sendSkillsBack: any }, CustomSkillPickState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pickedSkills: [],
            amountToPick: null,
            skillClicked: []
        }
    }
    pickSkill = (skill: string, index: number) => {
        if (!this.state.skillClicked[index]) {
            const pickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = true;
            pickedSkills.push(skill)
            this.setState({ skillClicked, pickedSkills });
        }
        else if (this.state.skillClicked[index]) {
            const oldPickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = false;
            const pickedSkills = oldPickedSkills.filter(item => item !== skill);
            this.setState({ skillClicked, pickedSkills });
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={{ justifyContent: "center", alignItems: "center", marginTop: 15 }}>
                    <AppText>Number of skills allowed to pick</AppText>
                    <AppTextInput placeholder={"Enter here"} onChangeText={(txt: any) => { this.setState({ amountToPick: parseInt(txt) }) }} />
                    <AppText>Pick your wanted skills</AppText>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {skillsListJson.skillList.map((skill, index) =>
                            <TouchableOpacity key={index} style={[styles.item, { backgroundColor: this.state.skillClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                onPress={() => this.pickSkill(skill, index)}>
                                <AppText>{skill}</AppText>
                            </TouchableOpacity>)}
                    </View>
                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                        borderRadius={25} width={100} height={60} title={"Add Skills"}
                        onPress={() => {
                            if (!this.state.amountToPick || this.state.amountToPick < 0) {
                                alert("Amount to pick must be a valid number");
                                return;
                            }
                            if (this.state.amountToPick > this.state.pickedSkills.length) {
                                alert("Amount to pick cannot be larger then the total amount of skills");
                                return
                            }
                            this.props.sendSkillsBack({ skills: this.state.pickedSkills, amountToPick: this.state.amountToPick })
                        }} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
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