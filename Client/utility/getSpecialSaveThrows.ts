import { CharacterModel } from "../app/models/characterModel";


export function getSpecialSaveThrows(character: CharacterModel) {
    let saveThrows = character.characterClassId.savingThrows;
    switch (true) {
        case character.characterClass === 'Rogue' && character.level === 15:
            saveThrows.push('Wisdom')
            break;

        default: saveThrows;
    }
    return saveThrows
}