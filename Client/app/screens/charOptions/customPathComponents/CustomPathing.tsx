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
import AsyncStorage from '@react-native-community/async-storage';

interface CustomPathingState {
    pathInfo: any
    pathNameOk: boolean
    customPathComplete: boolean
    featureList: any[]
    featuresOk: boolean[]
}

export class CustomPathing extends Component<{ character: CharacterModel, navigation: any, route: any }, CustomPathingState>{
    constructor(props: any) {
        super(props)
        this.state = {
            featuresOk: [],
            pathNameOk: false,
            customPathComplete: false,
            pathInfo: null,
            featureList: []
        }
    }
    async componentDidMount() {
        // AsyncStorage.removeItem(`${this.props.route.params.charClass}-CustomPathFeatures`)
        // AsyncStorage.removeItem(`${this.props.route.params.charClass}-CustomPath`)
        this.setFeatures()
    }

    setFeatures = () => {
        const featuresOk = this.state.featuresOk;
        const featureList = this.state.featureList;
        for (let item of pathLevelList[this.props.route.params.charClass]) {
            featureList.push({ [item]: [] });
            featuresOk.push(false)
            this.setState({ featuresOk, featureList })
        }
    }

    createNewPath = async () => {
        let pathName = `${this.state.pathInfo.name}`
        let pathDescription = `${this.state.pathInfo.description}`
        let level: any = [];
        let json: any = '';
        for (let levelUp of this.state.featureList) {
            const items: any = Object.entries(levelUp)[0]
            for (let feature of items[1]) {
                let features: any = [];
                feature.map((specificFeature: any, index: number) => {
                    features.push(specificFeature)
                })
                const tempLevel = {
                    [items[0]]: features
                }
                level.push(tempLevel)
            }
            const tempJson = {
                [pathName]: level
            }
            json = JSON.stringify(tempJson)
        }
        this.createPathLevelUp(pathName, pathDescription);
        this.createPathFeatureTable(json);
    }

    createPathFeatureTable = async (pathFeaturesTable: any) => {
        const pathFeatures = await AsyncStorage.getItem(`${this.props.route.params.charClass}-CustomPathFeatures`);
        if (!pathFeatures) {
            await AsyncStorage.setItem(`${this.props.route.params.charClass}-CustomPathFeatures`, JSON.stringify([pathFeaturesTable]));
            return;
        }
        const newPathList = JSON.parse(pathFeatures);
        newPathList.push(pathFeaturesTable);
        await AsyncStorage.setItem(`${this.props.route.params.charClass}-CustomPathFeatures`, JSON.stringify(newPathList))
    }

    createPathLevelUp = async (pathName: any, pathDescription: any) => {
        const pathList = await AsyncStorage.getItem(`${this.props.route.params.charClass}-CustomPath`);
        const path = {
            name: pathName,
            description: pathDescription
        }
        if (!pathList) {
            await AsyncStorage.setItem(`${this.props.route.params.charClass}-CustomPath`, JSON.stringify([path]))
            return;
        }
        const newPathList = JSON.parse(pathList);
        newPathList.push(path);
        await AsyncStorage.setItem(`${this.props.route.params.charClass}-CustomPath`, JSON.stringify(newPathList))
    }



    render() {
        return (
            <ScrollView style={styles.container}>
                <PathNaming customPathComplete={(isDone: any) => {
                    this.setState({ pathNameOk: isDone.done, pathInfo: isDone.path })
                }} />
                {this.state.pathNameOk &&
                    <View>
                        {pathLevelList[this.props.route.params.charClass].map((item: any, index: number) => <View key={item} style={{ marginBottom: 150 }}>
                            <AppText textAlign={'center'} fontSize={25} padding={5}>Level {item} path features</AppText>
                            <AddCustomFeature sendValues={(val: any) => {
                                const featuresOk = this.state.featuresOk;
                                let featureList = [...this.state.featureList];
                                let feature = { ...featureList[index] }
                                feature[item].push(val.feature);
                                featuresOk[index] = val.isDone;
                                this.setState({ featureList, featuresOk })
                            }} />
                        </View>)}
                        <View>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed}
                                borderRadius={100} width={100} height={100} title={"Finish"} onPress={() => {
                                    if (this.state.featuresOk.includes(false)) {
                                        alert("You have missing information in your custom path");
                                        // return;
                                    }
                                    this.createNewPath()
                                }} />
                        </View>
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});