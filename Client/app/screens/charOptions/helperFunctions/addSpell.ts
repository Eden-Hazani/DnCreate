import { boolean } from "yup";
import { CharacterModel } from "../../../models/characterModel";


export function addSpell(spellLevel: string, character: CharacterModel) {
    if (character.characterClass === "Warlock") {
        let result: boolean = false
        switch (true) {
            case character.magic.cantrips && spellLevel.includes('cantrip'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '1st' && spellLevel.includes('1st-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '2nd' && spellLevel.includes('2nd-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '3rd' && spellLevel.includes('3rd-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '4th' && spellLevel.includes('4th-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '5th' && spellLevel.includes('5th-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '6th' && spellLevel.includes('6th-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '7th' && spellLevel.includes('7th-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '8th' && spellLevel.includes('8th-level'):
                result = true;
                break;
            case character.charSpecials.warlockSpellSlotLevel === '9th' && spellLevel.includes('9th-level'):
                result = true;
                break;
        }
        return result
    }
    if (character.characterClass !== "Warlock") {
        const cantrip = character.magic.cantrips ? 'cantrip' : null;
        const firstLevel = character.magic.firstLevelSpells ? '1st-level' : null;
        const secondLevel = character.magic.secondLevelSpells ? '2nd-level' : null;
        const thirdLevel = character.magic.thirdLevelSpells ? '3rd-level' : null;
        const forthLevel = character.magic.forthLevelSpells ? '4th-level' : null;
        const fifthLevel = character.magic.fifthLevelSpells ? '5th-level' : null;
        const sixthLevel = character.magic.sixthLevelSpells ? '6th-level' : null;
        const seventhLevel = character.magic.seventhLevelSpells ? '7th-level' : null;
        const eighthLevel = character.magic.eighthLevelSpells ? '8th-level' : null;
        const ninthLevel = character.magic.ninthLevelSpells ? '9th-level' : null;
        if (
            spellLevel.includes(cantrip) || spellLevel.includes(firstLevel) || spellLevel.includes(secondLevel)
            || spellLevel.includes(thirdLevel) || spellLevel.includes(forthLevel) || spellLevel.includes(fifthLevel) || spellLevel.includes(sixthLevel) || spellLevel.includes(seventhLevel)
            || spellLevel.includes(eighthLevel) || spellLevel.includes(ninthLevel)
        ) {
            return true
        }
        return false;
    }
}