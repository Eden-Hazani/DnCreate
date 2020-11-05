import { CharacterModel } from "../../../models/characterModel";
import { spellLevelChanger } from "./SpellLevelChanger";


export function checkHigherWarlockSpells(character: CharacterModel, spell: any) {
    const spellLevel = spellLevelChanger(spell.level);
    if (spellLevel === 'sixthLevelSpells' || spellLevel === 'seventhLevelSpells' || spellLevel === 'eighthLevelSpells' || spellLevel === 'ninthLevelSpells')
        if (character.spells[spellLevel].length > 0) {
            return false
        }
    return true;
}