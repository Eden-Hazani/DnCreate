import { CharacterModel } from "../../../models/characterModel";


export function addSpell(spellLevel: string, character: CharacterModel) {
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
    if (
        spellLevel.includes(cantrip) || spellLevel.includes(firstLevel) || spellLevel.includes(secondLevel)
        || spellLevel.includes(thirdLevel) || spellLevel.includes(forthLevel) || spellLevel.includes(fifthLevel) || spellLevel.includes(sixthLevel) || spellLevel.includes(seventhLevel)
        || spellLevel.includes(eighthLevel) || spellLevel.includes(ninthLevel)
    ) {
        return true
    }
    return false;
}