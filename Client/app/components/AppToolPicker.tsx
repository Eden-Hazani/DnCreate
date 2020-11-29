import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { ActionType } from '../redux/action-type';
import { store } from '../redux/store';
import { AppText } from './AppText';

interface AppToolPickerState {
    toolsClicked: boolean[]
    tools: any[]
    amountToPick: number
    character: CharacterModel
    alreadyPickedTools: boolean[]
}


export class AppToolPicker extends Component<{
    character: CharacterModel
    amount: number, itemList: any, setAdditionalToolPicks: any, sendToolsBack: any
}, AppToolPickerState>{
    constructor(props: any) {
        super(props)
        this.state = {
            alreadyPickedTools: [],
            tools: [],
            amountToPick: this.props.amount,
            toolsClicked: [],
            character: store.getState().character
        }
    }
    componentDidMount() {
        for (let item of this.state.character.tools) {
            if (this.props.itemList.includes(item[0])) {
                const alreadyPickedTools = this.state.alreadyPickedTools;
                alreadyPickedTools[this.props.itemList.indexOf(item[0])] = true;
                this.setState({ alreadyPickedTools })
            }
        }
        this.props.setAdditionalToolPicks(true)
    }
    componentWillUnmount() {
        this.props.setAdditionalToolPicks(false)
    }

    pickTool = (tool: any, index: number) => {
        const character = this.props.character;
        let tools = this.state.tools;
        if (!this.state.toolsClicked[index]) {
            for (let item of this.state.character.tools) {
                if (item[0] === tool) {
                    alert(`You are already proficient with this tool`)
                    return;
                }
            }
            if (this.state.tools.length >= this.state.amountToPick) {
                alert(`You can only pick ${this.state.amountToPick} tools.`)
                return;
            }
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = true;
            tools.push(tool)
            character.tools.push([tool, 0])
            this.setState({ tools, toolsClicked, character }, () => {
                this.props.sendToolsBack(this.state.character)
                if (this.state.tools.length === this.state.amountToPick) {
                    this.props.setAdditionalToolPicks(false)
                }
            })
        }
        else if (this.state.toolsClicked[index]) {
            tools = tools.filter(val => val !== tool);
            character.tools = character.tools.filter(val => val[0] !== tool)
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = false;
            this.setState({ tools, toolsClicked, character }, () => {
                this.props.sendToolsBack(this.state.character)
            })
        }
    }
    render() {
        return (
            <View style={styles.container}>
                {this.props.itemList.map((tool: any, index: number) =>
                    <TouchableOpacity disabled={this.state.alreadyPickedTools[index]} key={index} onPress={() => this.pickTool(tool, index)}
                        style={[styles.item, { backgroundColor: this.state.toolsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                        <AppText textAlign={'center'}>{tool}</AppText>
                    </TouchableOpacity>)}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        alignContent: "center",
        justifyContent: "center"
    },
    item: {
        borderRadius: 15,
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.berries
    }
});