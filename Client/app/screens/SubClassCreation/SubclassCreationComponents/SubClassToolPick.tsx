import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { ScrollView, Switch } from 'react-native-gesture-handler';
import * as toolList from '../../../../jsonDump/toolList.json'
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import NumberScroll from '../../../components/NumberScroll';
import { Colors } from '../../../config/colors';

interface SubClassToolPickState {
    toolsClicked: boolean[],
    toolsAdded: any[],
    amountToPick: number
    beforeChangesTools: any[]
    beforeAmountChange: number
}
export class SubClassToolPick extends Component<{ toolsAdded: any, amountToPick: number, closeModal: any }, SubClassToolPickState>{
    constructor(props: any) {
        super(props)
        this.state = {
            toolsAdded: this.props.toolsAdded,
            toolsClicked: [],
            amountToPick: this.props.amountToPick,
            beforeChangesTools: JSON.parse(JSON.stringify(this.props.toolsAdded)),
            beforeAmountChange: JSON.parse(JSON.stringify(this.props.amountToPick))
        }
    }


    componentDidMount() {
        const toolsClicked = this.state.toolsClicked;
        for (let item of this.props.toolsAdded) {
            if (toolList.tools.includes(item)) {
                toolsClicked[toolList.tools.indexOf(item)] = true;
            }
        }
        this.setState({ toolsClicked })
    }

    pickSkills = (skill: any, index: number) => {
        if (!this.state.toolsClicked[index]) {
            const toolsAdded = this.state.toolsAdded;
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = true;
            toolsAdded.push(skill)
            this.setState({ toolsClicked, toolsAdded });
        }
        else if (this.state.toolsClicked[index]) {
            const oldtoolsAdded = this.state.toolsAdded;
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = false;
            const toolsAdded = oldtoolsAdded.filter(item => item !== skill);
            this.setState({ toolsClicked, toolsAdded });
        }
    }

    approveChoices = () => {
        this.props.closeModal({ tools: this.state.toolsAdded, amount: this.state.amountToPick })
    }

    render() {
        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.pageBackground }]}>
                <View style={{ padding: 20 }}>
                    <AppText textAlign={'center'} fontSize={18}>Here you can pick the tools the players will have the ability to choose from</AppText>
                    <AppText textAlign={'center'} fontSize={18}>At the bottom you can adjust the number of allowed tool picks for the player</AppText>
                </View>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {toolList.tools.map((item, index) => {
                        return <TouchableOpacity key={index} onPress={() => this.pickSkills(item, index)}
                            style={[styles.item, { backgroundColor: this.state.toolsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            <AppText fontSize={22} textAlign={'center'}>{item}</AppText>
                        </TouchableOpacity>
                    })}
                </View>
                <View style={{ justifyContent: "center", alignItems: "center", paddingBottom: 15 }}>
                    <View style={{
                        borderColor: Colors.whiteInDarkMode,
                        width: 170, borderWidth: 1, borderRadius: 15,
                    }}>
                        <AppText textAlign={'center'}>Tools amount</AppText>
                        <NumberScroll modelColor={Colors.pageBackground} startFromZero={false} max={this.state.toolsAdded.length !== 0 ? this.state.toolsAdded.length : 1}
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
                                        toolsAdded: this.state.beforeChangesTools,
                                        amountToPick: this.state.beforeAmountChange
                                    }, () => {
                                        this.props.closeModal({
                                            tools: this.state.beforeChangesTools,
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