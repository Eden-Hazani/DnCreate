import { CharacterModel } from "../../../../models/characterModel"

const turnOnAlwayExpertise = (character: CharacterModel) => {
    if (character.charSpecials)
        character.charSpecials.alwaysOnToolExpertise = true
    return character;
}

export { turnOnAlwayExpertise }