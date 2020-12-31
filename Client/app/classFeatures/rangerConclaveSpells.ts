import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';

export function rangerConclaveSpells(level: number, domain: string, character: CharacterModel) {
    try {
        const spells = spellsList.Ranger[domain][level].spellList;
        return spells
    } catch (err) {
        logger.log(err)
    }
}