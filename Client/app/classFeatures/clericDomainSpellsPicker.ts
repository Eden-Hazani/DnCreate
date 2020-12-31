import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import logger from '../../utility/logger';
import { CharacterModel } from '../models/characterModel';

export function clericDomainSpellsPicker(level: number, domain: string, character: CharacterModel) {
    try {
        const spells = spellsList.Cleric[domain][level].spellList;
        return spells
    } catch (err) {
        logger.log(err)
    }
}