import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../config/colors';
import { CharacterModel } from '../models/characterModel';
import { AppText } from './AppText';

interface AppAddSpecificToolsState {
    character: CharacterModel
}

export class AppAddSpecificTools extends Component<{ tools: [], character: CharacterModel, loadTools: any, path: any }, AppAddSpecificToolsState>{
    constructor(props: any) {
        super(props)
        this.state = {
            character: this.props.character
        }
    }
    componentDidMount() {
        const character = { ...this.state.character };
        for (let item of this.props.tools) {
            character.tools.push([item, 0]);
        }
        this.setState({ character }, () => {
            this.props.loadTools(this.state.character)
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <AppText fontSize={20} textAlign={'center'}>As a level {this.props.character.level} {this.props.character.characterClass} {this.props.path} you gain proficiency with the following tools.</AppText>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {this.props.tools.map(tool =>
                        <View key={tool}>
                            <AppText fontSize={17} color={colors.berries}>{tool}</AppText>
                        </View>)}
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});