import spellsList from '../../jsonDump/PathSpellAdditionLists.json'
import logger from '../../utility/logger';

export function druidPathSpellPicker(level: number, path: string,) {
    try {
        const spells = spellsList.Druid[path][level].spellList;
        return spells
    } catch (err) {
        logger.log(err)
    }
}