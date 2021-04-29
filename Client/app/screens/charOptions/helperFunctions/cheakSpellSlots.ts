import { CharacterModel } from "../../../models/characterModel";
import { MagicModel } from "../../../models/magicModel";
import { SpellsModel } from "../../../models/spellsModel";
import { spellLevelChanger } from "./SpellLevelChanger";


function checkSpellSlots(character: CharacterModel, spell: any) {
    let charSpells: any = new SpellsModel()
    let spellCastingClass: string = "";
    let charMagic: any = new MagicModel()
    if (character.spellCastingClass) {
        spellCastingClass = character.spellCastingClass
    }
    if (character.magic) {
        charMagic = character.magic
    }
    if (character.spells) {
        charSpells = character.spells
    }
    const spellLevel = spellLevelChanger(spell.level);
    const totalKnownSpells = charSpells.firstLevelSpells.concat(charSpells.secondLevelSpells, charSpells.thirdLevelSpells,
        charSpells.forthLevelSpells, charSpells.fifthLevelSpells, charSpells.sixthLevelSpells, charSpells.seventhLevelSpells,
        charSpells.eighthLevelSpells, charSpells.ninthLevelSpells)
    if (!spell.classes.includes(spellCastingClass.toLowerCase())) {
        return 'wrongClass'
    }
    for (let item of charSpells[spellLevel]) {
        if (item.name === spell.name) {
            return 'spellAlreadyPicked'
        }
    }
    if (spell.level === 'cantrip') {
        if (charMagic.cantrips === charSpells.cantrips.length) {
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
    console.log(spell)
    const spellLevel = spellLevelChanger(spell.level);
    if (character.spells) {
        for (let item of character.spells[spellLevel]) {
            if (item.spell.name === spell.name) {
                return false
            }
        }
    }
    return true
}

function checkAvailableKnownSpells(character: CharacterModel) {
    if (character.spells !== undefined && character.spells.firstLevelSpells !== undefined) {
        const totalKnownSpells = character.spells.firstLevelSpells.concat(character.spells.secondLevelSpells, character.spells.thirdLevelSpells,
            character.spells.forthLevelSpells, character.spells.fifthLevelSpells, character.spells.sixthLevelSpells, character.spells.seventhLevelSpells,
            character.spells.eighthLevelSpells, character.spells.ninthLevelSpells);
        return parseInt(character.spellsKnown) - totalKnownSpells.length
    }
    return 0
}

export { checkOnlyIfPicked, checkSpellSlots, checkAvailableKnownSpells }