import { CharacterModel } from "../../../models/characterModel";
import { MagicModel } from "../../../models/magicModel";


export function addMagicToChar(character: CharacterModel, pathType: string, fullPath: any) {
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
    if (pathType === "Custom") {
        newCharacter.spellCastingClass = fullPath.levelUpChart[character.level as any][1].spellCastingClass
        newCharacter.magic = new MagicModel();
        newCharacter.magic.firstLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[0];
        newCharacter.magic.secondLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[1];
        newCharacter.magic.thirdLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[2];
        newCharacter.magic.forthLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[3];
        newCharacter.magic.fifthLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[4];
        newCharacter.magic.sixthLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[5];
        newCharacter.magic.seventhLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[6];
        newCharacter.magic.eighthLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[7];
        newCharacter.magic.ninthLevelSpells = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spells[8];
        newCharacter.spellsKnown = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].spellsKnown;
        newCharacter.magic.cantrips = fullPath.levelUpChart[character.level as any][1].customUserMagicLists[character.level as any].cantrips;
    }

    return newCharacter;
}