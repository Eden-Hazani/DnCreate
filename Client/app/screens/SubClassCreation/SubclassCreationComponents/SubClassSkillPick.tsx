import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import * as skillJson from '../../../../jsonDump/skillList.json'
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import NumberScroll from '../../../components/NumberScroll';
import { Colors } from '../../../config/colors';

interface SubClassSkillPickState {
    skillClicked: boolean[],
    skillsAdded: any[],
    isExpertise: boolean,
    amountToPick: number
    beforeChangesSkills: any[]
    beforeAmountChange: number
    beforeExpertiseChange: boolean
}
export class SubClassSkillPick extends Component<{ isExpertise: boolean, skillsAdded: any, amountToPick: number, closeModal: any }, SubClassSkillPickState>{
    constructor(props: any) {
        super(props)
        this.state = {
            isExpertise: this.props.isExpertise,
            skillsAdded: this.props.skillsAdded,
            skillClicked: [],
            amountToPick: this.props.amountToPick,
            beforeExpertiseChange: JSON.parse(JSON.stringify(this.props.isExpertise)),
            beforeChangesSkills: JSON.parse(JSON.stringify(this.props.skillsAdded)),
            beforeAmountChange: JSON.parse(JSON.stringify(this.props.amountToPick))
        }
    }


    componentDidMount() {
        const skillClicked = this.state.skillClicked;
        for (let item of this.props.skillsAdded) {
            if (skillJson.skillList.includes(item)) {
                skillClicked[skillJson.skillList.indexOf(item)] = true;
            }
        }
        this.setState({ skillClicked })
    }

    pickSkills = (skill: any, index: number) => {
        if (!this.state.skillClicked[index]) {
            const skillsAdded = this.state.skillsAdded;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = true;
            skillsAdded.push(skill)
            this.setState({ skillClicked, skillsAdded });
        }
        else if (this.state.skillClicked[index]) {
            const oldSkillsAdded = this.state.skillsAdded;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = false;
            const skillsAdded = oldSkillsAdded.filter(item => item !== skill);
            this.setState({ skillClicked, skillsAdded });
        }
    }

    approveChoices = () => {
        this.props.closeModal({ expertise: this.state.isExpertise, skills: this.state.skillsAdded, amount: this.state.amountToPick })
    }

    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ padding: 20 }}>
                    <AppText textAlign={'center'} fontSize={18}>Here you can pick the skills the players will have the ability to choose from</AppText>
                    <AppText textAlign={'center'} fontSize={18}>At the bottom you can adjust the number of allowed skill picks for the player</AppText>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {skillJson.skillList.map((item, index) => {
                        return <TouchableOpacity key={index} onPress={() => this.pickSkills(item, index)}
                            style={[styles.item, { backgroundColor: this.state.skillClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText fontSize={22} textAlign={'center'}>{item}</AppText>
                        </TouchableOpacity>
                    })}
                </View>
                <View style={{ alignItems: 'center', justifyContent: "center" }}>
                    <AppText textAlign={'center'} fontSize={18} padding={10}>Does these skills start as expertise for the character?</AppText>
                    <Switch value={this.state.isExpertise} onValueChange={() => {
                        if (this.state.isExpertise) {
                            this.setState({ isExpertise: false })
                            return;
                        }
                        this.setState({ isExpertise: true })
                    }} />
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 15 }}>
                    <View style={{
                        borderColor: Colors.whiteInDarkMode,
                        width: 170, borderWidth: 1, borderRadius: 15,
                    }}>
                        <AppText textAlign={'center'}>Skill amount</AppText>
                        <NumberScroll modelColor={Colors.pageBackground} startFromZero={false} max={this.state.skillsAdded.length !== 0 ? this.state.skillsAdded.length : 1}
                            startingVal={this.props.amountToPick}
                            getValue={(amountToPick: number) => { this.setState({ amountToPick }) }} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 25 }}>
                    <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                        borderRadius={10}
                        backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                    <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                        Alert.alert("Cancel?", "All changes will be lost",
                            [{
                                text: 'Yes', onPress: () => {
                                    this.setState({
                                        isExpertise: this.state.beforeExpertiseChange, skillsAdded: this.state.beforeChangesSkills,
                                        amountToPick: this.state.beforeAmountChange
                                    }, () => {
                                        this.props.closeModal({
                                            expertise: this.state.beforeExpertiseChange, skills: this.state.beforeChangesSkills,
                                            amount: this.state.beforeAmountChange
                                        })
                                    })
                                }
                            }, { text: 'No' }])
                    }}
                        borderRadius={10}
                        backgroundColor={Colors.metallicBlue} width={120} height={45} />
                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        width: Dimensions.get('window').width / 1.2,
        margin: 10,
        padding: 10,
        borderRadius: 15,
    }
});