import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import { CharacterModel } from '../models/characterModel';

export function paladinOathSpellsPicker(level: number, domain: string, character: CharacterModel) {
    const spells = spellsList.Paladin[domain][level].spellList;
    return spells
}