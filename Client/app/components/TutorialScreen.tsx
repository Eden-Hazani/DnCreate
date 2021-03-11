import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { boolean } from 'yup';
import { Colors } from '../config/colors';
import { AppText } from './AppText';
import { IconGen } from './IconGen';
const { width, height } = Dimensions.get('window')
interface TutorialScreenState {
    tutorialStage: boolean[]
}
export class TutorialScreen extends Component<{ zIndex: any, pageHeight: any, changeScrollPosition: any, end: any }, TutorialScreenState>{
    constructor(props: any) {
        super(props)
        this.state = {
            tutorialStage: [true]
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.zIndex(0)
            this.props.changeScrollPosition({ x: 0, y: 10 })
        }, 200);
    }
    moveStage = (index: number, XY: { x: number, y: number }) => {
        const tutorialStage = [...this.state.tutorialStage];
        tutorialStage[index] = false
        tutorialStage[index + 1] = true
        this.props.zIndex(index + 1)
        this.props.changeScrollPosition({ x: XY.x, y: XY.y })
        this.setState({ tutorialStage: tutorialStage })
    }

    percentage = (num: number, per: number) => {
        const POV = Dimensions.get('window').scale
        if (POV >= 2.7 && this.state.tutorialStage.length > 4) {
            num = num - 30
        }
        return (num / 100) * per;
    }

    render() {
        return (
            <View style={[styles.container, { height: this.percentage(700, this.props.pageHeight) }]}>
                {this.state.tutorialStage[0] &&
                    <TouchableOpacity onPress={() => this.moveStage(0, { x: 0, y: this.percentage(30, this.props.pageHeight) })}
                        style={{ width: '100%', flexDirection: 'row', top: this.percentage(5, this.props.pageHeight), left: 10 }}>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Main attributes and experience bar.</AppText>
                            <AppText fontSize={15} color={'white'}>Here you have access to your characters main attributes</AppText>
                            <AppText fontSize={15} color={'white'}>You can level up or down by short pressing or long pressing on the level circle respectively</AppText>
                            <AppText fontSize={15} color={'white'}>DnCreate auto rolls your max health points for you but if you wish to input for yourself just tap the max hp circle</AppText>
                            <AppText fontSize={15} color={'white'}>Below is the XP button to extend your experience bar, if you wish to level up by experience points just enter your current points in the field below the bar and hit update xp</AppText>
                        </View>
                        <View style={{ alignSelf: "center", bottom: 70 }}>
                            <IconGen name={'chevron-right'} size={70} iconColor={"white"} />
                        </View>
                    </TouchableOpacity>}
                {this.state.tutorialStage[1] &&
                    <TouchableOpacity onPress={() => this.moveStage(1, { x: 0, y: this.percentage(120, this.props.pageHeight) })}
                        style={{ width: '100%', flexDirection: 'row', top: this.percentage(30, this.props.pageHeight), left: 10 }}>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Information Circles.</AppText>
                            <AppText fontSize={15} color={'white'}>- Here you have access most of your characters information</AppText>
                            <AppText fontSize={15} color={'white'}>- Background story provides you with your picked background and your written story (can be updated any time)</AppText>
                            <AppText fontSize={15} color={'white'}>- Use items and currency to manage your items and currency with responsive lists and buttons</AppText>
                            <AppText fontSize={15} color={'white'}>- The Spell book contains most of the spells available to everyone, use the filters to navigate through the many spells and add your picked spells to your character</AppText>
                            <AppText fontSize={15} color={'white'}>- Use the armor and weapons circles to manage your fighting equipment, equip or unequip your sets or armor and weapons</AppText>
                            <AppText fontSize={15} color={'white'}>- The wearable equipment circle allows you to create magical items that your character can equip on itself</AppText>
                        </View>
                        <View style={{ alignSelf: "center", bottom: 70 }}>
                            <IconGen name={'chevron-right'} size={70} iconColor={"white"} />
                        </View>
                    </TouchableOpacity>}
                {this.state.tutorialStage[2] &&
                    <TouchableOpacity
                        onPress={() => this.moveStage(2, { x: 0, y: this.percentage(200, this.props.pageHeight) })}
                        style={{ width: '100%', flexDirection: 'row', top: this.percentage(170, this.props.pageHeight), left: 90 }}>
                        <View style={{ alignSelf: "center", bottom: 70 }}>
                            <IconGen name={'chevron-left'} size={70} iconColor={"white"} />
                        </View>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Unique Stats.</AppText>
                            <AppText fontSize={15} color={'white'}>Here you have access to your unique class and subclass stats</AppText>
                            <AppText fontSize={15} color={'white'}>Counters like rage inspiration die and lay on hands will appear here, along wih mny other unique stats</AppText>
                            <AppText fontSize={15} color={'white'}>Your equipment slots will be filled as you gather and equip new wearable items and weapons.</AppText>
                        </View>
                    </TouchableOpacity>}
                {this.state.tutorialStage[3] &&
                    <TouchableOpacity onPress={() => this.moveStage(3, { x: 0, y: this.percentage(300, this.props.pageHeight) })}
                        style={{ width: '100%', flexDirection: 'row', top: this.percentage(220, this.props.pageHeight), left: 10 }}>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Saving Throws and dice info</AppText>
                            <AppText fontSize={15} color={'white'}>Here you have access all of your characters proficiency information</AppText>
                            <AppText fontSize={15} color={'white'}>Press on any skill and DnCreate will roll a d20 + skill related bonuses for you!</AppText>
                            <AppText fontSize={15} color={'white'}>Your main hit die is positioned to the right of the screen together with all the information required for combat</AppText>
                            <AppText fontSize={15} color={'white'}>If you have a hard time understanding the mechanics of hit/damage dice press the "issues with bonuses" button</AppText>
                        </View>
                        <View style={{ alignSelf: "center", bottom: 70 }}>
                            <IconGen name={'chevron-right'} size={70} iconColor={"white"} />
                        </View>
                    </TouchableOpacity>}

                {this.state.tutorialStage[4] &&
                    <TouchableOpacity onPress={() => this.moveStage(4, { x: 0, y: this.percentage(400, this.props.pageHeight) })}
                        style={{ width: '100%', height: 150, flexDirection: 'row', top: this.percentage(400, this.props.pageHeight), left: 80 }}>
                        <View style={{ alignSelf: "baseline", bottom: 70 }}>
                            <IconGen name={'chevron-left'} size={70} iconColor={"white"} />
                        </View>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Languages and tools</AppText>
                            <AppText fontSize={15} color={'white'}>Your known languages and tools are displayed here</AppText>
                        </View>
                    </TouchableOpacity>}

                {this.state.tutorialStage[5] &&
                    <TouchableOpacity onPress={() => this.moveStage(5, { x: 0, y: this.percentage(430, this.props.pageHeight) })}
                        style={{ flexDirection: 'row', top: this.percentage(450, this.props.pageHeight), left: 80 }}>
                        <View style={{ alignSelf: "baseline", bottom: 70 }}>
                            <IconGen name={'chevron-left'} size={70} iconColor={"white"} />
                        </View>
                        <View style={[styles.item, { borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Personality Traits</AppText>
                            <AppText fontSize={15} color={'white'}>You have can view and change all your different traits by pressing and holding on the wanted trait headline</AppText>
                        </View>
                    </TouchableOpacity>}
                {this.state.tutorialStage[6] &&
                    <TouchableOpacity onPress={() => this.props.end()}
                        style={{ width: '100%', height: 150, top: this.percentage(490, this.props.pageHeight) }}>
                        <View style={[styles.item, { width: width * 0.9, borderColor: Colors.whiteInDarkMode, backgroundColor: Colors.burgundy }]}>
                            <AppText fontSize={22} color={'white'}>Magic</AppText>
                            <AppText fontSize={15} color={'white'}>If you have access to spellcasting abilities you can use the magic section of DnCreate's character sheet to manage your spells and spell slots.</AppText>
                            <AppText fontSize={15} color={'white'}>All of your chosen spells will appear here together with colored spell slot counters and descriptions of your current spell knowledge status</AppText>
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <IconGen name={'chevron-down'} size={70} iconColor={"white"} />
                        </View>
                    </TouchableOpacity>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 25,
        position: 'absolute',
    }, item: {
        zIndex: 25,
        justifyContent: "flex-start", alignItems: "flex-start",
        width: 170, padding: 10,
        borderWidth: 1,
        borderRadius: 15
    }
});