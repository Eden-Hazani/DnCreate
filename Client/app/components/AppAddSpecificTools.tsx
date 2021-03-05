import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import logger from '../../utility/logger';
import { Colors } from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppAddSpecificToolsState {
    character: CharacterModel
    conditionalToolsToPickNumber: number
    toolsClicked: boolean[]
    toolsPicked: string[]
    conditionalTool: string
}

export class AppAddSpecificTools extends Component<{ optionalTools: [], sendToolsBack: any, setAdditionalToolPicks: any, withReplacementConditions: boolean, tools: any[], character: CharacterModel, loadTools: any, path: any }, AppAddSpecificToolsState>{
    constructor(props: any) {
        super(props)
        this.state = {
            conditionalTool: '',
            conditionalToolsToPickNumber: 0,
            character: this.props.character,
            toolsClicked: [],
            toolsPicked: []
        }
    }
    componentDidMount() {
        try {
            const character = { ...this.state.character };
            let conditionalToolsToPickNumber = 0;
            if (this.props.withReplacementConditions) {
                if (character.tools) {
                    for (let tool of character.tools) {
                        if (this.props.tools.includes(tool[0])) {
                            this.setState({ conditionalTool: tool[0] })
                            conditionalToolsToPickNumber = conditionalToolsToPickNumber + 1
                        }
                    }
                }
                console.log(this.props.optionalTools)
                if (conditionalToolsToPickNumber > 0) {
                    this.props.setAdditionalToolPicks(true)
                    this.setState({ conditionalToolsToPickNumber })
                }
            } else {
                if (character.tools) {
                    for (let item of this.props.tools) {
                        character.tools.push([item, 0]);
                    }
                    this.setState({ character }, () => {
                        this.props.loadTools(this.state.character)
                    })
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickTool = (tool: any, index: number) => {
        try {
            const character = this.props.character;
            let toolsPicked = this.state.toolsPicked;
            if (!this.state.toolsClicked[index] && this.state.character.tools && character.tools) {
                for (let item of this.state.character.tools) {
                    if (item[0] === tool) {
                        alert(`You are already proficient with this tool`)
                        return;
                    }
                }
                if (this.state.toolsPicked.length >= this.state.conditionalToolsToPickNumber) {
                    alert(`You can only pick ${this.state.conditionalToolsToPickNumber} tools.`)
                    return;
                }
                const toolsClicked = this.state.toolsClicked;
                toolsClicked[index] = true;
                toolsPicked.push(tool)
                character.tools.push([tool, 0])
                this.setState({ toolsPicked, toolsClicked, character }, () => {
                    this.props.sendToolsBack(this.state.character)
                    if (this.state.toolsPicked.length === this.state.conditionalToolsToPickNumber) {
                        this.props.setAdditionalToolPicks(false)
                    }
                })
            }
            else if (this.state.toolsClicked[index] && character.tools) {
                toolsPicked = toolsPicked.filter(val => val !== tool);
                character.tools = character.tools.filter(val => val[0] !== tool)
                const toolsClicked = this.state.toolsClicked;
                toolsClicked[index] = false;
                this.setState({ toolsPicked, toolsClicked, character }, () => {
                    this.props.sendToolsBack(this.state.character)
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={20} textAlign={'center'}>As a level {this.props.character.level} {this.props.character.characterClass} {this.props.path} you gain proficiency with the following tools.</AppText>
                {this.props.withReplacementConditions ?
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {this.props.tools.map(tool =>
                                <View key={tool}>
                                    {tool !== this.state.conditionalTool && <AppText fontSize={17} color={Colors.berries}>{tool}</AppText>}
                                </View>)}
                        </View>
                        {this.state.conditionalToolsToPickNumber > 0 &&
                            <View>
                                <AppText textAlign={'center'} fontSize={17}>Since you already have proficiency with {this.state.conditionalTool} please pick one of the other options provided</AppText>
                                {this.props.optionalTools.map((item, index) => {
                                    return <TouchableOpacity onPress={() => this.pickTool(item, index)} key={index} style={[styles.item, { backgroundColor: this.state.toolsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText>{item}</AppText>
                                    </TouchableOpacity>
                                })}
                            </View>}
                    </View>
                    :
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            {this.props.tools.map(tool =>
                                <View key={tool}>
                                    <AppText fontSize={17} color={Colors.berries}>{tool}</AppText>
                                </View>)}
                        </View>
                    </View>
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
        borderRadius: 15,
        padding: 15,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.berries
    }
});