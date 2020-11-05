import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import { CharacterModel } from '../models/characterModel';

export function clericDomainSpellsPicker(level: number, domain: string, character: CharacterModel) {
    const spells = spellsList.Cleric[domain][level].spellList;
    return spells
}