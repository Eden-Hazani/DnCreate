import { CharacterModel } from "../../../models/characterModel";

export function filterMagicLevel(character: CharacterModel, spells: any[]) {
    if (character.characterClass === "Warlock") {
        const filteredSpells: any = [];
        let filtered: any = [];
        for (let item of spells) {
            if (item === undefined) {
                continue
            }
            if (item.level === 'cantrip') {
                filteredSpells.push(item)
            }
            for (let i = 1; i <= parseInt((character.charSpecials && character.charSpecials.warlockSpellSlotLevel) ? character.charSpecials.warlockSpellSlotLevel.charAt(0) : "0"); i++) {
                item === undefined ? null : +item.level === i && filteredSpells.push(item)
            }
        }
        spells = filteredSpells
    }
    if (character.characterClass !== "Warlock") {
        const cantrip = character.magic !== undefined && character.magic.cantrips ? 'cantrip' : null;
        const firstLevel = character.magic !== undefined && character.magic.firstLevelSpells ? '1st-level' : null;
        const secondLevel = character.magic !== undefined && character.magic.secondLevelSpells ? '2nd-level' : null;
        const thirdLevel = character.magic !== undefined && character.magic.thirdLevelSpells ? '3rd-level' : null;
        const forthLevel = character.magic !== undefined && character.magic.forthLevelSpells ? '4th-level' : null;
        const fifthLevel = character.magic !== undefined && character.magic.fifthLevelSpells ? '5th-level' : null;
        const sixthLevel = character.magic !== undefined && character.magic.sixthLevelSpells ? '6th-level' : null;
        const seventhLevel = character.magic !== undefined && character.magic.seventhLevelSpells ? '7th-level' : null;
        const eighthLevel = character.magic !== undefined && character.magic.eighthLevelSpells ? '8th-level' : null;
        const ninthLevel = character.magic !== undefined && character.magic.ninthLevelSpells ? '9th-level' : null;
        spells = spells.filter((spell) => spell.type.includes(cantrip) || spell.type.includes(firstLevel) || spell.type.includes(secondLevel)
            || spell.type.includes(thirdLevel) || spell.type.includes(forthLevel) || spell.type.includes(fifthLevel) || spell.type.includes(sixthLevel) || spell.type.includes(seventhLevel)
            || spell.type.includes(eighthLevel) || spell.type.includes(ninthLevel));

    }
    return spells;
}