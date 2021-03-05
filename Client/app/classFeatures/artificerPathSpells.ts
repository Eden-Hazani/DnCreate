import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';

export function artificerPathSpells(level: number, domain: string, character: CharacterModel) {
    try {
        const spells = spellsList.Artificer[domain][level].spellList;
        return spells
    } catch (err) {
        logger.log(new Error(err))
    }
}