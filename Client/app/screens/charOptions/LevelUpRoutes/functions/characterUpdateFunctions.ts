import AsyncStorage from '@react-native-async-storage/async-storage';
import spellsJSON from '../../../../../jsonDump/spells.json'
import logger from '../../../../../utility/logger';
import { CharacterModel } from '../../../../models/characterModel';
import { spellLevelChanger } from '../../helperFunctions/SpellLevelChanger';
import * as Path from "../../../../../jsonDump/paths.json"
import { PathFeatureOrganizer } from '../../helperFunctions/PathFeatureOrganizer';


const loadSpellsFromList = (character: CharacterModel, spellListToLoad: any) => {
    for (let item of spellListToLoad.spells) {
        const spell = spellsJSON.find(spell => spell.name === item)
        if (spell && character.spells) {
            const spellLevel = spellLevelChanger(spell.level)
            character.spells[spellLevel].push({ spell: spell, removable: false });
        }
    }
    return character
}

const addSpellAvailabilityByName = (character: CharacterModel, spellAvailability: string[]) => {
    for (let item of spellAvailability) {
        if (character.addSpellAvailabilityByName) {
            character.addSpellAvailabilityByName.push(item)
        }
    }
    return character
}


const addPathArmor = async (armorToLoad: any, character: CharacterModel) => {
    try {
        let armorList = await AsyncStorage.getItem(`${character._id}ArmorList`);
        if (!armorList) {
            const armorList = [armorToLoad]
            AsyncStorage.setItem(`${character._id}ArmorList`, JSON.stringify(armorList))
            return;
        }
        const newArmorList = JSON.parse(armorList)
        newArmorList.push(armorToLoad)
        AsyncStorage.setItem(`${character._id}ArmorList`, JSON.stringify(newArmorList))
    } catch (err) {
        logger.log(new Error(err))
    }
}

const newPathFirstLevelMagic = (newPathSpells: any, spellsKnown: number, character: CharacterModel) => {
    if (character.spells) {
        for (let spell of newPathSpells.newSpells) {
            const spellLevel = spellLevelChanger(spell.level)
            character.spells[spellLevel].push({ spell: spell, removable: false });
        }
        character.spellsKnown = spellsKnown
    }

    return character
}

const loadPathElements = (character: CharacterModel, elements: any) => {
    if (character.charSpecials?.monkElementsDisciplines) {
        character.charSpecials.monkElementsDisciplines = elements
    }
    return character
}

const loadPathBattleManuevers = (character: CharacterModel, manuevers: any) => {
    if (character.charSpecials?.battleMasterManeuvers) {
        character.charSpecials.battleMasterManeuvers = manuevers
    }
    return character
}

const loadPathSavingThrows = (character: CharacterModel, saveThrow: string) => {
    if (character.savingThrows) {
        character.savingThrows.push(saveThrow)
    }
    return character
}

const loadPathUnrestrictedMagic = (character: CharacterModel, magicNumber: number) => {
    character.unrestrictedKnownSpells = (character.unrestrictedKnownSpells ? character.unrestrictedKnownSpells : 0) + magicNumber;
    return character
}

const loadPathSpecificSpell = (character: CharacterModel, specificSpell: any) => {
    if (specificSpell.notCountAgainstKnownCantrips) {
        if (character.magic && character.magic.cantrips) {
            character.magic.cantrips = character.magic.cantrips + 1;
        }
    }
    const spell = spellsJSON.find(spell => spell.name === specificSpell.name)
    if (spell && character.spells) {
        const spellLevel = spellLevelChanger(spell.level)
        character.spells[spellLevel].push({ spell: spell, removable: false });
    }
    return character
}

const addPathLanguages = (character: CharacterModel, languages: any) => {
    const langHolder: any[] = []
    languages.forEach((lang: any) => {
        let index = langHolder.indexOf(lang.slice(0, -1)) || langHolder.indexOf(lang)
        index > 0 ? langHolder[index] = lang : langHolder.push(lang)
    })
    for (let item of langHolder) {
        if (character.languages) {
            character.languages.push(item)
        }
    }
    return character
}


const addPathWeaponProficiency = (character: CharacterModel, weapons: string[]) => {
    for (let item of weapons) {
        if (character.addedWeaponProf) {
            character.addedWeaponProf.push(item)
        }
    }
    return character
}

const addPathArmorProficiency = (character: CharacterModel, armors: string[]) => {
    for (let item of armors) {
        if (character.addedArmorProf) {
            character.addedArmorProf.push(item)
        }
    }
    return character
}


export {
    loadSpellsFromList, addSpellAvailabilityByName, addPathArmor, loadPathUnrestrictedMagic,
    loadPathSpecificSpell, addPathLanguages, addPathWeaponProficiency, addPathArmorProficiency,
    newPathFirstLevelMagic, loadPathElements, loadPathBattleManuevers, loadPathSavingThrows,

}