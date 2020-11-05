import { CharacterModel } from "../app/models/characterModel";

export function extraPathChoiceNumbers(character: CharacterModel, level: number) {
    let result: number = null;
    switch (true) {
        case character.characterClass === "Barbarian" && level === 3:
            result = 1
            break;
        case character.characterClass === "Barbarian" && level === 6:
            result = 1
            break;
        case character.characterClass === "Barbarian" && level === 14:
            result = 1
            break;
        case character.characterClass === "Fighter" && level === 3:
            result = 3
        case character.characterClass === "Fighter" && level === 7:
            result = 2
        case character.characterClass === "Fighter" && level === 10:
            result = 2
        case character.characterClass === "Fighter" && level === 15:
            result = 2
        case character.characterClass === "Monk" && level === 3:
            result = 2
            break;
        case character.characterClass === "Monk" && level === 6:
            result = 1
            break;
        case character.characterClass === "Monk" && level === 11:
            result = 1
            break;
        case character.characterClass === "Monk" && level === 17:
            result = 1
            break;
        case character.characterClass === "Ranger" && level === 3:
            result = 1
            break;
        case character.characterClass === "Ranger" && level === 7:
            result = 1
            break;
        case character.characterClass === "Ranger" && level === 11:
            result = 1
            break;
        case character.characterClass === "Ranger" && level === 15:
            result = 1
            break;
        case character.characterClass === "Sorcerer" && level === 1:
            result = 1
            break;
    }
    return result;
}