import druidSpells from '../../jsonDump/druidLandCircleSpells.json'
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';

export function druidCircleSpellsPicker(level: number, druidCircle: string, character: CharacterModel) {
    try {
        const spells = druidSpells.druidCircleSpellLists[druidCircle][level].spellList;
        return spells
    } catch (err) {
        logger.log(err)
    }
}