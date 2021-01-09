import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';

export function paladinOathSpellsPicker(level: number, domain: string, character: CharacterModel) {
    try {
        const spells = spellsList.Paladin[domain][level].spellList;
        return spells
    } catch (err) {
        logger.log(new Error(err))
    }
}