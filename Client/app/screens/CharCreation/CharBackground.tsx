import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { AppConfirmation } from '../../components/AppConfirmation';
import { AppText } from '../../components/AppText';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import * as Yup from 'yup';
import { AppForm } from '../../components/forms/AppForm';
import { AppFormField } from '../../components/forms/AppFormField';
import { SubmitButton } from '../../components/forms/SubmitButton';
import * as skillJson from '../../../jsonDump/skillList.json'
import * as toolsJson from '../../../jsonDump/toolList.json'
import backgroundsJson from '../../../jsonDump/officialBackgrounds.json'
import { AppTextInput } from '../../components/forms/AppTextInput';
import { BackgroundModal } from '../../models/backgroundModal';
import AsyncStorage from '@react-native-community/async-storage';
import { Config } from '../../../config';
import { Image } from 'react-native-expo-image-cache';

const ValidationSchema = Yup.object().shape({
    backgroundName: Yup.string().required().label("Background Name"),
    featureName: Yup.string().label("Feature Name"),
    featureDescription: Yup.string().label("Feature description"),
})

interface CharBackgroundState {
    characterInfo: CharacterModel
    confirmed: boolean
    makeYourOwnWindow: boolean
    officialWindow: boolean
    skillClicked: boolean[]
    pickedSkills: any[]
    oneToolOneLanguageChoice: boolean
    twoToolChoice: boolean
    twoLanguageChoice: boolean,
    addedLanguages: string[],
    toolsClicked: boolean[]
    pickedTools: any[],
    maxTools: number
    pickedOfficial: any
    officialClicked: boolean[]
    alreadyPickedSkills: any[]
    availableSkills: any[]
}



export class CharBackground extends Component<{ navigation: any }, CharBackgroundState> {
    navigationSubscription: any;
    backgroundDragon: any
    constructor(props: any) {
        super(props)
        this.state = {
            availableSkills: [],
            alreadyPickedSkills: [],
            officialClicked: [],
            pickedOfficial: null,
            maxTools: 0,
            addedLanguages: [],
            pickedTools: [],
            toolsClicked: [],
            oneToolOneLanguageChoice: false,
            twoToolChoice: false,
            twoLanguageChoice: false,
            skillClicked: [],
            pickedSkills: [],
            officialWindow: false,
            makeYourOwnWindow: false,
            confirmed: false,
            characterInfo: store.getState().character
        }
        this.backgroundDragon = {
            Acolyte: `${Config.serverUrl}/assets/backgroundDragons/acolyteDragon.png`,
            Urchin: `${Config.serverUrl}/assets/backgroundDragons/urchinDragon.png`,
            Soldier: `${Config.serverUrl}/assets/backgroundDragons/soldierDragon.png`,
            Sailor: `${Config.serverUrl}/assets/backgroundDragons/sailorDragon.png`,
            Pirate: `${Config.serverUrl}/assets/backgroundDragons/pirateDragon.png`,
            Sage: `${Config.serverUrl}/assets/backgroundDragons/sageDragon.png`,
            Outlander: `${Config.serverUrl}/assets/backgroundDragons/outlanderDragon.png`,
            Noble: `${Config.serverUrl}/assets/backgroundDragons/nobleDragon.png`,
            Hermit: `${Config.serverUrl}/assets/backgroundDragons/hermitDragon.png`,
            "Guild Artisan": `${Config.serverUrl}/assets/backgroundDragons/guildArtisanDragon.png`,
            "Folk Hero": `${Config.serverUrl}/assets/backgroundDragons/folkHeroDragon.png`,
            Entertainer: `${Config.serverUrl}/assets/backgroundDragons/entertainerDragon.png`,
            Criminal: `${Config.serverUrl}/assets/backgroundDragons/criminalDragon.png`,
            Charlatan: `${Config.serverUrl}/assets/backgroundDragons/charlatanDragon.png`,

        }
        this.navigationSubscription = this.props.navigation.addListener('focus', this.onFocus);
    }

    componentDidMount() {
        this.setState({ availableSkills: skillJson.skillList }, () => {
            if (this.state.characterInfo.skills) {
                for (let item of this.state.characterInfo.skills) {
                    if (this.state.availableSkills.includes(item[0])) {
                        const alreadyPickedSkills = this.state.alreadyPickedSkills;
                        alreadyPickedSkills[this.state.availableSkills.indexOf(item[0])] = true;
                        this.setState({ alreadyPickedSkills })
                    }
                }
            }
        })
    }

    onFocus = async () => {
        let characterInfo = { ...this.state.characterInfo }
        const item = await AsyncStorage.getItem(`${this.state.characterInfo.name}BackstoryStage`)
        if (item) {
            characterInfo = JSON.parse(item)
        }
        this.setState({ characterInfo })
    }

    pickSkill = (skill: string, index: number) => {
        if (!this.state.skillClicked[index]) {
            if (this.state.pickedSkills.length === 2) {
                alert('You can only pick 2 skills')
                return
            }
            const pickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = true;
            pickedSkills.push([skill, 0])
            this.setState({ skillClicked, pickedSkills });
        }
        else if (this.state.skillClicked[index]) {
            const oldPickedSkills = this.state.pickedSkills;
            const skillClicked = this.state.skillClicked;
            skillClicked[index] = false;
            const pickedSkills = oldPickedSkills.filter(item => item[0] !== skill);
            this.setState({ skillClicked, pickedSkills });
        }
    }

    pickTool = (tool: string, index: number) => {
        if (!this.state.toolsClicked[index]) {
            if (this.state.pickedTools.length === this.state.maxTools) {
                alert(`You can only pick ${this.state.maxTools} tools`)
                return
            }
            const pickedTools = this.state.pickedTools;
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = true;
            pickedTools.push([tool, 0])
            this.setState({ toolsClicked, pickedTools });
        }
        else if (this.state.toolsClicked[index]) {
            const oldPickedTools = this.state.pickedTools;
            const toolsClicked = this.state.toolsClicked;
            toolsClicked[index] = false;
            const pickedTools = oldPickedTools.filter(item => item[0] !== tool);
            this.setState({ toolsClicked, pickedTools });
        }
    }

    verifyNonOfficial = () => {
        if (this.state.twoLanguageChoice === false && this.state.twoToolChoice === false && this.state.oneToolOneLanguageChoice === false) {
            alert('You must pick a Tool or language option')
            return false
        }
        if (this.state.pickedSkills.length < 2) {
            alert('You skill have skills to pick')
            return false
        }
        if (this.state.pickedTools.length < this.state.maxTools) {
            alert('Must pick tool proficiency')
            return false;
        }
        if (this.state.oneToolOneLanguageChoice) {
            if (this.state.addedLanguages.length === 0 || this.state.addedLanguages[0] === "") {
                alert('Must add known language')
                return false;
            }
        }
        if (this.state.twoLanguageChoice) {
            if (this.state.addedLanguages.length === 0 || this.state.addedLanguages[0] === "") {
                alert('Must add known language')
                return false;
            }
            if (this.state.addedLanguages[1] === "") {
                alert('Must add known language')
                return false;
            }
        }

        return true
    }

    verifyOfficial = () => {
        if (this.state.pickedOfficial === null) {
            alert('Must pick a background')
            return false;
        }
        if (this.state.pickedOfficial.languages === 1) {
            if (this.state.addedLanguages.length === 0 || this.state.addedLanguages[0] === "") {
                alert('Must add known language')
                return false;
            }
        }
        if (this.state.pickedOfficial.languages === 2) {
            if (this.state.addedLanguages.length === 0 || this.state.addedLanguages[0] === "") {
                alert('Must add known language')
                return false;
            }
            if (this.state.addedLanguages[1] === "") {
                alert('Must add known language')
                return false;
            }
        }
        return true
    }


    insertInfoAndContinue = async (values: any) => {
        const characterInfo = { ...this.state.characterInfo };
        let existingCharSkills: any = [];
        let additionSkills: any = [];
        let newSkills: any = [];
        await AsyncStorage.setItem(`${this.state.characterInfo.name}BackstoryStage`, JSON.stringify(this.state.characterInfo))
        if (this.state.officialWindow) {
            if (!this.verifyOfficial()) {
                return;
            }
            characterInfo.background = new BackgroundModal();
            characterInfo.background.backgroundName = this.state.pickedOfficial.name;
            characterInfo.background.backgroundFeatureName = this.state.pickedOfficial.featureName;
            characterInfo.background.backgroundFeatureDescription = this.state.pickedOfficial.featureDescription;
            if (characterInfo.languages && this.state.characterInfo.skills && characterInfo.tools) {
                for (let language of this.state.addedLanguages) {
                    characterInfo.languages.push(language)
                }
                for (let skill of this.state.characterInfo.skills) {
                    existingCharSkills.push(skill[0])
                }
                for (let skill of this.state.pickedOfficial.skills) {
                    additionSkills.push(skill[0])
                }
                for (let item of existingCharSkills.concat(additionSkills.filter((item: any) => existingCharSkills.indexOf(item) < 0))) {
                    newSkills.push([item, 0])
                }
                characterInfo.skills = newSkills;
                for (let tool of this.state.pickedOfficial.tools) {
                    characterInfo.tools.push(tool)
                }
            }
        }
        if (this.state.makeYourOwnWindow) {
            if (!this.verifyNonOfficial()) {
                return;
            }
            characterInfo.tools = [];
            characterInfo.background = new BackgroundModal();
            characterInfo.background.backgroundName = values.backgroundName;
            characterInfo.background.backgroundFeatureName = values.featureName;
            characterInfo.background.backgroundFeatureDescription = values.featureDescription;
            if (characterInfo.languages && characterInfo.skills) {
                for (let language of this.state.addedLanguages) {
                    characterInfo.languages.push(language)
                }
                for (let skill of this.state.pickedSkills) {
                    characterInfo.skills.push(skill)
                }
                for (let tool of this.state.pickedTools) {
                    characterInfo.tools.push(tool)
                }
            }
        }
        this.setState({ characterInfo, confirmed: true }, () => {
            store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.characterInfo })
            setTimeout(() => {
                this.props.navigation.navigate("CharSkillPick");
            }, 800);
            setTimeout(() => {
                this.setState({ confirmed: false })
            }, 1100);
        })
    }



    render() {
        return (
            <ScrollView keyboardShouldPersistTaps="always" style={styles.container}>
                {this.state.confirmed ? <AppConfirmation visible={this.state.confirmed} /> :
                    <View>
                        <View style={{ padding: 10 }}>
                            <AppText fontSize={22} textAlign={'center'} color={Colors.berries}>You need to pick your characters background</AppText>
                            <AppText fontSize={18} textAlign={'center'} color={Colors.whiteInDarkMode}>You can either pick an official background or make your own (with your Dm's approval)</AppText>
                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", marginTop: 20 }}>
                                <AppButton fontSize={18} backgroundColor={this.state.makeYourOwnWindow ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={25} width={150} height={70}
                                    title={"Make your own?"} onPress={() => { this.setState({ makeYourOwnWindow: true, officialWindow: false }) }} />
                                <AppButton fontSize={18} backgroundColor={this.state.officialWindow ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={25} width={150} height={70}
                                    title={"Pick official?"} onPress={() => { this.setState({ makeYourOwnWindow: false, officialWindow: true }) }} />
                            </View>
                        </View>
                        {this.state.makeYourOwnWindow &&
                            <View style={{ marginTop: 20 }}>
                                <View style={{ padding: 10 }}>
                                    <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Enter your Background information below</AppText>
                                    <AppText fontSize={18} textAlign={'center'} color={Colors.whiteInDarkMode}>Your background feature should reflect the background itself and make sense woven into your actual background story.</AppText>
                                    <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>You can take examples from official fifth edition backgrounds.</AppText>
                                </View>
                                <AppForm
                                    initialValues={{
                                        backgroundName: '', featureName: '', featureDescription: ''
                                    }}
                                    onSubmit={(values: any) => { this.insertInfoAndContinue(values) }}
                                    validationSchema={ValidationSchema}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <AppFormField
                                            style={{ width: Dimensions.get('screen').width }}
                                            fieldName={"backgroundName"}
                                            name="backgroundName"
                                            iconName={"text-short"}
                                            placeholder={"Background Name..."} />
                                        <AppFormField
                                            style={{ width: Dimensions.get('screen').width }}
                                            fieldName={"featureName"}
                                            name="featureName"
                                            iconName={"text-short"}
                                            placeholder={"Feature Name..."} />
                                        <AppFormField
                                            style={{ width: Dimensions.get('screen').width }}
                                            fieldName={"featureDescription"}
                                            name="featureDescription"
                                            iconName={"text-short"}
                                            placeholder={"Feature description..."} />
                                        <View>
                                            <View style={{ marginBottom: 15, flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <View style={{ padding: 10 }}>
                                                    <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Pick two skills that your character knows from its background (this should reflect the characters background story)</AppText>
                                                </View>
                                                {skillJson.skillList.map((skill, index) =>
                                                    <TouchableOpacity key={index} disabled={this.state.alreadyPickedSkills[index]}
                                                        style={[styles.skill, { backgroundColor: this.state.alreadyPickedSkills[index] ? Colors.berries : this.state.skillClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                                        onPress={() => this.pickSkill(skill, index)}>
                                                        <AppText>{skill}</AppText>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: "space-evenly", flexWrap: "wrap" }}>
                                                <View style={{ margin: 10 }}>
                                                    <AppButton fontSize={18} backgroundColor={this.state.oneToolOneLanguageChoice ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={25} width={150} height={70}
                                                        title={"One Tool One Language?"} onPress={() => {
                                                            this.setState({ maxTools: 1, oneToolOneLanguageChoice: true, twoLanguageChoice: false, twoToolChoice: false, toolsClicked: [], pickedTools: [], addedLanguages: [] })
                                                        }} />
                                                </View>
                                                <View style={{ margin: 10 }}>
                                                    <AppButton fontSize={18} backgroundColor={this.state.twoToolChoice ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={25} width={150} height={70}
                                                        title={"Two Tools?"} onPress={() => {
                                                            this.setState({ maxTools: 2, oneToolOneLanguageChoice: false, twoLanguageChoice: false, twoToolChoice: true, toolsClicked: [], pickedTools: [], addedLanguages: [] })
                                                        }} />
                                                </View>
                                                <View style={{ margin: 10 }}>
                                                    <AppButton fontSize={18} backgroundColor={this.state.twoLanguageChoice ? Colors.bitterSweetRed : Colors.lightGray} borderRadius={25} width={150} height={70}
                                                        title={"Two Languages?"} onPress={() => {
                                                            this.setState({ maxTools: 0, oneToolOneLanguageChoice: false, twoLanguageChoice: true, twoToolChoice: false, toolsClicked: [], pickedTools: [], addedLanguages: [] })
                                                        }} />
                                                </View>
                                            </View>
                                            <View>
                                                {this.state.oneToolOneLanguageChoice &&
                                                    <View>
                                                        <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Please insert your extra known language</AppText>
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[0] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                        <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>You can pick 1 tool Proficiency</AppText>
                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                            {toolsJson.tools.map((tool, index) =>
                                                                <TouchableOpacity key={index} style={[styles.skill, { backgroundColor: this.state.toolsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                                                    onPress={() => this.pickTool(tool, index)}>
                                                                    <AppText>{tool}</AppText>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    </View>}
                                                {this.state.twoToolChoice &&
                                                    <View>
                                                        <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>You can pick 2 tool proficiencies</AppText>
                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                            {toolsJson.tools.map((tool, index) =>
                                                                <TouchableOpacity key={index} style={[styles.skill, { backgroundColor: this.state.toolsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}
                                                                    onPress={() => this.pickTool(tool, index)}>
                                                                    <AppText>{tool}</AppText>
                                                                </TouchableOpacity>
                                                            )}
                                                        </View>
                                                    </View>}
                                                {this.state.twoLanguageChoice &&
                                                    <View>
                                                        <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Please insert your extra 2 known language</AppText>
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[0] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[1] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                    </View>}
                                            </View>
                                        </View>
                                    </View>
                                    <SubmitButton title={"Continue"} />
                                </AppForm>
                            </View>}
                        {this.state.officialWindow &&
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "center", alignItems: "center" }}>
                                    {Object.values(backgroundsJson).map((item: any, index: number) =>
                                        <TouchableOpacity style={[styles.skill, { backgroundColor: this.state.officialClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]} key={index}
                                            onPress={() => {
                                                let officialClicked = this.state.officialClicked;
                                                officialClicked = [];
                                                officialClicked[index] = true;
                                                this.setState({ pickedOfficial: item, officialClicked })
                                            }}>
                                            <AppText>{item.name}</AppText>
                                        </TouchableOpacity>)}
                                </View>
                                <View>
                                    {this.state.pickedOfficial !== null &&
                                        <View>
                                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                                <Image style={{ width: 150, height: 150 }} uri={this.backgroundDragon[this.state.pickedOfficial.name]} />
                                            </View>
                                            <View style={{ padding: 17 }}>
                                                <AppText fontSize={25} textAlign={'center'} color={Colors.berries}>{this.state.pickedOfficial.name}</AppText>
                                                <AppText fontSize={22} textAlign={'center'} color={Colors.whiteInDarkMode}>Feature: {this.state.pickedOfficial.featureName}</AppText>
                                                <AppText fontSize={20} textAlign={'center'} color={Colors.berries}>{this.state.pickedOfficial.featureDescription.replace(/\. /g, '.\n\n')}</AppText>
                                            </View>
                                            <View style={{ padding: 17 }}>
                                                <AppText fontSize={25} textAlign={'center'} color={Colors.whiteInDarkMode}>Tool Proficiency</AppText>
                                                {this.state.pickedOfficial.tools.length > 0 ? this.state.pickedOfficial.tools.map((tool: any, index: number) => <View key={index}><AppText fontSize={17} textAlign={'center'} color={Colors.berries}>{tool[0]}</AppText></View>)
                                                    : <View><AppText fontSize={17} textAlign={'center'} color={Colors.berries}>This background has no tool proficiencies</AppText></View>}
                                                <AppText fontSize={25} textAlign={'center'} color={Colors.whiteInDarkMode}>Skill Proficiency</AppText>
                                                {this.state.pickedOfficial.skills.map((skill: any, index: number) => <View key={index}><AppText fontSize={17} textAlign={'center'} color={Colors.berries}>{skill[0]}</AppText></View>)}
                                            </View>
                                            <View>
                                                {backgroundsJson[this.state.pickedOfficial.name].languages === 1 &&
                                                    <View>
                                                        <View style={{ padding: 17 }}>
                                                            <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Please insert your extra 1 known language</AppText>
                                                        </View>
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[0] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                    </View>
                                                }
                                                {backgroundsJson[this.state.pickedOfficial.name].languages === 2 &&
                                                    <View>
                                                        <View style={{ padding: 17 }}>
                                                            <AppText fontSize={18} textAlign={'center'} color={Colors.berries}>Please insert your extra 2 known languages</AppText>
                                                        </View>
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[0] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                        <AppTextInput placeholder={'Language'} onChangeText={(txt: string) => {
                                                            const addedLanguages = this.state.addedLanguages;
                                                            addedLanguages[1] = txt;
                                                            this.setState({ addedLanguages })
                                                        }} />
                                                    </View>
                                                }
                                            </View>
                                        </View>
                                    }
                                </View>
                                <View style={{ paddingBottom: 25 }}>
                                    <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100}
                                        height={100} title={"Continue"} onPress={() => { this.insertInfoAndContinue(null) }} />
                                </View>
                            </View>}
                    </View>}
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    skill: {
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