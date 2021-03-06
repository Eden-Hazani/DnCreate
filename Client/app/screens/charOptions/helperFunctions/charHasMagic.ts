import { CharacterModel } from "../../../models/characterModel";
import { addRacialSpells } from "./addRacialSpells";


export function charHasMagic(character: CharacterModel) {
    if (character.spells && character.magic && character.race) {
        const spells = Object.values(character.spells);
        const magic = Object.values(character.magic);
        for (let item of spells) {
            if (item.length > 0) {
                return true
            }
        }
        if (character.spellCastingClass === "Barbarian" || character.spellCastingClass === "Monk" || character.spellCastingClass === "Fighter" || character.spellCastingClass === "Rouge") {
            return false
        }
        for (let item of magic) {
            if (item !== null) {
                return true
            }
        }
    }
    return false
}