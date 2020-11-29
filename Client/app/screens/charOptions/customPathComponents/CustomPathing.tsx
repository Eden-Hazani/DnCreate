import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppButton } from '../../../components/AppButton';
import { AppTextInput } from '../../../components/forms/AppTextInput';
import { Colors } from '../../../config/colors';
import { CharacterModel } from '../../../models/characterModel';
import { PathNaming } from './PathNaming';
import pathLevelList from '../../../../jsonDump/customPathLevelList.json'
import { AppText } from '../../../components/AppText';
import { AddCustomFeature } from './AddCustomFeature';

interface CustomPathingState {
    pathInfo: any
    pathNameOk: boolean
    customPathComplete: boolean
    featureList: any[]
}

export class CustomPathing extends Component<{ character: CharacterModel, navigation: any, route: any }, CustomPathingState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pathNameOk: false,
            customPathComplete: false,
            pathInfo: null,
            featureList: []
        }
    }
    componentDidMount() {
        console.log(this.props.route.params)
    }



    render() {
        return (
            <ScrollView style={styles.container}>
                <PathNaming customPathComplete={(isDone: any) => {
                    this.setState({ pathNameOk: isDone.done, pathInfo: isDone.path })
                }} />
                {this.state.pathNameOk &&
                    pathLevelList[this.props.route.params.charClass].map((item: any) => <View key={item} style={{ marginBottom: 150 }}>
                        <AppText textAlign={'center'} fontSize={25} padding={5}>Level {item} path features</AppText>
                        <AddCustomFeature sendValues={(val: any) => { console.log(val) }} />
                    </View>)
                }
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});