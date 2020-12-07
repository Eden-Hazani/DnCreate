import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import { CharacterModel } from '../models/characterModel';

export function rangerConclaveSpells(level: number, domain: string, character: CharacterModel) {
    const spells = spellsList.Ranger[domain][level].spellList;
    return spells
}