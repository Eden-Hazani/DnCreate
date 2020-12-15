import { CharacterModel } from "../../../models/characterModel";
import { SpellsModel } from "../../../models/spellsModel";
import { spellLevelChanger } from "./SpellLevelChanger";


export function checkHigherWarlockSpells(character: CharacterModel, spell: any) {
    let charSpells: any = new SpellsModel()
    if (character.spells) {
        charSpells = character.spells
    }
    const spellLevel = spellLevelChanger(spell.level);
    if (spellLevel === 'sixthLevelSpells' || spellLevel === 'seventhLevelSpells' || spellLevel === 'eighthLevelSpells' || spellLevel === 'ninthLevelSpells')
        if (charSpells[spellLevel].length > 0) {
            return false
        }
    return true;
}