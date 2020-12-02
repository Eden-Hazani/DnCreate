import spellsList from '../../jsonDump/PathSpellAdditionLists.json'

export function druidPathSpellPicker(level: number, path: string,) {
    const spells = spellsList.Druid[path][level].spellList;
    return spells
}