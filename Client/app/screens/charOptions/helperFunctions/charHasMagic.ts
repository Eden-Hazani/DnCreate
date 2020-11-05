import { CharacterModel } from "../../../models/characterModel";


export function charHasMagic(character: CharacterModel) {
    const spells = Object.values(character.spells);
    const magic = Object.values(character.magic);
    for (let item of spells) {
        if (item.length > 0) {
            return true
        }
    }
    for (let item of magic) {
        if (item !== null) {
            return true
        }
    }
    return false
}