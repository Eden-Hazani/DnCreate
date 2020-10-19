import { CharacterModel } from "../../../models/characterModel";
import { spellLevelChanger } from "./SpellLevelChanger";


export function checkSpellSlots(character: CharacterModel, spell: any) {
    const spellLevel = spellLevelChanger(spell.level);
    const totalKnownSpells = character.spells.cantrips.concat(character.spells.firstLevelSpells, character.spells.secondLevelSpells, character.spells.thirdLevelSpells,
        character.spells.forthLevelSpells, character.spells.fifthLevelSpells, character.spells.sixthLevelSpells, character.spells.seventhLevelSpells,
        character.spells.eighthLevelSpells, character.spells.ninthLevelSpells)
    console.log(totalKnownSpells.length)
    if (!spell.classes.includes(character.characterClass.toLowerCase())) {
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
        || character.characterClass === 'Ranger')) {
        return 'maxKnownSpells'
    }
    return true
}