import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import * as skillJson from '../../../../jsonDump/skillList.json'
import * as toolJson from '../../../../jsonDump/toolList.json'
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import NumberScroll from '../../../components/NumberScroll';
import { Colors } from '../../../config/colors';

interface SkillOrToolPickState {
    ItemClicked: boolean[],
    itemsAdded: any[],
    isExpertise: boolean,
    beforeChangesSkills: any[]
    beforeExpertiseChange: boolean
    baseList: string[]
}
export class SkillOrToolPick extends Component<{ skillOrTool: string, isExpertise: boolean, itemsAdded: any, closeModal: any }, SkillOrToolPickState>{
    constructor(props: any) {
        super(props)
        this.state = {
            baseList: this.props.skillOrTool === "skill" ? skillJson.skillList : toolJson.tools,
            isExpertise: this.props.isExpertise,
            itemsAdded: this.props.itemsAdded,
            ItemClicked: [],
            beforeExpertiseChange: JSON.parse(JSON.stringify(this.props.isExpertise)),
            beforeChangesSkills: JSON.parse(JSON.stringify(this.props.itemsAdded)),
        }
    }


    componentDidMount() {
        console.log(this.props.skillOrTool)
        const ItemClicked = this.state.ItemClicked;
        for (let item of this.props.itemsAdded) {
            if (this.state.baseList.includes(item)) {
                ItemClicked[this.state.baseList.indexOf(item)] = true;
            }
        }
        this.setState({ ItemClicked })
    }

    pickSkills = (skill: any, index: number) => {
        if (!this.state.ItemClicked[index]) {
            const itemsAdded = this.state.itemsAdded;
            const ItemClicked = this.state.ItemClicked;
            ItemClicked[index] = true;
            itemsAdded.push(skill)
            this.setState({ ItemClicked, itemsAdded });
        }
        else if (this.state.ItemClicked[index]) {
            const oldItemsAdded = this.state.itemsAdded;
            const ItemClicked = this.state.ItemClicked;
            ItemClicked[index] = false;
            const itemsAdded = oldItemsAdded.filter(item => item !== skill);
            this.setState({ ItemClicked, itemsAdded });
        }
    }

    approveChoices = () => {
        this.props.closeModal({ expertise: this.state.isExpertise, items: this.state.itemsAdded })
    }

    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ padding: 20 }}>
                    <AppText textAlign={'center'} fontSize={18}>Here you can pick the skills the players will have the ability to choose from</AppText>
                    <AppText textAlign={'center'} fontSize={18}>At the bottom you can adjust the number of allowed skill picks for the player</AppText>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {this.state.baseList.map((item, index) => {
                        return <TouchableOpacity key={index} onPress={() => this.pickSkills(item, index)}
                            style={[styles.item, { backgroundColor: this.state.ItemClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText fontSize={22} textAlign={'center'}>{item}</AppText>
                        </TouchableOpacity>
                    })}
                </View>
                {this.props.skillOrTool === "skill" &&
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
                }
                <View style={{ flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 25 }}>
                    <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                        borderRadius={10}
                        backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                    <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                        Alert.alert("Cancel?", "All changes will be lost",
                            [{
                                text: 'Yes', onPress: () => {
                                    this.setState({
                                        isExpertise: this.state.beforeExpertiseChange, itemsAdded: this.state.beforeChangesSkills,
                                    }, () => {
                                        this.props.closeModal({
                                            expertise: this.state.beforeExpertiseChange, items: this.state.beforeChangesSkills,
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