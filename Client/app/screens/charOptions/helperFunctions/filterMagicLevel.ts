import { CharacterModel } from "../../../models/characterModel";



export function filterMagicLevel(character: CharacterModel, spells: any[]) {
    const cantrip = character.magic.cantrips ? 'cantrip' : null;
    const firstLevel = character.magic.firstLevelSpells ? '1st-level' : null;
    const secondLevel = character.magic.secondLevelSpells ? '2nd-level' : null;
    const thirdLevel = character.magic.thirdLevelSpells ? '3rd-level' : null;
    const forthLevel = character.magic.forthLevelSpells ? '4th-level' : null;
    const fifthLevel = character.magic.fifthLevelSpells ? '5th-level' : null;
    const sixthLevel = character.magic.sixthLevelSpells ? '6th-level' : null;
    const seventhLevel = character.magic.seventhLevelSpells ? '7th-level' : null;
    const eighthLevel = character.magic.eighthLevelSpells ? '8th-level' : null;
    const ninthLevel = character.magic.ninthLevelSpells ? '9th-level' : null;
    spells = spells.filter((spell) => spell.type.includes(cantrip) || spell.type.includes(firstLevel) || spell.type.includes(secondLevel)
        || spell.type.includes(thirdLevel) || spell.type.includes(forthLevel) || spell.type.includes(fifthLevel) || spell.type.includes(sixthLevel) || spell.type.includes(seventhLevel)
        || spell.type.includes(eighthLevel) || spell.type.includes(ninthLevel));
    return spells;
}