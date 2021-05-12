import { CharacterModel } from "../../../../models/characterModel";
import { MagicModel } from "../../../../models/magicModel";
import { RaceModel } from "../../../../models/raceModel";
import { addRacialSpells } from "../../helperFunctions/addRacialSpells";
import { setTotalKnownSpells } from "../../helperFunctions/setTotalKnownSpells";
import { spellLevelChanger } from "../../helperFunctions/SpellLevelChanger";
import spellsJSON from '../../../../../jsonDump/spells.json'
import { store } from "../../../../redux/store";
import { ActionType } from "../../../../redux/action-type";
import { SpellsModel } from "../../../../models/spellsModel";


const levelUpMagic = (character: CharacterModel, spellSlotLevel: string, spellSlots: number, sorceryPoints: number, spellsKnown: number, cantrips: number, spells: number[]) => {
    if (spellSlotLevel && character.charSpecials !== undefined) {
        character.charSpecials.warlockSpellSlotLevel = spellSlotLevel;
    }
    if (spellSlots && character.charSpecials !== undefined) {
        character.charSpecials.warlockSpellSlots = spellSlots;
    }
    if (sorceryPoints && character.charSpecials !== undefined) {
        character.charSpecials.sorceryPoints = sorceryPoints;
    }
    if (spellsKnown) {
        character.spellsKnown = spellsKnown
    }
    if (!spellsKnown) {
        const spellsKnown = setTotalKnownSpells(character);
        character.spellsKnown = spellsKnown;
    }
    character.magic = new MagicModel();
    character.magic.cantrips = cantrips;
    if (character.characterClass !== 'Warlock') {
        character.magic.firstLevelSpells = spells[0];
        character.magic.secondLevelSpells = spells[1];
        character.magic.thirdLevelSpells = spells[2];
        character.magic.forthLevelSpells = spells[3];
        character.magic.fifthLevelSpells = spells[4];
        character.magic.sixthLevelSpells = spells[5];
        character.magic.seventhLevelSpells = spells[6];
        character.magic.eighthLevelSpells = spells[7];
        character.magic.ninthLevelSpells = spells[8];
    }
    console.log(character.magic)
    character = raceMagic(character)
    return character
}


const raceMagic = (character: CharacterModel) => {
    if (character.race !== undefined) {
        if (!character.spells) {
            character.spells = new SpellsModel()
        }
        addRacialSpells(character.raceId || new RaceModel(), character).forEach(item => {
            const spell = spellsJSON.find(spell => spell.name === item)
            if (spell && character.spells !== undefined && character.magic !== undefined && character.magic !== undefined) {
                const spellLevel = spellLevelChanger(spell.level)
                console.log(character.spells[spellLevel])
                character.spells[spellLevel].push({ spell: spell, removable: false });
                character.spellsKnown = (parseInt(character.spellsKnown) + 1).toString()
                character.magic[spellLevel] = character.magic[spellLevel] + 1;
            }
        })
        console.log(character.spells.cantrips)
        return character
    }
    return character
}

export { levelUpMagic }