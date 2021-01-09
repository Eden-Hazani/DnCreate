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
            baseSpellSaveDc = scoresJson[character.characterClass]?.baseSpellSaveDc || scoresJson[character.path?.name]?.baseSpellSaveDc || scoresJson[character.race]?.baseSpellSaveDc
            spellcastingAbility = scoresJson[character.characterClass]?.spellcastingAbility || scoresJson[character.path?.name]?.spellcastingAbility || scoresJson[character.race]?.spellcastingAbility
            baseSpellAttackModifier = scoresJson[character.characterClass]?.spellAttackModifier || scoresJson[character.path?.name]?.spellAttackModifier || scoresJson[character.race]?.spellAttackModifier
            const modifiers = [['wisdom', character.modifiers.wisdom], ['strength', character.modifiers.strength],
            ['dexterity', character.modifiers.dexterity], ['constitution', character.modifiers.constitution], ['intelligence', character.modifiers.intelligence], ['charisma', character.modifiers.charisma]]


            let spellAttackModifier: number = 0
            if (baseSpellAttackModifier === undefined) {
                baseSpellAttackModifier = "none"
            }
            if (baseSpellAttackModifier !== "none") {
                for (let item of baseSpellAttackModifier.split('+')) {
                    if (item === 'proficiency') {
                        item = currentProficiency;
                    }
                    modifiers.forEach(v => v[0] === item ? item = v[1] : 0)
                    spellAttackModifier = spellAttackModifier + parseInt(item)
                }
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