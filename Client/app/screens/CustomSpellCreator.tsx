import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { AppText } from '../components/AppText';
import { CharacterModel } from '../models/characterModel';
import * as Yup from 'yup';
import { AppForm } from '../components/forms/AppForm';
import { AppFormField } from '../components/forms/AppFormField';
import { CustomSpellModal } from '../models/CustomSpellModal';
import { Colors } from '../config/colors';
import { SubmitButton } from '../components/forms/SubmitButton';
import AsyncStorage from '@react-native-community/async-storage';
import logger from '../../utility/logger';

const ValidationSchema = Yup.object().shape({
    casting_time: Yup.string().required().label("Casting time"),
    materials_needed: Yup.string(),
    description: Yup.string().required().label("Spell Description"),
    duration: Yup.string().required().label("Spell Duration"),
    name: Yup.string().required().label("Name"),
    range: Yup.string().required().label("Range"),
    higher_levels: Yup.string().label("Higher Levels"),

})

interface CustomSpellCreatorState {
    character: CharacterModel
    oldSpellValues: CustomSpellModal
    classPicked: string[]
    classClicked: boolean[]
    isEdit: any
    pickedLevel: string
    levelClicked: boolean[]
    pickedSchool: string,
    schoolClicked: boolean[]
}

const classes = ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];
const levels = ["cantrip", "1st-level", "2nd-level", "3rd-level", "4th-level", "5th-level", "6th-level", "7th-level", "8th-level", "9th-level"];
const magicSchools = ["Conjuration", "Necromancy", "Evocation", "Abjuration", "Transmutation", "Divination", "Enchantment", "Illusion"]
export class CustomSpellCreator extends Component<{ route: any, navigation: any }, CustomSpellCreatorState> {
    constructor(props: any) {
        super(props)
        this.state = {
            pickedSchool: '',
            schoolClicked: [],
            isEdit: this.props.route.params.edit,
            character: this.props.route.params.character,
            oldSpellValues: new CustomSpellModal(),
            classPicked: [],
            classClicked: [],
            pickedLevel: '',
            levelClicked: []
        }
    }

    componentDidMount() {
        try {
            if (this.state.isEdit?.true) {
                let oldSpellValues = { ...this.state.oldSpellValues }
                let classPicked = this.state.classPicked;
                let classClicked = this.state.classClicked;
                oldSpellValues = this.state.isEdit.spell;
                classPicked = this.state.isEdit.spell.classes;
                classes.forEach((charClass: string, index: number) => {
                    if (classPicked.includes(charClass)) {
                        classClicked[index] = true
                    }
                })

                let pickedSchool = '';
                let schoolClicked = this.state.schoolClicked;
                pickedSchool = this.state.isEdit.spell.school;
                magicSchools.forEach((spellSchool: string, index: number) => {
                    if (pickedSchool === spellSchool) {
                        schoolClicked[index] = true
                    }
                })

                let pickedLevel = '';
                let levelClicked = this.state.levelClicked;
                levels.forEach((level: string, index: number) => {
                    if (this.state.isEdit.spell.level === level.charAt(0)) {
                        pickedLevel = level
                        levelClicked[index] = true
                    }
                })

                this.setState({ oldSpellValues, classClicked, classPicked, schoolClicked, pickedSchool, levelClicked, pickedLevel })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickLevel = (level: string, index: number) => {
        try {
            let levelClicked = this.state.levelClicked;
            levelClicked = [];
            levelClicked[index] = true;
            this.setState({ pickedLevel: level, levelClicked })
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    pickMagicSchool = (school: string, index: number) => {
        try {
            let schoolClicked = this.state.schoolClicked;
            schoolClicked = [];
            schoolClicked[index] = true;
            this.setState({ pickedSchool: school, schoolClicked })
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickClass = (newClass: string, index: number) => {
        try {
            if (!this.state.classClicked[index]) {
                const classPicked = this.state.classPicked;
                const classClicked = this.state.classClicked;
                classClicked[index] = true;
                classPicked.push(newClass)
                this.setState({ classClicked, classPicked });
            }
            else if (this.state.classClicked[index]) {
                const oldClassPicked = this.state.classPicked;
                const classClicked = this.state.classClicked;
                classClicked[index] = false;
                const classPicked = oldClassPicked.filter(item => item[0] !== newClass);
                this.setState({ classClicked, classPicked });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    createSpell = async (values: any) => {
        try {
            if (this.state.classPicked.length === 0) {
                alert('Must pick at least one class to use the spell');
                return
            }
            if (this.state.schoolClicked.length === 0) {
                alert('Must pick a magic school');
                return
            }
            const spellType = `${this.state.pickedLevel} ${this.state.pickedSchool}`
            const spellLevel = this.state.pickedLevel.charAt(0);
            const customSpell: CustomSpellModal = {
                _id: `${Math.floor((Math.random() * 1000000) + 1)}`,
                type: spellType,
                school: this.state.pickedSchool,
                casting_time: values.casting_time,
                materials_needed: values.materials_needed,
                duration: values.duration,
                range: values.range,
                higher_levels: values.higher_levels,
                description: values.description,
                name: values.name,
                classes: this.state.classPicked,
                level: spellLevel
            }
            const stringedCustomSpells = await AsyncStorage.getItem('customSpellList');
            if (!stringedCustomSpells) {
                await AsyncStorage.setItem('customSpellList', JSON.stringify([customSpell]))
                return;
            }
            const customSpellsList = JSON.parse(stringedCustomSpells);
            customSpellsList.push(customSpell);
            await AsyncStorage.setItem('customSpellList', JSON.stringify(customSpellsList)).then(async () => {
                this.props.navigation.navigate('CustomSpellList');
            })
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    editSpell = async (values: any, _id: string) => {
        try {
            const spellType = `${this.state.pickedLevel} ${this.state.pickedSchool}`
            const spellLevel = this.state.pickedLevel.charAt(0);
            const newSpell: CustomSpellModal = {
                type: spellType,
                school: this.state.pickedSchool,
                casting_time: values.casting_time,
                materials_needed: values.materials_needed,
                duration: values.duration,
                range: values.range,
                description: values.description,
                higher_levels: values.higher_levels,
                name: values.name,
                classes: this.state.classPicked,
                level: spellLevel
            }
            const customSpellString = await AsyncStorage.getItem('customSpellList');
            if (customSpellString) {
                const customSpellList = JSON.parse(customSpellString);
                const newCustomSpellList = customSpellList.map((spell: CustomSpellModal) => {
                    if (spell._id === _id) {
                        spell = newSpell
                    }
                    return spell
                });
                await AsyncStorage.setItem('customSpellList', JSON.stringify(newCustomSpellList)).then(() => {
                    this.props.navigation.navigate('CustomSpellList');
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }



    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.isEdit?.true ?
                    <View>
                        <AppText textAlign={'center'} fontSize={22} color={Colors.burgundy}>Spell Editor</AppText>
                    </View>
                    :
                    <View style={{ padding: 15 }}>
                        <AppText textAlign={'center'} fontSize={22} color={Colors.burgundy}>Create a new Spell!</AppText>
                        <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>During your adventures your character might come across spacial magic that is relevant only for your current adventure.</AppText>
                        <AppText textAlign={'center'} fontSize={18} color={Colors.berries}>Using this spell creator you can create new spells that will be added to your spell book.</AppText>
                        <AppText textAlign={'center'} fontSize={18} color={Colors.burgundy}>Once a spell has been added all of your characters will have access to said spell from the spell book.</AppText>
                    </View>
                }
                <AppForm
                    initialValues={{
                        casting_time: this.state.isEdit.true ? this.state.isEdit.spell.casting_time : ''
                        , materials_needed: this.state.isEdit.true ? this.state.isEdit.spell.materials_needed : ''
                        , description: this.state.isEdit.true ? this.state.isEdit.spell.description : ''
                        , duration: this.state.isEdit.true ? this.state.isEdit.spell.duration : ''
                        , name: this.state.isEdit.true ? this.state.isEdit.spell.name : ''
                        , range: this.state.isEdit.true ? this.state.isEdit.spell.range : ''
                    }}
                    onSubmit={(values: any) => this.state.isEdit.true ? this.editSpell(values, this.state.isEdit.spell._id) : this.createSpell(values)}
                    validationSchema={ValidationSchema}>
                    <View style={{ marginBottom: 40, justifyContent: "center", alignItems: "center" }}>
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.name : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.name = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            fieldName={"name"}
                            iconName={"text-short"}
                            placeholder={"Spell Name..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.description : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.description = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            numberOfLines={7} multiline={true} textAlignVertical={"top"}
                            fieldName={"description"}
                            iconName={"text-short"}
                            placeholder={"Spell Description..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.materials_needed : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.materials_needed = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            fieldName={"materials_needed"}
                            iconName={"text-short"}
                            placeholder={"Material requirements..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.duration : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.duration = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}

                            fieldName={"duration"}
                            iconName={"text-short"}
                            placeholder={"Spell Duration..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.range : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.range = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}

                            fieldName={"range"}
                            iconName={"text-short"}
                            placeholder={"Spell Range..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.casting_time : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.casting_time = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            fieldName={"casting_time"}
                            iconName={"text-short"}
                            placeholder={"Casting Time..."} />
                        <AppFormField
                            value={this.state.isEdit.true ? this.state.oldSpellValues.higher_levels : null}
                            onChange={(e: any = {}) => {
                                const oldSpellValues = { ...this.state.oldSpellValues };
                                oldSpellValues.higher_levels = e.nativeEvent.text
                                this.setState({ oldSpellValues })
                            }}
                            numberOfLines={7} multiline={true} textAlignVertical={"top"}
                            width={Dimensions.get('screen').width / 1.4}
                            internalWidth={Dimensions.get('screen').width / 0.9}
                            fieldName={"higher_levels"}
                            iconName={"text-short"}
                            placeholder={"At Higher Levels...(optional)"} />
                    </View>
                    <View>
                        <AppText textAlign={'center'} fontSize={20}>Pick classes that can use this spell:</AppText>
                        <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                            {classes.map((item: any, index: any) => <TouchableOpacity key={index} onPress={() => this.pickClass(item, index)}
                                style={[styles.item, { backgroundColor: this.state.classClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <AppText textAlign={'center'}>{item}</AppText>
                            </TouchableOpacity>)}
                        </View>
                    </View>
                    <View>
                        <AppText textAlign={'center'} fontSize={20}>Pick spell level:</AppText>
                        <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                            {levels.map((item: any, index: any) => <TouchableOpacity key={index} onPress={() => this.pickLevel(item, index)}
                                style={[styles.item, { backgroundColor: this.state.levelClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <AppText textAlign={'center'}>{item}</AppText>
                            </TouchableOpacity>)}
                        </View>
                    </View>
                    <View>
                        <AppText textAlign={'center'} fontSize={20}>Pick Magic School:</AppText>
                        <View style={{ flexDirection: 'row', flexWrap: "wrap" }}>
                            {magicSchools.map((item: any, index: any) => <TouchableOpacity key={index} onPress={() => this.pickMagicSchool(item, index)}
                                style={[styles.item, { backgroundColor: this.state.schoolClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                <AppText textAlign={'center'}>{item}</AppText>
                            </TouchableOpacity>)}
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                        <SubmitButton textAlign={'center'} title={this.state.isEdit?.true ? "Edit Spell" : "Create Spell"} marginBottom={1} />
                    </View>
                </AppForm>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    item: {
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