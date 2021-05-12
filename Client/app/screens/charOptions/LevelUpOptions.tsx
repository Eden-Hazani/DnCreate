import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Dimensions, Switch } from 'react-native';
import userCharApi from '../../api/userCharApi';
import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { IconGen } from '../../components/IconGen';
import { Colors } from '../../config/colors';
import { CharacterModel } from '../../models/characterModel';
import { ActionType } from '../../redux/action-type';
import { store } from '../../redux/store';
import LottieView from 'lottie-react-native';
import { MagicModel } from '../../models/magicModel';
import switchModifier from '../../../utility/abillityModifierSwitch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { filterAlreadyPicked } from './helperFunctions/filterAlreadyPicked';
import { eldritchInvocations } from "../../classFeatures/eldritchInvocations";
import { highLightPicked } from './helperFunctions/highLightPicked';
import { FeatOptions } from './FeatOptions';
import { setTotalKnownSpells } from './helperFunctions/setTotalKnownSpells';
import { PathFeatureOrganizer } from './helperFunctions/PathFeatureOrganizer';
import { AppExtraPathChoicePicker } from '../../components/AppExtraPathChoicePicker';
import * as Path from "../../../jsonDump/paths.json"
import { AppPathAdditionalApply } from './AppPathAdditionalApply';
import { AppActivityIndicator } from '../../components/AppActivityIndicator';
import spellsJSON from '../../../jsonDump/spells.json'
import { spellLevelChanger } from './helperFunctions/SpellLevelChanger';
import { AppChangePathChoiceAtLevelUp } from '../../components/AppChangePathChoiceAtLevelUp';
import { allowedChangingPaths, pathChoiceChangePicker } from '../../classFeatures/pathChoiceChnagePicker';
import { addRacialSpells } from './helperFunctions/addRacialSpells';
import AuthContext from '../../auth/context';
import logger from '../../../utility/logger';
import { RaceModel } from '../../models/raceModel';
import subClassesApi from '../../api/subClassesApi';
import { SubClassList } from './SubClassList';
import { getSpecialSaveThrows } from '../../../utility/getSpecialSaveThrows';
import { AppArtificerInfusionPicker } from '../../components/AppArtificerInfusionPicker';
import { PathingLevelRoute } from './LevelUpRoutes/PathingLevelRoute';
import { AlwaysOnToolProf } from './LevelUpRoutes/AlwaysOnToolProf';
import { LevelUpRageAddition } from './LevelUpRoutes/LevelUpRageAddition';
import { FeatsAndAbilities } from './LevelUpRoutes/FeatsAndAbilities';
import { LevelUpExpertise } from './LevelUpRoutes/LevelUpExpertise';
import { LevelUpMagic } from './LevelUpRoutes/LevelUpMagic';
import { LevelUpFightingStyle } from './LevelUpRoutes/LevelUpFightingStyle';
import { LevelUpMonkArts } from './LevelUpRoutes/LevelUpMonkArts';
import { LevelUpSneakAttackDie } from './LevelUpRoutes/LevelUpSneakAttackDie';


interface LevelUpOptionsState {
    beforeAnyChanges: CharacterModel,
    beforeLevelUp: CharacterModel
    skillsClicked: any[]
    newSkills: any
    newTools: any
    pathClicked: boolean[]
    extraPathChoiceClicked: boolean[]
    pathChosen: any
    character: CharacterModel
    abilityClicked: number[]
    totalAbilityPoints: number
    strength: number
    constitution: number
    dexterity: number
    intelligence: number
    wisdom: number
    charisma: number
    load: boolean
    spellSlots: number[]
    fightingStyle: any[]
    fightingStyleClicked: boolean[]
    pact: any
    pactClicked: boolean[]
    metaMagic: any[]
    metamagicClicked: boolean[]
    totalMetaMagicPoints: number
    invocationsClicked: boolean[]
    invocations: any[]
    totalInvocationPoints: number
    featsWindow: boolean
    abilityWindow: boolean
    weaponProfArray: any[]
    armorProfArray: any[]
    featName: string
    featDescription: string
    extraPathChoice: boolean
    extraPathChoiceValue: any[]
    additionalSkillPicks: number
    additionalToolPicks: boolean
    reloadingSkills: boolean
    maneuversToPick: boolean
    ElementsToPick: boolean
    maneuvers: any
    elements: any
    pathFightingStyle: boolean
    pathPickDruidCircle: boolean
    languageToPick: boolean
    langHolder: string[]
    pathInfoLoading: boolean
    specificSpellToLoad: boolean,
    specificSpell: any
    armorToLoad: any
    newSpellAvailabilityList: string[]
    newPathChoice: any
    customPathFeatureList: any[],
    numberOfChoices: number,
    spellListToLoad: any,
    addSpellAvailabilityByName: string[]
    featSkillList: any[]
    featToolList: any[]
    featSavingThrowList: string[]
    infusions: any
    infusionsToPick: any
    newFirstLevelMagic: { newSpells: any, spellsKnown: string }


    errorList: { isError: boolean, errorDesc: string }[];
}

export class LevelUpOptions extends Component<{ index: number, options: any, character: CharacterModel, close: any, refresh: any }, LevelUpOptionsState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            errorList: [],


            newFirstLevelMagic: { newSpells: null, spellsKnown: '' },
            infusions: this.props.character.charSpecials && this.props.character.charSpecials.artificerInfusions,
            infusionsToPick: false,
            addSpellAvailabilityByName: [],
            armorToLoad: null,
            specificSpell: null,
            specificSpellToLoad: false,
            ElementsToPick: false,
            pathInfoLoading: false,
            langHolder: [],
            languageToPick: false,
            pathPickDruidCircle: false,
            pathFightingStyle: false,
            maneuvers: this.props.character.charSpecials && this.props.character.charSpecials.battleMasterManeuvers,
            elements: this.props.character.charSpecials && this.props.character.charSpecials.monkElementsDisciplines,
            maneuversToPick: false,
            beforeAnyChanges: new CharacterModel,
            reloadingSkills: false,
            additionalToolPicks: false,
            additionalSkillPicks: 0,
            extraPathChoiceValue: [],
            extraPathChoiceClicked: [],
            extraPathChoice: false,
            featName: '',
            featDescription: '',
            weaponProfArray: [],
            armorProfArray: [],
            featsWindow: false,
            abilityWindow: false,
            beforeLevelUp: new CharacterModel,
            metamagicClicked: [],
            metaMagic: [],
            fightingStyleClicked: [],
            pactClicked: [],
            fightingStyle: [],
            pact: null,
            skillsClicked: [],
            newTools: this.props.character.tools && this.props.character.tools,
            newSkills: this.props.character.skills && this.props.character.skills,
            spellSlots: [],
            load: true,
            strength: this.props.character.strength ? this.props.character.strength : 0,
            dexterity: this.props.character.dexterity ? this.props.character.dexterity : 0,
            constitution: this.props.character.constitution ? this.props.character.constitution : 0,
            intelligence: this.props.character.intelligence ? this.props.character.intelligence : 0,
            wisdom: this.props.character.wisdom ? this.props.character.wisdom : 0,
            charisma: this.props.character.charisma ? this.props.character.charisma : 0,
            totalAbilityPoints: 0,
            abilityClicked: [0, 0, 0, 0, 0, 0],
            character: this.props.character,
            pathChosen: null,
            pathClicked: [],
            totalMetaMagicPoints: 0,
            invocationsClicked: [],
            invocations: this.props.character.charSpecials !== undefined && this.props.character.charSpecials.eldritchInvocations ? this.props.character.charSpecials.eldritchInvocations : [],
            totalInvocationPoints: 0,
            newSpellAvailabilityList: [],
            newPathChoice: null,
            customPathFeatureList: [],
            numberOfChoices: 0,
            spellListToLoad: null,
            featSkillList: [],
            featToolList: [],
            featSavingThrowList: []
        }
    }


    async componentDidMount() {
        try {
            const character = { ...this.props.character }
            setTimeout(() => {
                this.setState({ load: false })
            }, 1000);
            let beforeLevelUpString: string = JSON.stringify(character);
            const beforeAnyChanges = JSON.parse(JSON.stringify(this.props.character))

            if (this.state.character.level) {
                const result = await AsyncStorage.getItem(`current${this.state.character._id}level${this.state.character.level - 1}`);
                if (result) {
                    beforeLevelUpString = result;
                }
            }
            if (!character.magic) {
                character.magic = new MagicModel()
            }
            this.setState({ beforeLevelUp: JSON.parse(beforeLevelUpString), beforeAnyChanges, character });

            // if (this.props.options.spells || this.props.options.spellsKnown) {
            // const character = { ...this.props.character };
            // if (this.props.options.spellSlotLevel && character.charSpecials !== undefined) {
            //     character.charSpecials.warlockSpellSlotLevel = this.props.options.spellSlotLevel;
            // }
            // if (this.props.options.spellSlots && character.charSpecials !== undefined) {
            //     character.charSpecials.warlockSpellSlots = this.props.options.spellSlots;
            // }
            // if (this.props.options.sorceryPoints && character.charSpecials !== undefined) {
            //     character.charSpecials.sorceryPoints = this.props.options.sorceryPoints;
            // }
            // if (this.props.options.spellsKnown) {
            //     character.spellsKnown = this.props.options.spellsKnown
            // }
            // if (!this.props.options.spellsKnown) {
            //     const spellsKnown = setTotalKnownSpells(this.props.character);
            //     character.spellsKnown = spellsKnown;
            // }
            // character.magic = new MagicModel();
            // character.magic.cantrips = this.props.options.cantrips;
            // if (this.props.character.characterClass !== 'Warlock') {
            //     character.magic.firstLevelSpells = this.props.options.spells[0];
            //     character.magic.secondLevelSpells = this.props.options.spells[1];
            //     character.magic.thirdLevelSpells = this.props.options.spells[2];
            //     character.magic.forthLevelSpells = this.props.options.spells[3];
            //     character.magic.fifthLevelSpells = this.props.options.spells[4];
            //     character.magic.sixthLevelSpells = this.props.options.spells[5];
            //     character.magic.seventhLevelSpells = this.props.options.spells[6];
            //     character.magic.eighthLevelSpells = this.props.options.spells[7];
            //     character.magic.ninthLevelSpells = this.props.options.spells[8];
            // }
            // const beforeAnyChanges = JSON.parse(JSON.stringify(character))
            // this.setState({ character, beforeAnyChanges }, async () => {
            // if (this.props.character.race !== undefined) {
            //     addRacialSpells(this.props.character.raceId || new RaceModel(), this.state.character).forEach(item => {
            //         const spell = spellsJSON.find(spell => spell.name === item)
            //         if (spell && character.spells !== undefined && character.magic !== undefined && this.state.character.magic !== undefined) {
            //             const spellLevel = spellLevelChanger(spell.level)
            //             character.spells[spellLevel].push({ spell: spell, removable: false });
            //             character.spellsKnown = (parseInt(character.spellsKnown) + 1).toString()
            //             character.magic[spellLevel] = this.state.character.magic[spellLevel] + 1;
            //         }
            //     })
            //     this.setState({ character }, () => {
            //         setTimeout(() => {
            //             this.setAvailableMagicSlots()
            //             store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character });
            //             this.context.user._id === "Offline" ? this.updateOfflineCharacter() : userCharApi.updateChar(this.state.character)
            //         }, 1000);
            //     })
            // }
            // })
            // }
            if (!(this.props.options.spells || this.props.options.spellsKnown)) {
                if (this.props.character.race) {
                    addRacialSpells(this.props.character.raceId || new RaceModel(), this.state.character).forEach(item => {
                        const spell = spellsJSON.find(spell => spell.name === item)
                        if (spell && character.spells !== undefined) {
                            const spellLevel = spellLevelChanger(spell.level)
                            character.spells[spellLevel].push({ spell: spell, removable: false });
                            character.spellsKnown = (parseInt(character.spellsKnown) + 1).toString()
                        }
                    })
                }
                this.setState({ character })
            }
            if (this.props.options.abilityPointIncrease) {
                this.setState({ totalAbilityPoints: 2 });
            }
            if (this.props.options.metamagic) {
                this.setState({ totalMetaMagicPoints: this.props.options.metamagic.amount });
            }
            if (this.props.options.eldritchInvocations) {
                this.setState({ totalInvocationPoints: this.props.options.eldritchInvocations })
            }
            if (this.state.invocations.length > 0) {
                if (this.props.character.level) {
                    this.setState({ invocationsClicked: highLightPicked(this.state.invocations, eldritchInvocations(this.props.character.level, this.props.character)) })
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    setAvailableMagicSlots = async () => {
        try {
            if (this.state.character.magic) {
                const totalMagic = Object.values(this.state.character.magic);
                const newAvailableMagic = []
                for (let item of totalMagic) {
                    newAvailableMagic.push(item)
                }
                await AsyncStorage.setItem(`${this.state.character._id}availableMagic`, JSON.stringify(newAvailableMagic));
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    // pickPath = (path: any, index: number) => {
    //     try {
    //         this.setState({ pathInfoLoading: true })
    //         setTimeout(() => {
    //             this.setState({ pathInfoLoading: false })
    //         }, 800);
    //         let character = { ...this.state.character };
    //         if (!this.state.pathClicked[index]) {
    //             if (this.state.pathChosen !== null) {
    //                 alert(`Can't pick more then one path`)
    //                 return
    //             }
    //             const pathClicked = this.state.pathClicked;
    //             pathClicked[index] = true
    //             this.setState({ pathClicked, pathChosen: path }, () => {
    //                 this.extractCustomPathJson(this.state.pathChosen.name)
    //             });
    //         }
    //         else if (this.state.pathClicked[index]) {
    //             character = JSON.parse(JSON.stringify(this.state.beforeAnyChanges));
    //             const pathClicked = this.state.pathClicked;
    //             pathClicked[index] = false;
    //             this.setState({ pathClicked, pathChosen: null, character }, () => {
    //                 store.dispatch({ type: ActionType.SetInfoToChar, payload: this.state.character })
    //             });
    //         }
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }

    resetExpertiseSkills = async () => {
        try {
            store.dispatch({ type: ActionType.ResetCharSkillsToLowerLevel })
            this.setState({ reloadingSkills: true, skillsClicked: [] })
            setTimeout(() => {
                this.setState({ reloadingSkills: false })
            }, 500);
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickSkill = (skill: any, index: number) => {
        try {
            let count = 0;
            this.state.skillsClicked.forEach(appear => appear === true && count++)
            if (!this.state.skillsClicked[index]) {
                if (count === this.props.options.expertise) {
                    alert(`You can only Improve ${this.props.options.expertise} skills`);
                    return;
                }
                const newTools = this.state.newTools;
                let newSkills: any = [];
                const storeCharSkills = store.getState().character.skills;
                if (storeCharSkills) {
                    newSkills = storeCharSkills
                }
                const skillsClicked = this.state.skillsClicked;
                newTools.filter((item: any, index: number) => {
                    if (item.includes(skill[0]) && this.state.character.skills) {
                        if (item[1] === 2) {
                            alert('You already have expertise in this skill, you cannot double stack that same skill.');
                            return;
                        }
                        skillsClicked[index + this.state.character.skills.length] = true
                        item[1] = item[1] + 2
                        this.setState({ skillsClicked });
                        return;
                    }
                })
                newSkills.filter((item: any, index: number) => {
                    if (item.includes(skill[0])) {
                        if (item[1] === 2) {
                            alert('You already have expertise in this skill, you cannot double stack that same skill.');
                            return;
                        }
                        skillsClicked[index] = true
                        item[1] = item[1] + 2
                        this.setState({ skillsClicked });
                        return;
                    }
                })
            }
            else if (this.state.skillsClicked[index]) {
                const skillsClicked = this.state.skillsClicked;
                let newSkills: any = [];
                const storeCharSkills = store.getState().character.skills;
                if (storeCharSkills) {
                    newSkills = storeCharSkills
                }
                const newTools = this.state.newTools;
                newTools.filter((item: any, index: number) => {
                    if (item.includes(skill[0]) && this.state.character.skills) {
                        skillsClicked[index + this.state.character.skills.length] = false
                        item[1] = item[1] - 2
                        this.setState({ skillsClicked });
                        return;
                    }
                })
                newSkills.filter((item: any, index: number) => {
                    if (item.includes(skill[0])) {
                        skillsClicked[index] = false
                        item[1] = item[1] - 2;
                        this.setState({ skillsClicked });
                        return;
                    }
                })
            }
        } catch (err) {
            logger.log(new Error(err))
        }

    }

    addSkills = () => {
        try {
            let count = 0;
            this.state.skillsClicked.forEach(appear => appear === true && count++);
            if (count < 2) {
                alert('You still have points to spend on skill proficiencies.')
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addPath = () => {
        try {
            if (this.state.pathChosen === null) {
                alert(`Must Pick A path!`)
                return false
            }
            return true
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addAbilityPoints = () => {
        try {
            if (this.state.totalAbilityPoints > 0) {
                alert(`You still have ${this.state.totalAbilityPoints} points to spend.`);
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    // listStats = () => {
    //     try {
    //         const stats: any[] = [];
    //         stats.push(['strength', this.state.strength])
    //         stats.push(['constitution', this.state.constitution])
    //         stats.push(['dexterity', this.state.dexterity])
    //         stats.push(['intelligence', this.state.intelligence])
    //         stats.push(['wisdom', this.state.wisdom])
    //         stats.push(['charisma', this.state.charisma]);
    //         return stats
    //     } catch (err) {
    //         logger.log(new Error(err))
    //         return []
    //     }
    // }

    pickAbilityPoints = (ability: any, index: number) => {
        try {
            if (this.state[ability] === 20) {
                alert(`Max 20 ability points`)
                return;
            }
            if (this.state.abilityClicked[index] <= 2) {
                if (this.state.totalAbilityPoints === 0) {
                    alert(`You only have 2 ability points to spend`)
                    return;
                }
                const abilityClicked = this.state.abilityClicked;
                abilityClicked[index] = abilityClicked[index] + 1
                this.setState({ [ability]: this.state[ability] + 1 } as any)
                this.setState({ abilityClicked, totalAbilityPoints: this.state.totalAbilityPoints - 1 });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    removeAbilityPoints = (ability: any, index: number) => {
        try {
            if (this.state.abilityClicked[index] >= 0 && this.state.abilityClicked[index] <= 2 && this.state.totalAbilityPoints < 2) {
                if (this.state[ability] === this.state.character[ability]) {
                    return;
                }
                const abilityClicked = this.state.abilityClicked;
                abilityClicked[index] = abilityClicked[index] - 1
                this.setState({ [ability]: this.state[ability] - 1 } as any)
                this.setState({ abilityClicked, totalAbilityPoints: this.state.totalAbilityPoints + 1 });
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    // pickFightingStyle = (style: any, index: number) => {
    //     try {
    //         if (!this.state.fightingStyleClicked[index]) {
    //             if (this.state.fightingStyle.length >= 1) {
    //                 alert('You can only pick one fighting style.')
    //                 return;
    //             }
    //             const fightingStyleClicked = this.state.fightingStyleClicked;
    //             fightingStyleClicked[index] = true;
    //             const fightingStyle = this.state.fightingStyle;
    //             fightingStyle.push(style);
    //             this.setState({ fightingStyle, fightingStyleClicked })
    //         }
    //         else if (this.state.fightingStyleClicked[index]) {
    //             const fightingStyleClicked = this.state.fightingStyleClicked;
    //             fightingStyleClicked[index] = false;
    //             let fightingStyle = this.state.fightingStyle;
    //             fightingStyle = fightingStyle.filter((n: any) => n.name !== style.name)
    //             this.setState({ fightingStyle, fightingStyleClicked })
    //         }
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }

    pickMetaMagic = (magic: any, index: number) => {
        try {
            let metaMagic = this.state.metaMagic;
            if (!this.state.metamagicClicked[index]) {
                if (this.state.metaMagic.length >= this.state.totalMetaMagicPoints) {
                    alert(`You can only pick ${this.state.totalMetaMagicPoints} Metamagic abilities.`)
                    return;
                }
                const metamagicClicked = this.state.metamagicClicked;
                metamagicClicked[index] = true;
                metaMagic.push(magic)
                this.setState({ metaMagic, metamagicClicked })
            }
            else if (this.state.metamagicClicked[index]) {
                metaMagic = metaMagic.filter(val => val.name !== magic.name);
                const metamagicClicked = this.state.metamagicClicked;
                metamagicClicked[index] = false;
                this.setState({ metaMagic, metamagicClicked })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }
    addMetaMagic = () => {
        try {
            if (this.state.metaMagic.length !== this.state.totalMetaMagicPoints) {
                alert(`You still have ${this.state.totalMetaMagicPoints - this.state.metaMagic.length} Metamagic points`);
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    addFightingStyle = () => {
        try {
            if (this.state.fightingStyle.length === 0) {
                alert(`You must pick a fighting style`);
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    // checkSpellSlotImprove = (spellSlot: string) => {
    //     try {
    //         if (!this.state.beforeLevelUp) {
    //             return;
    //         }
    //         if (this.state.character.magic && this.state.beforeLevelUp.magic) {
    //             const difference = this.state.character.magic[spellSlot] - this.state.beforeLevelUp.magic[spellSlot];
    //             return difference === 0 ? '' : ` + ${difference} new!`;
    //         }
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }


    pickEldritchInvocations = (invocation: any, index: number) => {
        try {
            let invocations = this.state.invocations;
            if (!this.state.invocationsClicked[index]) {
                if (this.state.invocations.length >= this.state.totalInvocationPoints) {
                    alert(`You can only pick ${this.state.totalInvocationPoints} Eldritch Invocations.`)
                    return;
                }
                const invocationsClicked = this.state.invocationsClicked;
                invocationsClicked[index] = true;
                invocations.push(invocation)
                this.setState({ invocations, invocationsClicked })
            }
            else if (this.state.invocationsClicked[index]) {
                invocations = invocations.filter((val: any) => val.name !== invocation.name);
                const invocationsClicked = this.state.invocationsClicked;
                invocationsClicked[index] = false;
                this.setState({ invocations, invocationsClicked })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addEldritchInvocations = () => {
        try {
            if (this.state.invocations.length !== this.state.totalInvocationPoints) {
                alert(`You still have ${this.state.totalInvocationPoints - this.state.invocations.length} Eldritch Invocations to pick`);
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    pickWarlockPact = (pact: any, index: number) => {
        try {
            const character = { ...this.state.character };
            if (!this.state.pactClicked[index]) {
                if (this.state.pact !== null) {
                    alert('You can only pick one pact.')
                    return;
                }
                const pactClicked = this.state.pactClicked;
                pactClicked[index] = true;
                if (character.charSpecials && this.props.character.level) {
                    character.charSpecials.warlockPactBoon = pact
                    this.setState({ pact: pact, pactClicked, character, invocationsClicked: highLightPicked(this.state.invocations, eldritchInvocations(this.props.character.level, this.props.character)) })
                }
            }
            else if (this.state.pactClicked[index]) {
                const pactClicked = this.state.pactClicked;
                pactClicked[index] = false;
                if (character.charSpecials && this.props.character.level) {
                    character.charSpecials.warlockPactBoon = { name: '', description: "" };
                    this.setState({ pact: null, pactClicked, character, invocationsClicked: highLightPicked(this.state.invocations, eldritchInvocations(this.props.character.level, this.props.character)) })
                }
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addWarlockPact = () => {
        try {
            if (this.state.pact === null) {
                alert(`You must pick a pact`);
                return false;
            }
            return true;
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    // resetAbilityScoresToCurrentLevel = () => {
    //     try {
    //         this.setState({
    //             strength: this.props.character.strength ? this.props.character.strength : 0,
    //             dexterity: this.props.character.dexterity ? this.props.character.dexterity : 0,
    //             constitution: this.props.character.constitution ? this.props.character.constitution : 0,
    //             intelligence: this.props.character.intelligence ? this.props.character.intelligence : 0,
    //             wisdom: this.props.character.wisdom ? this.props.character.wisdom : 0,
    //             charisma: this.props.character.charisma ? this.props.character.charisma : 0
    //         })
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }
    // disableExtraPathChoice = () => {
    //     try {
    //         if (!this.state.extraPathChoice) {
    //             return;
    //         }
    //         this.setState({ extraPathChoice: false })
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }

    // enableExtraPathChoice = () => {
    //     try {
    //         if (this.state.extraPathChoice) {
    //             return;
    //         }
    //         this.setState({ extraPathChoice: true })
    //     } catch (err) {
    //         logger.log(new Error(err))
    //     }
    // }

    applyExtraPathChoice = (choice: any, index: number) => {
        try {
            if (!this.state.extraPathChoiceClicked[index]) {
                const extraPathChoiceAmount = this.state.numberOfChoices;
                if (this.state.extraPathChoiceValue.length === extraPathChoiceAmount) {
                    alert(`You can only pick ${extraPathChoiceAmount} choices.`)
                    return;
                }
                const extraPathChoiceValue = this.state.extraPathChoiceValue;
                const extraPathChoiceClicked = this.state.extraPathChoiceClicked;
                extraPathChoiceClicked[index] = true;
                extraPathChoiceValue.push(choice);
                this.setState({ extraPathChoiceValue })

            }
            else if (this.state.extraPathChoiceClicked[index]) {
                let extraPathChoiceValue = this.state.extraPathChoiceValue;
                const extraPathChoiceClicked = this.state.extraPathChoiceClicked;
                extraPathChoiceClicked[index] = false;
                extraPathChoiceValue = extraPathChoiceValue.filter((val: any) => choice.name !== val.name);
                this.setState({ extraPathChoiceValue })
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    addArmor = async () => {
        try {
            let armorList = await AsyncStorage.getItem(`${this.state.character._id}ArmorList`);
            if (!armorList) {
                const armorList = [this.state.armorToLoad]
                AsyncStorage.setItem(`${this.state.character._id}ArmorList`, JSON.stringify(armorList))
                return;
            }
            const newArmorList = JSON.parse(armorList)
            newArmorList.push(this.state.armorToLoad)
            AsyncStorage.setItem(`${this.state.character._id}ArmorList`, JSON.stringify(newArmorList))
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    armorBonuses = (armorAc: number, armorBonusesCalculationType: any) => {
        try {
            let newArmorAc: number = 0;
            let dex: number = 0
            let wiz: number = 0
            let con: number = 0
            if (this.state.character.modifiers) {
                if (this.state.character.modifiers.dexterity) {
                    dex = this.state.character.modifiers.dexterity
                }
                if (this.state.character.modifiers.wisdom) {
                    wiz = this.state.character.modifiers.wisdom
                }
                if (this.state.character.modifiers.constitution) {
                    con = this.state.character.modifiers.constitution
                }
            }
            if (armorBonusesCalculationType === "Medium Armor") {
                newArmorAc = +armorAc + (dex >= 2 ? 2 : dex)
            }
            if (armorBonusesCalculationType === "Light Armor") {
                newArmorAc = +armorAc + (dex)
            }
            if (armorBonusesCalculationType === "Heavy Armor") {
                newArmorAc = +armorAc
            }
            if (armorBonusesCalculationType === "none") {
                newArmorAc = 10 + +dex
            }
            if (this.state.character.characterClass === "Barbarian" && armorBonusesCalculationType === "none") {
                newArmorAc = (10 + +dex + +con)
            }
            if (this.state.character.characterClass === "Monk" && armorBonusesCalculationType === "none") {
                newArmorAc = (10 + +dex + +wiz)
            }
            if (this.state.character.pathFeatures && this.state.character.pathFeatures?.length > 0) {
                this.state.character.pathFeatures.forEach(item => {
                    if (item.name === "Draconic Resilience" && armorBonusesCalculationType === "none") {
                        newArmorAc = (13 + +dex)
                    }
                })
            }
            return newArmorAc
        } catch (err) {
            logger.log(new Error(err))
        }
    }

    close = async () => {
        try {
            for (let item of this.state.errorList) {
                if (item.isError) {
                    alert(item.errorDesc);
                    return
                }
            }
            // console.log(this.state.character.spells?.cantrips)
            if (await AsyncStorage.getItem(`${this.state.character._id}FirstTimeOpened`)) {
                await AsyncStorage.removeItem(`${this.state.character._id}FirstTimeOpened`)
            }
            const result = await userCharApi.updateChar(this.state.character)
            if (result.ok) {
                store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: this.props.index, character: this.state.character } });
                this.props.refresh()
                this.props.close(false);
            }
            //     const character = { ...this.state.character };
            //     if (this.props.options.pathSelector) {
            //         if (!this.addPath()) {
            //             return;
            //         }
            //         if (this.state.additionalSkillPicks > 0) {
            //             alert('You have additional choices to pick from')
            //             return;
            //         }
            //         if (this.state.pathFightingStyle) {
            //             alert('You still have to pick a fighting style')
            //             return;
            //         }
            //         if (this.state.additionalToolPicks) {
            //             alert('You have additional tools to pick from')
            //             return;
            //         }
            //         if (this.state.pathPickDruidCircle) {
            //             alert('You Must pick a druid circle')
            //             return;
            //         }
            //         if (this.state.languageToPick) {
            //             alert('You must add languages.')
            //             return;
            //         }
            //         if (this.state.extraPathChoice) {
            //             if (this.state.extraPathChoiceValue.length !== this.state.numberOfChoices) {
            //                 alert('You have additional choices to pick from')
            //                 return;
            //             }
            //         }
            //         if (this.state.maneuversToPick) {
            //             alert('You have additional Maneuvers to pick from')
            //             return;
            //         }
            //         if (this.state.ElementsToPick) {
            //             alert('You have additional Elements to pick from')
            //             return;
            //         }
            //         if (character.charSpecials && character.pathFeatures) {
            //             character.charSpecials.battleMasterManeuvers = this.state.maneuvers;
            //             character.charSpecials.monkElementsDisciplines = this.state.elements;
            //             character.path = this.state.pathChosen;
            //             const officialOrCustom = Path[this.state.character.characterClass][this.state.pathChosen.name] ? Path[this.state.character.characterClass][this.state.pathChosen.name][this.state.character.level] : this.state.customPathFeatureList
            //             const pathResult = PathFeatureOrganizer(officialOrCustom, this.state.extraPathChoiceValue)
            //             for (let item of pathResult) {
            //                 character.pathFeatures.push(item)
            //             }
            //         }

            //     }
            //     if (this.props.options.pathFeature && !this.props.options.pathSelector) {
            //         if (this.state.additionalSkillPicks > 0) {
            //             alert('You have additional choices to pick from')
            //             return;
            //         }
            //         if (this.state.additionalToolPicks) {
            //             alert('You have additional tools to pick from')
            //             return;
            //         }
            //         if (this.state.pathFightingStyle) {
            //             alert('You still have to pick a fighting style')
            //             return;
            //         }
            //         if (this.state.languageToPick) {
            //             alert('You must add languages.')
            //             return;
            //         }
            //         if (this.state.extraPathChoice) {
            //             if (this.state.extraPathChoiceValue.length !== this.state.numberOfChoices) {
            //                 alert('You have additional choices to pick from')
            //                 return;
            //             }
            //         }
            //         if (this.state.maneuversToPick) {
            //             alert('You have additional Maneuvers to pick from')
            //             return;
            //         }
            //         if (this.state.ElementsToPick) {
            //             alert('You have additional Elements to pick from')
            //             return;
            //         }
            //         if (character.charSpecials && character.pathFeatures) {
            //             character.charSpecials.battleMasterManeuvers = this.state.maneuvers;
            //             character.charSpecials.monkElementsDisciplines = this.state.elements;
            //             const officialOrCustom = Path[this.state.character.characterClass][this.state.character.path.name || this.state.pathChosen.name] ? Path[this.state.character.characterClass][this.state.character.path.name || this.state.pathChosen.name][this.state.character.level] : this.state.customPathFeatureList
            //             const pathResult = PathFeatureOrganizer(officialOrCustom, this.state.extraPathChoiceValue)
            //             for (let item of pathResult) {
            //                 character.pathFeatures.push(item)
            //             }
            //         }

            //     }
            //     if (this.state.infusionsToPick) {
            //         alert('You have additional infusions to pick from')
            //         return;
            //     }
            //     if (character.charSpecials) {
            //         character.charSpecials.artificerInfusions = this.state.infusions
            //     }
            //     if (this.props.options.extraSpells) {
            //         for (let item of this.props.options.extraSpells) {
            //             const spell = spellsJSON.find(spell => spell.name === item)
            //             if (spell && character.spells) {
            //                 const spellLevel = spellLevelChanger(spell.level)
            //                 character.spells[spellLevel].push({ spell: spell, removable: false });
            //             }
            //         }
            //         if (this.props.options.notCountAgainstKnown) {
            //             character.spellsKnown = parseInt(character.spellsKnown + this.props.options.extraSpells.length).toString()
            //         }
            //     }
            //     if (this.props.options.abilityPointIncrease && !this.state.featsWindow && !this.state.abilityWindow) {
            //         alert('Must pick Ability score increase or new feat.');
            //         return;
            //     }
            //     if (this.props.options.abilityPointIncrease && this.state.abilityWindow) {
            //         if (!this.addAbilityPoints()) {
            //             return;
            //         }
            //         character.strength = this.state.strength;
            //         character.constitution = this.state.constitution;
            //         character.dexterity = this.state.dexterity;
            //         character.intelligence = this.state.intelligence;
            //         character.charisma = this.state.charisma;
            //         character.wisdom = this.state.wisdom;
            //     }
            //     if (this.props.options.abilityPointIncrease && this.state.featsWindow) {
            //         if (this.state.featName === '' || this.state.featDescription === '') {
            //             alert('You must provide a name and description for your feat.');
            //             return;
            //         }
            //         if (this.state.featSkillList.length > 0) {
            //             this.state.featSkillList.forEach((item) => character.skills?.push(item))
            //         }
            //         if (this.state.featToolList.length > 0) {
            //             this.state.featToolList.forEach((item) => character.tools?.push(item))
            //         }
            //         if (this.state.featSavingThrowList.length > 0) {
            //             const savingThrows: any = getSpecialSaveThrows(this.state.character)
            //             if (savingThrows) {
            //                 this.state.featSavingThrowList.forEach((item) => savingThrows.push(item));
            //                 character.savingThrows = savingThrows
            //             }
            //         }
            //         this.state.weaponProfArray.forEach(item => {
            //             if (character.addedWeaponProf !== undefined) {
            //                 character.addedWeaponProf.push(item)
            //             }
            //         });
            //         this.state.armorProfArray.forEach(item => {
            //             if (character.addedArmorProf) {
            //                 character.addedArmorProf.push(item)
            //             }
            //         });
            //         if (character.feats) {
            //             character.feats.push({ name: this.state.featName, description: this.state.featDescription })
            //         }

            //         character.strength = this.state.strength;
            //         character.constitution = this.state.constitution;
            //         character.dexterity = this.state.dexterity;
            //         character.intelligence = this.state.intelligence;
            //         character.charisma = this.state.charisma;
            //         character.wisdom = this.state.wisdom;
            //     }
            //     if (this.state.spellListToLoad) {
            //         if (this.state.spellListToLoad.spells.length < this.state.spellListToLoad.limit) {
            //             alert("You have additional spells to pick");
            //             return;
            //         }
            //         for (let item of this.state.spellListToLoad.spells) {
            //             const spell = spellsJSON.find(spell => spell.name === item)
            //             if (spell && character.spells) {
            //                 const spellLevel = spellLevelChanger(spell.level)
            //                 character.spells[spellLevel].push({ spell: spell, removable: false });
            //             }
            //         }
            //     }
            //     if (this.state.specificSpellToLoad) {
            //         if (this.state.specificSpell.notCountAgainstKnownCantrips) {
            //             if (character.magic && character.magic.cantrips) {
            //                 character.magic.cantrips = character.magic.cantrips + 1;
            //             }
            //         }
            //         const spell = spellsJSON.find(spell => spell.name === this.state.specificSpell.name)
            //         if (spell && character.spells) {
            //             const spellLevel = spellLevelChanger(spell.level)
            //             character.spells[spellLevel].push({ spell: spell, removable: false });
            //         }
            //     }
            //     if (this.props.options.expertise) {
            //         if (!this.addSkills()) {
            //             return;
            //         }
            //         character.skills = store.getState().character.skills;
            //         character.tools = this.state.newTools
            //     }
            //     if (this.props.options.pickFightingStyle) {
            //         if (!this.addFightingStyle()) {
            //             return;
            //         }
            //         for (let item of this.state.fightingStyle) {
            //             if (character.charSpecials && character.charSpecials.fightingStyle) {
            //                 character.charSpecials.fightingStyle.push(item)
            //             }
            //         }
            //     }
            //     if (this.state.langHolder.length > 0) {
            //         for (let item of this.state.langHolder) {
            //             if (character.languages) {
            //                 character.languages.push(item)
            //             }
            //         }
            //     }
            //     if (this.props.options.metamagic) {
            //         if (!this.addMetaMagic()) {
            //             return;
            //         }
            //         for (let item of this.state.metaMagic) {
            //             if (character.charSpecials && character.charSpecials.sorcererMetamagic) {
            //                 character.charSpecials.sorcererMetamagic.push(item)
            //             }
            //         }
            //     }
            //     if (this.props.options.rageAmount && character.charSpecials) {
            //         character.charSpecials.rageAmount = this.props.options.rageAmount;
            //         character.charSpecials.rageDamage = this.props.options.rageDamage;
            //     }
            //     if (this.props.options.eldritchInvocations) {
            //         if (!this.addEldritchInvocations()) {
            //             return;
            //         }
            //         if (character.charSpecials) {
            //             character.charSpecials.eldritchInvocations = this.state.invocations
            //         }
            //     }
            //     if (this.state.newSpellAvailabilityList.length > 0) {
            //         for (let item of this.state.newSpellAvailabilityList) {
            //             if (character.differentClassSpellsToPick) {
            //                 character.differentClassSpellsToPick.push(item)
            //             }
            //         }
            //     }
            //     if (this.props.options.alwaysOnToolExpertise && character.charSpecials) {
            //         character.charSpecials.alwaysOnToolExpertise = true
            //     }
            //     if (this.state.addSpellAvailabilityByName.length > 0) {
            //         for (let item of this.state.addSpellAvailabilityByName) {
            //             if (character.addSpellAvailabilityByName) {
            //                 character.addSpellAvailabilityByName.push(item)
            //             }
            //         }
            //     }
            //     if (this.props.options.monkMartialArts && character.charSpecials) {
            //         character.charSpecials.kiPoints = this.props.options.kiPoints
            //         character.charSpecials.martialPoints = this.props.options.monkMartialArts
            //     }
            //     if (this.props.options.sneakAttackDie && character.charSpecials) {
            //         character.charSpecials.sneakAttackDie = this.props.options.sneakAttackDie
            //     }
            //     if (this.state.armorToLoad !== null) {
            //         this.addArmor()
            //     }
            //     if (this.state.newPathChoice !== null) {
            //         if (character.pathFeatures) {
            //             for (let item of character.pathFeatures) {
            //                 if (pathChoiceChangePicker(character) === item.name) {
            //                     item.choice[0] = this.state.newPathChoice;
            //                 }
            //             }
            //         }
            //     }
            //     if (this.props.options.pactSelector) {
            //         if (!this.addWarlockPact()) {
            //             return;
            //         }
            //         if (character.charSpecials) {
            //             character.charSpecials.warlockPactBoon = this.state.pact;
            //         }
            //     }
            //     if (character.charSpecials?.alwaysOnToolExpertise && character.tools) {
            //         for (let item of character.tools) {
            //             item[1] = 2
            //         }
            //     }
            //     if (this.state.newFirstLevelMagic.newSpells && character.spells) {
            //         for (let spell of this.state.newFirstLevelMagic.newSpells) {
            //             const spellLevel = spellLevelChanger(spell.level)
            //             character.spells[spellLevel].push({ spell: spell, removable: false });
            //         }
            //         character.spellsKnown = this.state.newFirstLevelMagic.spellsKnown
            //     }
            //     this.setState({ character }, async () => {
            //         const character = { ...this.state.character };
            //         const attributePoints = [character.strength, character.constitution, character.dexterity, character.intelligence, character.wisdom, character.charisma]
            //         if (this.state.character.modifiers && character.modifiers) {
            //             const modifiers = Object.values(this.state.character.modifiers);
            //             attributePoints.forEach((item: any, index: number) => {
            //                 modifiers[index] = switchModifier(item);
            //             })
            //             character.modifiers.strength = modifiers[0];
            //             character.modifiers.constitution = modifiers[1];
            //             character.modifiers.dexterity = modifiers[2];
            //             character.modifiers.intelligence = modifiers[3];
            //             character.modifiers.wisdom = modifiers[4];
            //             character.modifiers.charisma = modifiers[5];
            //         }
            //         if (character.equippedArmor && character.equippedArmor.baseAc) {
            //             character.equippedArmor.ac = this.armorBonuses(character.equippedArmor.baseAc, character.equippedArmor.armorBonusesCalculationType)
            //             this.setState({ character })
            //         }
            //         if (this.context.user._id === "Offline") {
            //             this.updateOfflineCharacter().then(() => {
            //                 this.props.refresh()
            //                 this.props.close(false);
            //             })
            //             return
            //         }

        } catch (err) {
            logger.log(new Error(err))
        }
    }

    updateOfflineCharacter = async () => {
        try {
            const stringifiedChars = await AsyncStorage.getItem('offLineCharacterList');
            if (stringifiedChars) {
                const characters = JSON.parse(stringifiedChars);
                for (let index in characters) {
                    if (characters[index]._id === this.state.character._id) {
                        characters[index] = this.state.character;
                        break;
                    }
                }
                await AsyncStorage.setItem('offLineCharacterList', JSON.stringify(characters))
            }
        } catch (err) {
            logger.log(new Error(err))
        }
    }


    render() {
        let CharSkillsFromStore: any = []
        const storeCharSkills = store.getState().character.skills;
        if (storeCharSkills) {
            CharSkillsFromStore = storeCharSkills
        }
        return (
            <View style={styles.container} >
                {this.state.load ?
                    <View>
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100 }}>
                            <AppText fontSize={35} color={Colors.bitterSweetRed}>Congratulations!</AppText>
                            <AppText textAlign={'center'} fontSize={30}>You have reached level {this.state.character.level}</AppText>
                        </View>
                        <LottieView style={{ zIndex: 1, width: "100%" }} autoPlay source={require('../../../assets/lottieAnimations/confeetiAnimation.json')} />
                    </View>
                    :
                    <View>
                        <PathingLevelRoute
                            errorList={this.state.errorList}
                            updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => this.setState({ errorList })}
                            resetExpertiseSkills={() => this.resetExpertiseSkills()}
                            beforeAnyChanges={this.state.beforeAnyChanges}
                            pathFeature={this.props.options.pathFeature}
                            returnUpdatedCharacter={(character: CharacterModel) => this.setState({ character })}
                            character={this.state.character}
                            pathSelector={this.props.options.pathSelector} />

                        {this.props.options.alwaysOnToolExpertise ?
                            <AlwaysOnToolProf character={this.state.character} returnUpdatedCharInfo={(character: CharacterModel) => this.setState({ character })} />
                            : null}
                        {this.props.options.totalInfusions ?
                            <AppArtificerInfusionPicker character={this.state.character} totalInfusions={this.props.options.totalInfusions}
                                errorList={this.state.errorList}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                                updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => this.setState({ errorList })}

                            />
                            :
                            null}
                        {this.props.options.rageAmount ?
                            <LevelUpRageAddition character={this.state.character}
                                rageAmount={this.props.options.rageAmount}
                                rageDamage={this.props.options.rageDamage}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })} />
                            :
                            null
                        }
                        {this.props.options.abilityPointIncrease ?
                            <FeatsAndAbilities
                                beforeChanges={this.state.beforeAnyChanges}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                                updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => {
                                    console.log(errorList)
                                    this.setState({ errorList })
                                }}

                                character={this.state.character}
                                errorList={this.state.errorList} />
                            :
                            null}

                        {this.state.character.level && this.state.character.level > 3 && allowedChangingPaths(this.state.character) ?
                            <AppChangePathChoiceAtLevelUp updateCharacter={(character: CharacterModel) => this.setState({ character })}
                                character={this.state.character} newPathChoice={(val: any) => { this.setState({ newPathChoice: val }) }} />
                            : null}

                        {this.props.options.expertise ?
                            <LevelUpExpertise character={this.state.character}
                                expertise={this.props.options.expertise}
                                reloadingSkills={this.state.reloadingSkills} />
                            :
                            null}

                        {this.props.options.spells || this.props.options.spellsKnown ?
                            <LevelUpMagic
                                character={this.state.character}
                                spellSlots={this.props.options.spellSlots}
                                beforeLevelUp={this.state.beforeAnyChanges}
                                spellSlotLevel={this.props.options.spellSlotLevel}
                                cantrips={this.props.options.cantrips}
                                sorceryPoints={this.props.options.sorceryPoints}
                                spells={this.props.options.spells}
                                spellsKnown={this.props.options.spellsKnown}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            />
                            : null}



                        {this.props.options.pickFightingStyle ?
                            <LevelUpFightingStyle
                                character={this.state.character}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                                fightingStyles={this.props.options.pickFightingStyle}

                            />
                            :
                            null}
                        {this.props.options.monkMartialArts ?
                            <LevelUpMonkArts
                                character={this.state.character}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                                kiPoints={this.props.options.kiPoints}
                                monkMartialArts={this.props.options.monkMartialArts}
                            />
                            : null}
                        {this.props.options.sneakAttackDie ?
                            <LevelUpSneakAttackDie
                                character={this.state.character}
                                sneakAttackDie={this.props.options.sneakAttackDie}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            />
                            : null}
                        {this.props.options.metamagic ?
                            // <View>
                            //     <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}> level {this.props.character.level} {this.props.character.characterClass}</AppText>
                            //     <AppText textAlign={'center'}>You now gain the ability to twist your spells to suit your needs.</AppText>
                            //     <AppText textAlign={'center'}>You gain two of the following Metamagic options of your choice. You gain another one at 10th and 17th level.</AppText>
                            //     {filterAlreadyPicked(this.props.options.metamagic.value, this.state.character.charSpecials && this.state.character.charSpecials.sorcererMetamagic ? this.state.character.charSpecials.sorcererMetamagic : []).map((magic: any, index: number) =>
                            //         <TouchableOpacity key={index} onPress={() => { this.pickMetaMagic(magic, index) }} style={[styles.longTextItem, { backgroundColor: this.state.metamagicClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                            //             <AppText fontSize={20} color={this.state.metamagicClicked[index] ? Colors.black : Colors.bitterSweetRed}>{magic.name}</AppText>
                            //             <AppText>{magic.description}</AppText>
                            //         </TouchableOpacity>)}
                            // </View>
                            : null}
                        {this.props.options.sorceryPoints ?
                            <AppText textAlign={'center'}>You now Possess {this.props.options.sorceryPoints} sorcery points!</AppText>
                            : null}

                        {this.props.options.eldritchInvocations ?
                            <View>
                                <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>As a level {this.props.character.level} {this.props.character.characterClass}</AppText>
                                <AppText textAlign={'center'}>You now gain the ability to use Eldritch Invocations, these are powerful abilities you will unlock throughout leveling up</AppText>
                                <AppText textAlign={'center'}>Remember that every time you level up you can choose to replace old invocations with new ones to suit your needs.</AppText>
                                <AppText textAlign={'center'} fontSize={18}>You have a total of {this.state.totalInvocationPoints} Invocations.</AppText>
                                {eldritchInvocations(this.props.character.level ? this.props.character.level : 0, this.props.character).map((invocation: any, index: number) =>
                                    <TouchableOpacity key={index} onPress={() => { this.pickEldritchInvocations(invocation, index) }} style={[styles.longTextItem, { backgroundColor: this.state.invocationsClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText fontSize={20} color={this.state.invocationsClicked[index] ? Colors.black : Colors.bitterSweetRed}>{invocation.name}</AppText>
                                        <AppText>{invocation.entries}</AppText>
                                    </TouchableOpacity>)}
                            </View>
                            : null}
                        {this.props.options.pactSelector ?
                            <View style={{ padding: 15 }}>
                                <AppText textAlign={'center'} color={Colors.bitterSweetRed} fontSize={22}>As a level {this.props.character.level} {this.props.character.characterClass}</AppText>
                                <AppText fontSize={17} textAlign={'center'}>You can now pick one of three pacts, these pacts will unlock powerful Eldritch Invocations at later levels</AppText>
                                <AppText fontSize={17} textAlign={'center'}>Remember, you can only choose one pact and you cannot change it.</AppText>
                                <AppText fontSize={17} textAlign={'center'}>Once you pick a pact new Eldritch Invocations will be unlocked, scroll up and see if you find something you fancy!</AppText>
                                {this.props.options.pactSelector.map((pact: any, index: number) =>
                                    <TouchableOpacity key={index} onPress={() => { this.pickWarlockPact(pact, index) }} style={[styles.longTextItem, { backgroundColor: this.state.pactClicked[index] ? Colors.bitterSweetRed : Colors.lightGray }]}>
                                        <AppText fontSize={20} color={this.state.pactClicked[index] ? Colors.black : Colors.bitterSweetRed}>{pact.name}</AppText>
                                        <AppText>{pact.description}</AppText>
                                    </TouchableOpacity>)}
                            </View>
                            : null}
                        {this.props.options.extraSpells ?
                            <View>
                                <View style={{ justifyContent: "center", alignItems: "center", padding: 10, marginTop: 15 }}>
                                    <AppText textAlign={'center'} fontSize={22}>As a level {this.state.character.level} {this.state.character.characterClass} of the {this.state.character.path.name} {this.state.character.charSpecials && this.state.character.charSpecials.druidCircle !== "false" ? `with the ${this.state.character.charSpecials.druidCircle} attribute` : null}</AppText>
                                    <AppText color={Colors.bitterSweetRed} fontSize={22}>You gain the following spells</AppText>
                                </View>
                                {this.props.options.extraSpells.map((spell: any, index: number) =>
                                    <View style={{ justifyContent: "center", alignItems: "center" }} key={`${spell.name}${index}`}>
                                        <AppText fontSize={18}>{spell}</AppText>
                                    </View>)}
                            </View>
                            : null}
                        <View style={{ paddingTop: 15, paddingBottom: 15 }}>
                            <AppButton fontSize={18} backgroundColor={Colors.bitterSweetRed} borderRadius={100} width={100} height={100} title={"Ok"} onPress={() => { this.close() }} />
                        </View>
                    </View>}
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    },
    magic: {
        alignItems: "center"
    },
    item: {
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 15,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 25
    },
    modifier: {
        position: 'relative',
        width: Dimensions.get('screen').width / 2,
        flexWrap: "wrap",
        paddingHorizontal: 30,
        paddingVertical: 10,
        justifyContent: "space-around",
    },
    innerModifier: {
        width: 120,
        height: 120,
        borderRadius: 120,
        justifyContent: "center"
    },
    longTextItem: {
        marginTop: 15,
        width: Dimensions.get('screen').width / 1.2,
        marginLeft: 15,
        padding: 20,
        borderRadius: 15

    }, infoContainer: {
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: Colors.berries,
        borderRadius: 15,
        padding: 10
    }

});