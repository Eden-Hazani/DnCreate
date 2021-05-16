import { CharacterModel } from '../app/models/characterModel'
import * as scoresJson from '../jsonDump/spellCastingScores.json'
import logger from './logger';


export function SpellCastingSwitch(character: CharacterModel, currentProficiency: number) {
    try {

        let spellcastingAbility: any = 'none';
        let baseSpellSaveDc: any = 'none';
        let baseSpellAttackModifier: any = 'none'
        let spellSaveDc: number = 0;
        let spellAttackModifier: number = 0
        if (character.modifiers && character.race) {
            if (character.spellCastingClass && scoresJson[character.spellCastingClass]) {
                baseSpellSaveDc = scoresJson[character.spellCastingClass].baseSpellSaveDc || scoresJson[character.characterClass].baseSpellSaveDc || scoresJson[character.path?.name]?.baseSpellSaveDc || scoresJson[character.race]?.baseSpellSaveDc
                spellcastingAbility = scoresJson[character.spellCastingClass].spellcastingAbility || scoresJson[character.characterClass]?.spellcastingAbility || scoresJson[character.path?.name]?.spellcastingAbility || scoresJson[character.race]?.spellcastingAbility || 'none'
                baseSpellAttackModifier = scoresJson[character.spellCastingClass].spellAttackModifier || scoresJson[character.characterClass]?.spellAttackModifier || scoresJson[character.path?.name]?.spellAttackModifier || scoresJson[character.race]?.spellAttackModifier || 'none'
            }
            const modifiers = [['wisdom', character.modifiers.wisdom], ['strength', character.modifiers.strength],
            ['dexterity', character.modifiers.dexterity], ['constitution', character.modifiers.constitution], ['intelligence', character.modifiers.intelligence], ['charisma', character.modifiers.charisma]]

            if (baseSpellAttackModifier === undefined) {
                baseSpellAttackModifier = "none"
            }
            if (baseSpellAttackModifier !== "none") {
                let proficiency = 0;
                let modifier: any = "0";
                const item = baseSpellAttackModifier.split('+');
                if (item[0] === 'proficiency') {
                    proficiency = currentProficiency;
                }
                modifiers.forEach(v => v[0] === item[1] ? modifier = v[1] : 0)
                spellAttackModifier = proficiency + parseInt(modifier)

            }

            if (baseSpellSaveDc === undefined) {
                baseSpellSaveDc = "none"
            }

            if (baseSpellSaveDc !== "none") {
                for (let item of baseSpellSaveDc.split('+')) {
                    if (item === 'proficiency') {
                        item = currentProficiency;
                    }
                    modifiers.forEach(v => v[0] === item ? item = v[1] : 0)
                    spellSaveDc = spellSaveDc + parseInt(item)
                }
            }
        }
        return { spellcastingAbility, spellSaveDc, spellAttackModifier }
    } catch (err) {
        logger.log(new Error(err))
        const spellcastingAbility = 'none';
        const spellSaveDc = 0;
        const spellAttackModifier = 0;
        return { spellcastingAbility, spellSaveDc, spellAttackModifier }

    }

}