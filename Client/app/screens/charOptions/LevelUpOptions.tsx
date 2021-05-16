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
import { LevelUpMetaMagic } from './LevelUpRoutes/LevelUpMetaMagic';
import { LevelUpInvocations } from './LevelUpRoutes/LevelUpInvocations';
import { LevelUpWarlockPact } from './LevelUpRoutes/LevelUpWarlockPact';
import { LevelUpExtraSpells } from './LevelUpRoutes/LevelUpExtraSpells';


interface LevelUpOptionsState {
    beforeAnyChanges: CharacterModel;
    beforeLevelUp: CharacterModel;
    skillsClicked: any[];
    character: CharacterModel;
    totalAbilityPoints: number;
    load: boolean;
    reloadingSkills: boolean;
    newPathChoice: any;
    errorList: { isError: boolean, errorDesc: string }[];
}

export class LevelUpOptions extends Component<{ index: number, options: any, character: CharacterModel, close: any, refresh: any }, LevelUpOptionsState>{
    static contextType = AuthContext;
    constructor(props: any) {
        super(props)
        this.state = {
            errorList: [],
            beforeAnyChanges: new CharacterModel,
            reloadingSkills: false,
            beforeLevelUp: new CharacterModel,
            skillsClicked: [],
            load: true,
            totalAbilityPoints: 0,
            character: this.props.character,
            newPathChoice: null,
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
        } catch (err) {
            logger.log(new Error(err))
        }
    }

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

    close = async () => {
        try {
            for (let item of this.state.errorList) {
                if (item.isError) {
                    alert(item.errorDesc);
                    return
                }
            }
            if (await AsyncStorage.getItem(`${this.state.character._id}FirstTimeOpened`)) {
                await AsyncStorage.removeItem(`${this.state.character._id}FirstTimeOpened`)
            }

            const result = await userCharApi.updateChar(this.state.character)
            if (result.ok) {
                store.dispatch({ type: ActionType.ReplaceExistingChar, payload: { charIndex: this.props.index, character: this.state.character } });
                this.props.refresh()
                this.props.close(false);
            }
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
                            <LevelUpMetaMagic
                                character={this.state.character}
                                metaMagic={this.props.options.metamagic}
                                totalMetaMagicPoints={this.props.options.metamagic.amount}
                                beforeLevelUp={this.state.beforeAnyChanges}
                                errorList={this.state.errorList}
                                updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => {
                                    this.setState({ errorList })
                                }}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            /> : null}

                        {this.props.options.sorceryPoints ? <AppText textAlign={'center'}>You now Possess {this.props.options.sorceryPoints} sorcery points!</AppText> : null}

                        {this.props.options.eldritchInvocations ?

                            <LevelUpInvocations
                                beforeLevelUp={this.state.beforeLevelUp}
                                character={this.state.character}
                                errorList={this.state.errorList}
                                updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => {
                                    this.setState({ errorList })
                                }}
                                totalInvocationPoints={this.props.options.eldritchInvocations}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            />
                            : null}

                        {this.props.options.pactSelector ?
                            <LevelUpWarlockPact
                                character={this.state.character}
                                errorList={this.state.errorList}
                                updateErrorList={(errorList: { isError: boolean, errorDesc: string }[]) => {
                                    this.setState({ errorList })
                                }}
                                pactSelector={this.props.options.pactSelector}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            /> : null}

                        {this.props.options.extraSpells ?
                            <LevelUpExtraSpells
                                character={this.state.character}
                                extraSpells={this.props.options.extraSpells}
                                notCountAgainstKnown={this.props.options.notCountAgainstKnown}
                                updateCharacter={(character: CharacterModel) => this.setState({ character })}
                            />
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

    }
});