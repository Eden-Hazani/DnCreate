import { boolean } from "yup";
import { CharacterModel } from "../../../models/characterModel";


export function addSpell(spellLevel: string, character: CharacterModel) {
    if (character.characterClass === "Warlock") {
        let slots = [];
        const warSlotLevel = parseInt(character.charSpecials && character.charSpecials.warlockSpellSlotLevel ? character.charSpecials.warlockSpellSlotLevel.substring(0) : "0");
        for (let i = 1; i <= warSlotLevel; i++) {
            slots.push(i);
        }
        console.log(warSlotLevel)
        let result: boolean = false
        switch (true) {
            case character.magic && character.magic.cantrips && spellLevel.includes('cantrip'):
                result = true;
                break;
            case spellLevel.includes('1st-level'):
                for (let item of slots) {
                    if (item >= 1) result = true;
                }
                break;
            case spellLevel.includes('2nd-level'):
                for (let item of slots) {
                    if (item >= 2) result = true;
                }
                break;
            case spellLevel.includes('3rd-level'):
                for (let item of slots) {
                    if (item >= 3) result = true;
                }
                break;
            case spellLevel.includes('4th-level'):
                for (let item of slots) {
                    if (item >= 4) result = true;
                }
                break;
            case spellLevel.includes('5th-level'):
                for (let item of slots) {
                    if (item >= 5) result = true;
                }
                break;
            case spellLevel.includes('6th-level'):
                for (let item of slots) {
                    if (item >= 6) result = true;
                }
                break;
            case spellLevel.includes('7th-level'):
                for (let item of slots) {
                    if (item >= 7) result = true;
                }
                break;
            case spellLevel.includes('8th-level'):
                for (let item of slots) {
                    if (item >= 8) result = true;
                }
                break;
            case spellLevel.includes('9th-level'):
                for (let item of slots) {
                    if (item >= 9) result = true;
                }
                break;
        }
        return result
    }
    if (character.characterClass !== "Warlock") {
        const cantrip = character.magic !== undefined && character.magic.cantrips ? 'cantrip' : "null";
        const firstLevel = character.magic !== undefined && character.magic.firstLevelSpells ? '1st-level' : "null";
        const secondLevel = character.magic !== undefined && character.magic.secondLevelSpells ? '2nd-level' : "null";
        const thirdLevel = character.magic !== undefined && character.magic.thirdLevelSpells ? '3rd-level' : "null";
        const forthLevel = character.magic !== undefined && character.magic.forthLevelSpells ? '4th-level' : "null";
        const fifthLevel = character.magic !== undefined && character.magic.fifthLevelSpells ? '5th-level' : "null";
        const sixthLevel = character.magic !== undefined && character.magic.sixthLevelSpells ? '6th-level' : "null";
        const seventhLevel = character.magic !== undefined && character.magic.seventhLevelSpells ? '7th-level' : "null";
        const eighthLevel = character.magic !== undefined && character.magic.eighthLevelSpells ? '8th-level' : "null";
        const ninthLevel = character.magic !== undefined && character.magic.ninthLevelSpells ? '9th-level' : "null";
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