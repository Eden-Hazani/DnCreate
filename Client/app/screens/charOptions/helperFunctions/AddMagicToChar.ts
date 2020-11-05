import { CharacterModel } from "../../../models/characterModel";
import { MagicModel } from "../../../models/magicModel";


export function addMagicToChar(character: CharacterModel, pathType: string) {
    const newCharacter: CharacterModel = JSON.parse(JSON.stringify(character))
    if (pathType === 'Eldritch Knight') {
        newCharacter.spellCastingClass = 'Wizard'
        newCharacter.magic = new MagicModel();
        newCharacter.magic.firstLevelSpells = 2;
        newCharacter.magic.secondLevelSpells = 0;
        newCharacter.magic.thirdLevelSpells = 0;
        newCharacter.magic.forthLevelSpells = 0;
        newCharacter.magic.fifthLevelSpells = 0;
        newCharacter.magic.sixthLevelSpells = 0;
        newCharacter.magic.seventhLevelSpells = 0;
        newCharacter.magic.eighthLevelSpells = 0;
        newCharacter.magic.ninthLevelSpells = 0;
        newCharacter.spellsKnown = 3;
        newCharacter.magic.cantrips = 2;
    }
    if (pathType === 'Arcane Trickster') {
        newCharacter.spellCastingClass = 'Wizard'
        newCharacter.magic = new MagicModel();
        newCharacter.magic.firstLevelSpells = 2;
        newCharacter.magic.secondLevelSpells = 0;
        newCharacter.magic.thirdLevelSpells = 0;
        newCharacter.magic.forthLevelSpells = 0;
        newCharacter.magic.fifthLevelSpells = 0;
        newCharacter.magic.sixthLevelSpells = 0;
        newCharacter.magic.seventhLevelSpells = 0;
        newCharacter.magic.eighthLevelSpells = 0;
        newCharacter.magic.ninthLevelSpells = 0;
        newCharacter.spellsKnown = 3;
        newCharacter.magic.cantrips = 3;
    }

    return newCharacter;
}