import druidSpells from '../../jsonDump/druidLandCircleSpells.json'
import { CharacterModel } from '../models/characterModel';

export function druidCircleSpellsPicker(level: number, druidCircle: string, character: CharacterModel) {
    const spells = druidSpells.druidCircleSpellLists[druidCircle][level].spellList;
    return spells
}