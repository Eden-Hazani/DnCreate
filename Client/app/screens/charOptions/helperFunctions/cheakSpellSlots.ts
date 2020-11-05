import { CharacterModel } from "../../../models/characterModel";
import { spellLevelChanger } from "./SpellLevelChanger";


function checkSpellSlots(character: CharacterModel, spell: any) {
    const spellLevel = spellLevelChanger(spell.level);
    const totalKnownSpells = character.spells.firstLevelSpells.concat(character.spells.secondLevelSpells, character.spells.thirdLevelSpells,
        character.spells.forthLevelSpells, character.spells.fifthLevelSpells, character.spells.sixthLevelSpells, character.spells.seventhLevelSpells,
        character.spells.eighthLevelSpells, character.spells.ninthLevelSpells)
    if (!spell.classes.includes(character.spellCastingClass.toLowerCase())) {
        return 'wrongClass'
    }
    for (let item of character.spells[spellLevel]) {
        if (item.name === spell.name) {
            return 'spellAlreadyPicked'
        }
    }
    if (spell.level === 'cantrip') {
        if (character.magic.cantrips === character.spells.cantrips.length) {
            return 'maxCantrips'
        }
    }
    if (totalKnownSpells.length === parseInt(character.spellsKnown) && (character.characterClass === 'Wizard' || character.characterClass === 'Cleric' || character.characterClass === 'Paladin'
        || character.characterClass === 'Druid')) {
        return 'maxPreparedSpells'
    }
    if (totalKnownSpells.length === parseInt(character.spellsKnown) && (character.characterClass === 'Sorcerer' || character.characterClass === 'Warlock' || character.characterClass === 'Bard'
        || character.characterClass === 'Ranger' || character.path.name === "Arcane Trickster" || character.path.name === "Eldritch Knight")) {
        return 'maxKnownSpells'
    }
    return true
}


function checkOnlyIfPicked(character: CharacterModel, spell: any) {
    const spellLevel = spellLevelChanger(spell.level);
    for (let item of character.spells[spellLevel]) {
        if (item.spell.name === spell.name) {
            return false
        }
    }
    return true
}

function checkAvailableKnownSpells(character: CharacterModel) {
    const totalKnownSpells = character.spells.firstLevelSpells.concat(character.spells.secondLevelSpells, character.spells.thirdLevelSpells,
        character.spells.forthLevelSpells, character.spells.fifthLevelSpells, character.spells.sixthLevelSpells, character.spells.seventhLevelSpells,
        character.spells.eighthLevelSpells, character.spells.ninthLevelSpells);
    return parseInt(character.spellsKnown) - totalKnownSpells.length
}

export { checkOnlyIfPicked, checkSpellSlots, checkAvailableKnownSpells }