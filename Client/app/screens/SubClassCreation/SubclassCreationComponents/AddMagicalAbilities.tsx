import React, { Component } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { toHsv } from 'react-native-color-picker';
import { AppActivityIndicator } from '../../../components/AppActivityIndicator';
import { AppButton } from '../../../components/AppButton';
import { AppText } from '../../../components/AppText';
import { IconGen } from '../../../components/IconGen';
import NumberScroll from '../../../components/NumberScroll';
import { Colors } from '../../../config/colors';
import { MagicModel } from '../../../models/magicModel';
import { spellLevelChanger } from '../../charOptions/helperFunctions/SpellLevelChanger';
import { OtherNotes } from '../../charOptions/personalNoteTypes/OtherNotes';

interface AddMagicalAbilitiesState {
    levelSpells: any[]
    pickClass: boolean,
    loading: boolean,
    pickedLevel: number
    selectedSpellLevel: boolean[]
    currentlyEditedSpells: any[]
    levelArray: any[]
    charMagicBeforeChanges: any[]
    pickedClass: string
    pickedClassBeforeChange: string
    pageLoad: boolean
}

const magicalClassList: string[] = ["Bard", "Cleric", "Druid", "Paladin", "Sorcerer", "Warlock", "Wizard"]

export class AddMagicalAbilities extends Component<{ pickedMagicClass: string, startingLevel: number, charMagic: any, closeModal: any }, AddMagicalAbilitiesState>{
    constructor(props: any) {
        super(props)
        this.state = {
            pageLoad: true,
            pickedClass: this.props.pickedMagicClass || '',
            pickedClassBeforeChange: JSON.parse(JSON.stringify(this.props.pickedMagicClass || '')),
            levelSpells: [],
            pickClass: false,
            loading: true,
            pickedLevel: 0,
            selectedSpellLevel: [],
            currentlyEditedSpells: [],
            charMagicBeforeChanges: JSON.parse(JSON.stringify(this.props.charMagic)),
            levelArray: this.props.charMagic,
        }
    }
    componentDidMount() {
        const levelSpells: number[] = []
        if (this.state.levelArray.length === 0) {
            const levelArray = this.state.levelArray;
            for (let i = 0; i <= 20 - this.props.startingLevel; i++) {
                levelSpells.push(i)
                levelArray.push(
                    {
                        cantrips: 0,
                        spells: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        spellsKnown: 0
                    }
                )
            }
            this.setState({ levelArray, levelSpells }, () => this.setState({ pageLoad: false }))
            return
        }
        const levelArray = [...this.state.levelArray]
        for (let item of levelArray) {
            item.spells.unshift(item.cantrips);
            item.cantrips = 0;
        }
        for (let j = 0; j <= 20 - this.props.startingLevel; j++) {
            levelSpells.push(j)
        }
        this.setState({ levelSpells, levelArray }, () => this.setState({ pageLoad: false }))
    }




    selectSpellLevel = (level: number) => {
        this.setState({ loading: true })
        let selectedSpellLevel = [...this.state.selectedSpellLevel];
        selectedSpellLevel = [];
        selectedSpellLevel[level] = true
        this.setState({ selectedSpellLevel, pickedLevel: level + this.props.startingLevel, currentlyEditedSpells: this.state.levelArray[level].spells }, () => {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 400);
        })
    }


    copySpellsLevelDown = (index: number) => {
        const levelArray = [...this.state.levelArray];
        if (index === levelArray.length - 1) {
            return;
        }
        const copyObj = { ...levelArray[index] }
        const pasteObj = { ...levelArray[index + 1] }
        pasteObj.spells = [...copyObj.spells];
        pasteObj.spellsKnown = copyObj.spellsKnown
        levelArray[index + 1] = pasteObj
        this.setState({ levelArray })
    }


    approveChoices = () => {
        let index = 0;
        for (let item of this.state.levelArray) {
            if (index + 1 < this.state.levelArray.length) {
                if (item.spellsKnown > this.state.levelArray[index + 1].spellsKnown) {
                    alert("All known spells must be in ascending order.");
                    return
                }
                let innerIndex = 0;
                for (let spell of item.spells) {
                    if (spell > this.state.levelArray[index + 1].spells[innerIndex]) {
                        alert("All spell slot levels must be in ascending order.");
                        return
                    }
                    innerIndex++
                }
            }
            index++
        }
        if (this.state.pickedClass === '') {
            alert("Must pick a base magic class");
            return;
        }
        const levelArray = [...this.state.levelArray]
        for (let item of levelArray) {
            item.cantrips = item.spells[0]
            item.spells.shift();
        }
        this.props.closeModal({ charMagic: levelArray, spellCastingClass: this.state.pickedClass })
    }

    render() {
        return (
            <View style={[styles.container, { flex: 1, backgroundColor: Colors.pageBackground }]}>
                {this.state.pageLoad ? <AppActivityIndicator visible={this.state.pageLoad} /> :
                    <View style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
                        {(this.state.pickedLevel !== 0 && this.state.levelArray[this.state.pickedLevel - this.props.startingLevel]) ?
                            <View style={{ flex: 1.5, justifyContent: "space-evenly", alignItems: "center", flexDirection: 'row' }}>
                                <View
                                    style={{
                                        justifyContent: "center", alignItems: "center",
                                        maxHeight: 90, maxWidth: 70,
                                        borderColor: Colors.whiteInDarkMode, borderWidth: 1,
                                        borderRadius: 15, padding: 1, margin: 4
                                    }}>
                                    <AppText fontSize={12} textAlign={'center'}>spells known</AppText>
                                    {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                                        <NumberScroll startFromZero={true} modelColor={Colors.pageBackground} max={20}
                                            startingVal={this.state.levelArray[this.state.pickedLevel - this.props.startingLevel].spellsKnown || 0}
                                            pauseStart={true}
                                            getValue={(slotAmount: number) => {
                                                const levelArray = [...this.state.levelArray];
                                                const obj = { ...levelArray[this.state.pickedLevel - this.props.startingLevel] }
                                                obj.spellsKnown = slotAmount;
                                                levelArray[this.state.pickedLevel - this.props.startingLevel] = obj
                                                this.setState({ levelArray })
                                            }}
                                        />
                                    }
                                </View>
                                <View>
                                    <AppText textAlign={'center'} fontSize={22}>Picked Level {this.state.pickedLevel}</AppText>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "space-evenly", width: 250 }}>
                                        {this.state.currentlyEditedSpells.map((item: any, index: number) => <View key={index}>
                                            <AppText textAlign={'center'}>Spell Level {index === 0 ? 'cantrips' : index}</AppText>
                                            <View style={{
                                                borderColor: Colors.whiteInDarkMode, justifyContent: "center", alignItems: "center",
                                                width: 110, borderWidth: 1, borderRadius: 15, height: 50
                                            }}>
                                                {this.state.loading ? <AppActivityIndicator visible={this.state.loading} /> :
                                                    <NumberScroll startFromZero={true} modelColor={Colors.pageBackground} max={20}
                                                        startingVal={item || 0}
                                                        pauseStart={true}
                                                        getValue={(slotAmount: number) => {
                                                            if (slotAmount === undefined) {
                                                                return
                                                            }
                                                            const levelArray = [...this.state.levelArray];
                                                            const obj = { ...levelArray[this.state.pickedLevel - this.props.startingLevel] }
                                                            obj.spells[index] = slotAmount;
                                                            levelArray[this.state.pickedLevel - this.props.startingLevel] = obj
                                                            this.setState({ levelArray })
                                                        }}
                                                    />
                                                }
                                            </View>
                                        </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                            :
                            this.state.pickClass ?
                                <View style={{ flex: 1.5, justifyContent: "space-between", alignItems: "center", flexDirection: 'row', flexWrap: 'wrap' }}>
                                    {magicalClassList.map((item, index) => <TouchableOpacity
                                        onPress={() => this.setState({ pickedClass: item, pickClass: false })}
                                        style={{
                                            borderRadius: 15, margin: 5, width: 80, height: 50, alignItems: "center", justifyContent: "center",
                                            backgroundColor: this.state.pickedClass === item ? Colors.bitterSweetRed : Colors.lightGray
                                        }} key={index}>
                                        <AppText textAlign={'center'}>{item}</AppText>
                                    </TouchableOpacity>)}
                                </View> :
                                <View style={{ flex: 1.5, justifyContent: "center", alignItems: "center" }}>
                                    <AppText padding={10} fontSize={16} textAlign={'center'}>Press on one of the levels to start picking the spell slot amount</AppText>
                                    <AppText padding={10} fontSize={16} textAlign={'center'}>You have the option to copy the spell slot amount using the "copy spells" button to the right of the spell slot list.</AppText>
                                    <AppText padding={10} fontSize={16} textAlign={'center'}>Remember that as a Wizard, Cleric, Paladin, or Druid Your known spells are the spells you have prepared for the day and can be replaced every long rest (the amount of spells the character is able to learn is based on the characters current level and one on its ability modifiers)</AppText>
                                    <AppText padding={10} fontSize={16} textAlign={'center'}>with The rest of the classes your known spells are the spells that your character has learned throughout its journey, and the known spells your enter here provides a cap for the characters ability to learn new spells.</AppText>

                                </View>}


                        <ScrollView style={{ flex: .3 }}>
                            <TouchableOpacity onPress={() => this.setState({ pickClass: true, pickedLevel: 0, selectedSpellLevel: [] })}
                                style={[styles.item, { backgroundColor: Colors.earthYellow }]}>
                                <AppText>Pick magic class {this.state.pickedClass !== '' && `- Current class ${this.state.pickedClass}`}</AppText>
                            </TouchableOpacity>
                            {this.state.levelSpells.map((item, index) => <View key={index} style={{ flexDirection: "row", flex: 1 }}>
                                <View style={{
                                    flex: .2, justifyContent: "center", alignItems: "center", borderColor: Colors.whiteInDarkMode, borderWidth: 1,
                                    borderRadius: 15, padding: 1, margin: 4
                                }}>
                                    <AppText textAlign={'center'} fontSize={13}>Spells Known</AppText>
                                    {this.state.levelArray[index] && this.state.levelArray[index].spellsKnown ? <AppText>{this.state.levelArray[index].spellsKnown}</AppText> : null}
                                </View>
                                <TouchableOpacity onPress={() => this.selectSpellLevel(index)}
                                    style={[{ flex: .8, backgroundColor: this.state.selectedSpellLevel[item] ? Colors.bitterSweetRed : Colors.paleGreen }, styles.item]}>
                                    <AppText textAlign={'center'}>Level {item + this.props.startingLevel} spell slots</AppText>
                                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                        {(this.state.levelArray[index]) &&
                                            this.state.levelArray[index].spells.map((item: string, index: number) => <View key={index}>
                                                <AppText>{item}</AppText>
                                            </View>)
                                        }
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.copySpellsLevelDown(index)}
                                    style={{
                                        flex: .2, justifyContent: "center", alignItems: "center", borderColor: Colors.whiteInDarkMode, borderWidth: 1,
                                        borderRadius: 15, padding: 1, margin: 4
                                    }}>
                                    <AppText fontSize={12} textAlign={'center'}>Copy{'\n'}spells</AppText>
                                    <IconGen name={'chevron-down'} size={40} iconColor={Colors.whiteInDarkMode} />
                                </TouchableOpacity>
                            </View>
                            )
                            }

                        </ScrollView>



                        <View style={{ flex: .1, flexDirection: 'row', justifyContent: "space-evenly", paddingBottom: 15 }}>
                            <AppButton fontSize={20} title={'Approve'} onPress={() => this.approveChoices()}
                                borderRadius={10}
                                backgroundColor={Colors.bitterSweetRed} width={120} height={45} />
                            <AppButton fontSize={20} title={'Cancel'} onPress={() => {
                                Alert.alert("Cancel?", "All changes will be lost",
                                    [{
                                        text: 'Yes', onPress: () => {
                                            this.setState({ levelArray: this.state.charMagicBeforeChanges }, () => {
                                                this.props.closeModal({ charMagic: this.state.charMagicBeforeChanges })
                                            })
                                        }
                                    }, { text: 'No' }])
                            }}
                                borderRadius={10}
                                backgroundColor={Colors.metallicBlue} width={120} height={45} />
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
        borderRadius: 25,
        padding: 15,
        margin: 10
    }
});