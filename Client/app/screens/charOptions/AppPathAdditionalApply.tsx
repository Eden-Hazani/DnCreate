import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppAddingPathCantrip } from '../../components/AppAddingPathCantrip';
import { AppAddMagicToNonMagic } from '../../components/AppAddMagicToNonMagic';
import { AppPathFirstLevelSpellsAddition } from '../../components/AppPathFirstLevelSpellsAddition';
import { AppDruidSpellPicker } from '../../components/AppDruidSpellPicker';
import { AppManeuverPicker } from '../../components/AppManeuverPicker';
import { AppPathAddLanguage } from '../../components/AppPathAddLanguage';
import { AppPathAddSpecificSpell } from '../../components/AppPathAddSpecificSpell';
import { AppPathAddSpellFromDifferentClass } from '../../components/AppPathAddSpellFromDifferentClass';
import { AppPathAddSpellsList } from '../../components/AppPathAddSpellsList';
import { AppPathArmorAdding } from '../../components/AppPathArmorAdding';
import { AppPathMonkFourElementsPicker } from '../../components/AppPathMonkFourElementsPicker';
import { AppPathUnrestrictedMagic } from '../../components/AppPathUnrestrictedMagic';
import { AppPathWeaponAdding } from '../../components/AppPathWeaponAdding';
import { AppPickFightingStyle } from '../../components/AppPickFightingStyle';
import { AppSkillItemPicker } from '../../components/AppSkillItemPicker';
import { AppToolPicker } from '../../components/AppToolPicker';
import { CharacterModel } from '../../models/characterModel';
import { AppAddSpecificTools } from '../../components/AppAddSpecificTools';
import { AppPathAddArmorToChar } from '../../components/AppPathAddArmorToChar';
import { AppSavingThrowPathAdder } from '../../components/AppSavingThrowPathAdder';
import { AppPathIncreaseMaxHp } from '../../components/AppPathIncreaceMaxHp';
import { AppPathAddSpellPickAvailability } from '../../components/AppPathAddSpellPickAvailability';
import { AppPickSpecificSpellWithChoices } from '../../components/AppPickSpecificSpellWithChoices';
import { AppAddSpellChoice } from '../../components/AppAddSpellChoice';
import { AppAddExactSkillProf } from '../../components/AppAddExectSkillProf';

export class AppPathAdditionalApply extends Component<{
    character: CharacterModel, pathItem: any, isAdditionalSkillChoice: any, pathChosen: any, loadManeuvers: any, maneuversToPick: any
    loadSkills: any, resetExpertiseSkills: any, loadArmors: any, loadWeapons: any, loadUnrestrictedMagic: any,
    isAdditionalToolChoice: any, fightingStylesToPick: any, loadSpecificSpell: any, armorToLoad: any, loadFirstLevelSpells: any,
    pickDruidCircle: any, pathChosenObj: any, languagesToPick: any, loadLanguage: any,
    loadElements: any, elementsToPick: any, loadCharacter: any, updateSpellList: any, addSpellAvailabilityByName: any, returnSavingThrows: any
}> {

    render() {
        return (
            <View style={styles.container}>
                {this.props.pathItem.skillList &&
                    <AppSkillItemPicker resetExpertiseSkills={(val: any) => { this.props.resetExpertiseSkills(val) }} character={this.props.character} withConditions={this.props.pathItem.withConditions}
                        setAdditionalSkillPicks={(val: boolean) => { this.props.isAdditionalSkillChoice(val) }} skillsStartAsExpertise={this.props.pathItem.skillsStartAsExpertise} pathChosen={this.props.pathChosen}
                        extraSkillsTotal={this.props.pathItem.extraSkillsTotal}
                        sendSkillsBack={(val: any) => { this.props.loadSkills(val) }} itemList={this.props.pathItem.skillList} amount={this.props.pathItem.skillPickNumber} />
                }
                {this.props.pathItem.armorProf &&
                    <AppPathArmorAdding armorList={this.props.pathItem.armorProf} loadArmors={(armors: any) => { this.props.loadArmors(armors) }} />
                }
                {this.props.pathItem.weaponProf &&
                    <AppPathWeaponAdding weaponList={this.props.pathItem.weaponProf} loadWeapons={(weapons: any) => { this.props.loadWeapons(weapons) }} />
                }
                {this.props.pathItem.unrestrictedMagicPick &&
                    <AppPathUnrestrictedMagic magicNumber={this.props.pathItem.unrestrictedMagicPick} character={this.props.character}
                        loadUnrestrictedMagic={(magicNumber: number) => { this.props.loadUnrestrictedMagic(magicNumber) }} />
                }
                {this.props.pathItem.addMagicalAbilities &&
                    <AppAddMagicToNonMagic path={this.props.pathChosenObj} character={this.props.character} pathType={this.props.pathItem.addMagicalAbilities}
                        loadMagicalAbilities={(character: CharacterModel) => { this.props.loadCharacter(character) }} />
                }
                {this.props.pathItem.maneuvers &&
                    <AppManeuverPicker totalManeuvers={this.props.pathItem.numberOfChoices} character={this.props.character} item={this.props.pathItem.maneuvers} loadManeuvers={(val: any) => { this.props.loadManeuvers(val) }}
                        maneuversToPick={(val: boolean) => { this.props.maneuversToPick(val) }} pathChosen={this.props.pathChosen} />
                }
                {this.props.pathItem.toolsToPick &&
                    <AppToolPicker character={this.props.character} amount={this.props.pathItem.amount}
                        itemList={this.props.pathItem.toolsToPick} setAdditionalToolPicks={(val: any) => { this.props.isAdditionalToolChoice(val) }}
                        sendToolsBack={(val: any) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.fightingStyles &&
                    <AppPickFightingStyle character={this.props.character} fightingStylesToPick={(val: any) => { this.props.fightingStylesToPick(val) }}
                        loadFightingStyles={(val: any) => { this.props.loadCharacter(val) }} itemList={this.props.pathItem.fightingStyles} />
                }
                {this.props.pathItem.additionCantrip &&
                    <AppAddingPathCantrip character={this.props.character} path={this.props.pathChosen} item={this.props.pathItem} updateCantrips={(val: CharacterModel) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.druidCircleSpellLists &&
                    <AppDruidSpellPicker pickDruidCircle={(val: boolean) => { this.props.pickDruidCircle(val) }} character={this.props.character} path={this.props.pathChosenObj} items={this.props.pathItem.druidCircleSpellLists}
                        loadSpells={(val: any) => { this.props.loadCharacter(val) }} />
                }
                {(this.props.pathItem.learnLanguage || this.props.pathItem.learnSpecificLanguage) &&
                    <AppPathAddLanguage languagesToPick={(val: boolean) => { this.props.languagesToPick(val) }}
                        loadLanguage={(val: any) => { this.props.loadLanguage(val) }}
                        learnSpecificLanguage={this.props.pathItem?.learnSpecificLanguage}
                        amountOfLanguages={this.props.pathItem.learnLanguage} />
                }
                {this.props.pathItem.levelOneSpells &&
                    <AppPathFirstLevelSpellsAddition character={this.props.character} path={this.props.pathChosen} noCountAgainstKnown={this.props.pathItem.noCountAgainstKnown}
                        returnMagic={(val: any) => { this.props.loadFirstLevelSpells(val) }} />
                }
                {this.props.pathItem.specificCantrip &&
                    <AppPathAddSpecificSpell path={this.props.pathChosen} character={this.props.character} notCountAgainstKnownCantrips={this.props.pathItem.notCountAgainstKnownCantrips}
                        spell={this.props.pathItem.specificCantrip} updateSpecificSpell={(val: any) => { this.props.loadSpecificSpell(val) }} />
                }
                {this.props.pathItem.AddSpellsFromDifferentClass &&
                    <AppPathAddSpellFromDifferentClass character={this.props.character} path={this.props.pathChosen}
                        numberOfSpells={this.props.pathItem.AddSpellsFromDifferentClass.numberOfSpells} className={this.props.pathItem.AddSpellsFromDifferentClass.className}
                        spellLevel={this.props.pathItem.AddSpellsFromDifferentClass.spellLevel} loadSpellsFromOtherClasses={(val: any) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.elementList &&
                    <AppPathMonkFourElementsPicker elementsToPick={(val: any) => { this.props.elementsToPick(val) }} totalElementsToPick={this.props.pathItem.numberOfChoices}
                        loadElements={(val: any) => { this.props.loadElements(val) }} firstElement={this.props.pathItem.addElementalAttunement}
                        character={this.props.character} item={this.props.pathItem.elementList} pathChosen={this.props.pathChosen} />
                }
                {this.props.pathItem.spellsToBeAdded &&
                    <AppPathAddSpellsList path={this.props.pathChosen} character={this.props.character} spellList={this.props.pathItem.spellsToBeAdded} loadSpells={(val: CharacterModel) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.toolsToBeAdded &&
                    <AppAddSpecificTools withReplacementConditions={this.props.pathItem.withReplacementConditions}
                        character={this.props.character} path={this.props.pathChosen} setAdditionalToolPicks={(val: any) => { this.props.isAdditionalToolChoice(val) }}
                        optionalTools={this.props.pathItem.optionalTools}
                        sendToolsBack={(val: any) => { this.props.loadCharacter(val) }}
                        tools={this.props.pathItem.toolsToBeAdded} loadTools={(val: CharacterModel) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.addArmor &&
                    <AppPathAddArmorToChar character={this.props.character} path={this.props.pathChosen}
                        armor={this.props.pathItem.addArmor} armorToLoad={(val: any) => { this.props.armorToLoad(val) }} />
                }
                {this.props.pathItem.increaseMaxHp &&
                    <AppPathIncreaseMaxHp character={this.props.character} increaseNum={this.props.pathItem.increaseMaxHp}
                        loadMaxHp={(val: CharacterModel) => this.props.loadCharacter(val)} />
                }
                {this.props.pathItem.addSpellAvailability &&
                    <AppPathAddSpellPickAvailability character={this.props.character} path={this.props.pathChosen}
                        spellList={this.props.pathItem.addSpellAvailability} loadSpells={(val: any) => { this.props.addSpellAvailabilityByName(val) }} />
                }
                {this.props.pathItem.pickSpecificSpellWithChoices &&
                    <AppPickSpecificSpellWithChoices character={this.props.character} spell={this.props.pathItem.pickSpecificSpellWithChoices}
                        updateSpells={(val: CharacterModel) => { this.props.loadCharacter(val) }} />
                }
                {this.props.pathItem.spellListWithLimiter &&
                    <AppAddSpellChoice character={this.props.character} spellListWithLimiter={this.props.pathItem.spellListWithLimiter}
                        updateSpellList={(spellList: any) => { this.props.updateSpellList(spellList) }} />
                }
                {this.props.pathItem.savingThrowList &&
                    <AppSavingThrowPathAdder returnSavingThrows={(val: string[]) => this.props.returnSavingThrows(val)} character={this.props.character} pathChosen={this.props.pathChosen} itemList={this.props.pathItem.savingThrowList} amount={this.props.pathItem.saveThrowPickNumber}
                        withConditions={this.props.pathItem.withConditions} setAdditionalSaveThrowPicks={(val: boolean) => { this.props.isAdditionalSkillChoice(val) }} extraSavingThrowsTotal={this.props.pathItem.extraSavingThrowsTotal} />
                }
                {this.props.pathItem.addExactSkillProficiency &&
                    <AppAddExactSkillProf skillsStartAsExpertise={this.props.pathItem.skillsStartAsExpertise} character={this.props.character} skillList={this.props.pathItem.addExactSkillProficiency} />
                }
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {

    }
});