import React, { Component } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AppText } from '../components/AppText';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import sheetImage from '../../jsonDump/sheet64baseJson.json'
import { CharacterModel } from '../models/characterModel';
import { store } from '../redux/store';
import skillModifier from '../../utility/skillModifier';
import { skillExpertiseCheck } from '../../utility/skillExpertiseCheck';
import pdfSkillPositionSwitch from '../../utility/pdfSkillPositionSwitch';
import jsonSkillList from '../../jsonDump/skillList.json'
import hitDiceSwitch from '../../utility/hitDiceSwitch';
import pfdPersonalityTraitPositionSwitch from '../../utility/pfdPersonalityTraitPositionSwitch';
import * as features from '../classFeatures/features';
import { AppActivityIndicator } from '../components/AppActivityIndicator';
import * as FileSystem from 'expo-file-system';


interface CreatePDFState {
    character: CharacterModel
    loading: boolean
    uri: string
    innerHTML: string
}

export class CreatePDF extends Component<{ route: any, navigation: any }, CreatePDFState>{
    private _ismounted: boolean;
    navigationSubscription: any;
    constructor(props: any) {
        super(props)
        this.state = {
            innerHTML: '',
            uri: '',
            loading: true,
            character: store.getState().character
        }
        this.navigationSubscription = this.props.navigation.addListener('blur', this.blur);
        this._ismounted = true
    }

    blur = () => {
        this.setState({ uri: '' })
        this.componentWillUnmount()
    }

    componentWillUnmount() {
        if (this.state.uri !== '') {
            FileSystem.deleteAsync(this.state.uri, { idempotent: false })
        }
        this._ismounted = false
        this.navigationSubscription()
        this.setState({ uri: '' })
    }


    componentDidMount() {
        this._ismounted = true;
        console.log(this.state.uri)
        this.innerHTML()
        this.maxHpCheck()
    }

    skillCheck = (skill: string) => {
        if (this.state.character.modifiers) {
            const modifiers = Object.entries(this.state.character.modifiers)
            const skillGroup = skillModifier(skill);
            for (let item of modifiers) {
                if (item[0] === skillGroup) {
                    return item[1]
                }
            }
        }
    }

    createSkillList = () => {
        let html = ``
        let simpleSkillList: string[] = []
        let notProficientSkills: any[] = []
        if (this.state.character.skills) {
            for (let item of this.state.character.skills) {
                simpleSkillList.push(item[0])
            }
            notProficientSkills = jsonSkillList.skillList.filter(function (el) {
                return simpleSkillList.indexOf(el) < 0;
            }).map(skill => [skill, 0]);
            for (let skill of notProficientSkills) {
                html = html + ` <p style="font-size: 20px; position: absolute; left: 222px; top: ${pdfSkillPositionSwitch(skill[0]).numberHeight};">${(this.skillCheck(skill) <= 0 ? `${this.skillCheck(skill)}</p>` : `+${this.skillCheck(skill)}</p>`)} \n`
            }
            for (let skill of this.state.character.skills) {
                html = html + `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: ${pdfSkillPositionSwitch(skill[0]).dotHeight};">&#9679 </p> <p style="font-size: 20px; position: absolute; left: 222px; top: ${pdfSkillPositionSwitch(skill[0]).numberHeight};">${((this.skillCheck(skill) + this.props.route.params.proficiency) + skillExpertiseCheck(skill[1], this.props.route.params.proficiency) <= 0 ? `${(this.skillCheck(skill) + this.props.route.params.proficiency) + skillExpertiseCheck(skill[1], this.props.route.params.proficiency)}</p>` : `+${(this.skillCheck(skill) + this.props.route.params.proficiency) + skillExpertiseCheck(skill[1], this.props.route.params.proficiency)}</p>`)} \n`
            }
            return html
        }
    }

    getPersonalAttributes = (att: string) => {
        let html = ``
        let index = 0;
        for (let item of this.state.character[att]) {
            if (index > 2 && att !== "personalityTraits") {
                return html
            }
            if (index > 3 && att === "personalityTraits") {
                return html
            }
            html = html + `<p style="font-size: 15px; position: absolute; left: 755px; top: ${pfdPersonalityTraitPositionSwitch(att)[`height${index}`]};">${item.slice(0, 30)}...</p>`
            index = index + 1
        }
        return html
    }

    getFeaturesAndTraits = () => {
        let fullList: any[] = []
        let html: string = '';
        let hightIndex: number = 695;
        if (this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.uniqueAbilities && this.state.character.feats && this.state.character.pathFeatures) {
            for (let item of this.state.character.raceId.raceAbilities.uniqueAbilities) {
                fullList.push([item.name, item.description.slice(0, 50)])
            }
            for (let item of this.state.character.feats) {
                fullList.push([item.name, item.description.slice(0, 50)])
            }
            for (let item of features.featurePicker(this.props.route.params.char.level, this.props.route.params.char.characterClass).features) {
                fullList.push([item.name, item.description.slice(0, 50)])
            }
            for (let item of this.state.character.pathFeatures) {
                fullList.push([item.name, item.description.slice(0, 50)])
            }
            for (let item of fullList) {
                if (hightIndex > 1350) {
                    return html
                }
                html = html + `<p style="max-width: 280px; word-break: break-all; font-size: 15px; position: absolute; left: 720px; top: ${hightIndex}px;"> <span style="font-weight: 800;">- ${item[0]} -</span> ${item[1]}...</p>`
                hightIndex = hightIndex + 40
            }
            return html
        }
    }

    maxHpCheck = () => {
        if (!this.state.character.maxHp && this.state.character.modifiers && this.state.character.modifiers.constitution) {
            const character = { ...this.state.character };
            let maxHp = hitDiceSwitch(this.state.character.characterClass) + this.state.character.modifiers.constitution;
            if (this.state.character.path?.name === "Draconic Bloodline") {
                maxHp = maxHp + 1
            }
            character.maxHp = maxHp;
            this.setState({ character }, () => {
                return this.state.character.maxHp
            })
        }
        return this.state.character.maxHp;
    }

    getItems = () => {
        let html = ``
        if (this.state.character.items.length > 0) {
            for (let item of this.state.character.items) {
                html = html + ` ${item[1]} - ${item[0]} |`
            }
        }
        return html
    }


    innerHTML = () => {
        let innerHTML = `<div style="position: relative; background-repeat: no-repeat; background-size: contain; background-position: center; width: 21cm;
        padding:4cm; height: 29.7cm; margin: 0 auto; overflow:hidden; margin-bottom: 0.5cm; background-image: ${sheetImage.sheet};">`
        this.setState({ innerHTML }, () => {
            this.createPDF()
        })
    }


    createPDF = async () => {
        let html = this.state.innerHTML;
        if (this.state.character.background && this.state.character.modifiers && this.state.character.characterClassId && this.state.character.characterClassId.savingThrows) {
            html = html + `<p style="font-size: 25px; position: absolute; left: 130px; top: 87px;">${this.state.character.name}</p>
                    <p style="font-size: 22px; position: absolute; left: 500px; top: 68px;">${this.state.character.characterClass} ${this.state.character.level}</p>
                    <p style="font-size: 22px; position: absolute; left: 690px; top: 68px;">${this.state.character.background.backgroundName}</p>
                    <p style="font-size: 22px; position: absolute; left: 500px; top: 118px;">${this.state.character.race}</p>
                    
    
    
                    
                    ${this.state.character.strength && this.state.character.strength >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 320px;">${this.state.character.strength}</p>` : `<p style="font-size: 22px; position: absolute; left: 320px; top: 315px;">${this.state.character.strength}</p>`}
                    ${this.state.character.modifiers.strength && this.state.character.modifiers.strength >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 265px;">${this.state.character.modifiers.strength}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 265px;">${this.state.character.modifiers.strength}</p>`}
    
                    ${this.state.character.dexterity && this.state.character.dexterity >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 453px;">${this.state.character.dexterity}</p>` : `<p style="font-size: 22px; position: absolute; left: 132px; top: 453px;">${this.state.character.dexterity}</p>`}
                    ${this.state.character.modifiers.dexterity && this.state.character.modifiers.dexterity >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 395px;">${this.state.character.modifiers.dexterity}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 395px;">${this.state.character.modifiers.dexterity}</p>`}
                    
                    ${this.state.character.constitution && this.state.character.constitution >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 585px;">${this.state.character.constitution}</p>` : `<p style="font-size: 22px; position: absolute; left: 132px; top: 585px;">${this.state.character.constitution}</p>`}
                    ${this.state.character.modifiers.constitution && this.state.character.modifiers.constitution >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 525px;">${this.state.character.modifiers.constitution}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 525px;">${this.state.character.modifiers.constitution}</p>`}
                   
                    ${this.state.character.intelligence && this.state.character.intelligence >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 717px;">${this.state.character.intelligence}</p>` : `<p style="font-size: 22px; position: absolute; left: 132px; top: 717px;">${this.state.character.intelligence}</p>`}
                    ${this.state.character.modifiers.intelligence && this.state.character.modifiers.intelligence >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 655px;">${this.state.character.modifiers.intelligence}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 655px;">${this.state.character.modifiers.intelligence}</p>`}
                    
                    ${this.state.character.wisdom && this.state.character.wisdom >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 851px;">${this.state.character.wisdom}</p>` : `<p style="font-size: 22px; position: absolute; left: 132px; top: 851px;">${this.state.character.wisdom}</p>`}
                    ${this.state.character.modifiers.wisdom && this.state.character.modifiers.wisdom >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 792px;">${this.state.character.modifiers.wisdom}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 792px;">${this.state.character.modifiers.wisdom}</p>`}
                    
                    ${this.state.character.charisma && this.state.character.charisma >= 10 ? `<p style="font-size: 22px; position: absolute; left: 125px; top: 982px;">${this.state.character.charisma}</p>` : `<p style="font-size: 22px; position: absolute; left: 132px; top: 982px;">${this.state.character.charisma}</p>`}
                    ${this.state.character.modifiers.charisma && this.state.character.modifiers.charisma >= 10 ? `<p style="font-size: 30px; position: absolute; left: 120px; top: 925px;">${this.state.character.modifiers.charisma}</p>` : `<p style="font-size: 30px; position: absolute; left: 130px; top: 925px;">${this.state.character.modifiers.charisma}</p>`}
                    
    
                    ${this.state.character.characterClassId.savingThrows.includes("Strength") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 353px;">&#9679 </p> <p style="font-size: 22px; position: absolute; left: 230px; top: 353px;">${this.state.character.modifiers.strength}</p>` : '<p style="display: none;"></p>'}
                    ${this.state.character.characterClassId.savingThrows.includes("Dexterity") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 380px;">&#9679 </p>  <p style="font-size: 22px; position: absolute; left: 230px; top: 378px;">${this.state.character.modifiers.dexterity}</p>` : '<p style="display: none;"></p>'}                      
                    ${this.state.character.characterClassId.savingThrows.includes("Constitution") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 403px;"">&#9679 </p>  <p style="font-size: 22px; position: absolute; left: 230px; top: 402px;">${this.state.character.modifiers.constitution}</p>` : '<p style="display: none;"></p>'}               
                    ${this.state.character.characterClassId.savingThrows.includes("Intelligence") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 429px;">&#9679 </p> <p style="font-size: 22px; position: absolute; left: 230px; top: 427px;">${this.state.character.modifiers.intelligence}</p>` : '<p style="display: none;"></p>'}                             
                    ${this.state.character.characterClassId.savingThrows.includes("Wisdom") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 453px;">&#9679 </p> <p style="font-size: 22px; position: absolute; left: 230px; top: 452px;">${this.state.character.modifiers.wisdom}</p>` : '<p style="display: none;"></p>'}                        
                    ${this.state.character.characterClassId.savingThrows.includes("Charisma") ? `<p style="font-size: 22px;font-weight: 800; position: absolute; left: 210px; top: 480px;">&#9679 </p> <p style="font-size: 22px; position: absolute; left: 230px; top: 476px;">${this.state.character.modifiers.charisma}</p>` : '<p style="display: none;"></p>'}
                    
                    ${this.createSkillList()}
                    ${this.getFeaturesAndTraits()}
                    ${this.getPersonalAttributes("personalityTraits")}
                    ${this.getPersonalAttributes("ideals")}
                    ${this.getPersonalAttributes("bonds")}
                    ${this.getPersonalAttributes("flaws")}

                    
                    <p style="font-size: 15px; position: absolute; left: 485px; top: 1080px; max-width: 200px; word-break: break-all; 
                    display: -webkit-box;
                    line-height: 19px;
                    -webkit-line-clamp: 16;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;">${this.getItems()}</p>
                    
                    <p style="font-size: 25px; position: absolute; left: 420px; top: 1085px; max-width: 280px; word-break: break-all;">${this.state.character.currency?.copper}</p>
                    <p style="font-size: 25px; position: absolute; left: 420px; top: 1132px; max-width: 280px; word-break: break-all;">${this.state.character.currency?.silver}</p>
                    <p style="font-size: 25px; position: absolute; left: 420px; top: 1228px; max-width: 280px; word-break: break-all;">${this.state.character.currency?.gold}</p>

                    ${this.state.character.currentWeapon?._id ?
                    `<p style="font-size: 25px; position: absolute; left: 415px; top: 700px;">${this.state.character.currentWeapon.name}</p>
                        <p style="font-size: 25px; position: absolute; left: 590px; top: 700px;">${this.state.character.currentWeapon.diceAmount} ${this.state.character.currentWeapon.dice}</p>
                        ` : '<p style="display: none;"></p>'}
                    <p style="font-size: 30px; position: absolute; left: 215px; top: 278px;">${this.props.route.params.proficiency}</p>
                    <p style="font-size: 30px; position: absolute; left: 435px; top: 235px;">${this.state.character.equippedArmor && this.state.character.equippedArmor.ac}</p>
                    <p style="font-size: 30px; position: absolute; left: 538px; top: 235px;">${this.state.character.modifiers.dexterity}</p>
                    <p style="font-size: 30px; position: absolute; left: 625px; top: 235px;">${this.state.character.raceId && this.state.character.raceId.raceAbilities && this.state.character.raceId.raceAbilities.speed}</p>
                    <p style="font-size: 25px; position: absolute; left: 525px; top: 330px;">${this.state.character.maxHp}</p>
                    <p style="font-size: 30px; position: absolute; left: 448px; top: 580px;">${`D${hitDiceSwitch(this.state.character.characterClass)}`}</p>
                </div>
                `;
        }
        const { uri } = await Print.printToFileAsync({ html });
        this.setState({ uri }, () => {
            this.setState({ loading: false })
        })
    };

    share = (uri: any) => {
        Sharing.shareAsync(uri).then(() => {
            this.setState({ loading: false })
        });
    }





    render() {
        return (
            <View style={styles.container}>
                <AppText textAlign={'center'} fontSize={20}> Generate a new PDF character sheet. </AppText>
                <AppText padding={5} textAlign={'center'}>Generate a new PDF document based on your current character stats.</AppText>
                <View style={styles.container}>
                    <Image
                        source={require('../../assets/pdfDragon.png')}
                        style={{ width: 150, height: 150 }}
                    />
                    <AppText padding={15}>Press below to generate your pdf.</AppText>
                    <AppText padding={15} textAlign={'center'}>This might take some time, please be patient.</AppText>
                    {this.state.loading ?
                        <AppActivityIndicator visible={this.state.loading} />
                        :
                        <TouchableOpacity onPress={() => { this.share(this.state.uri) }}>
                            <View>
                                <Image
                                    source={require('../../assets/pdf.png')}
                                    style={styles.imageStyle}
                                />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 50,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 20,
    },
    textStyle: {
        fontSize: 18,
        padding: 10,
        color: 'black',
        textAlign: 'center',
    },
    imageStyle: {
        width: 75,
        height: 75,
        margin: 5,
        resizeMode: 'stretch',
    },
});