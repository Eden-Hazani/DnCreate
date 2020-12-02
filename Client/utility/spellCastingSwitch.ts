import { CharacterModel } from '../app/models/characterModel'
import * as scoresJson from '../jsonDump/spellCastingScores.json'


export function SpellCastingSwitch(character: CharacterModel, currentProficiency: number) {
    const baseSpellSaveDc = scoresJson[character.characterClass]?.baseSpellSaveDc || scoresJson[character.path?.name]?.baseSpellSaveDc || scoresJson[character.race]?.baseSpellSaveDc
    const spellcastingAbility = scoresJson[character.characterClass]?.spellcastingAbility || scoresJson[character.path?.name]?.spellcastingAbility || scoresJson[character.race]?.spellcastingAbility
    const baseSpellAttackModifier = scoresJson[character.characterClass]?.spellAttackModifier || scoresJson[character.path?.name]?.spellAttackModifier || scoresJson[character.race]?.spellAttackModifier
    const modifiers = [['wisdom', character.modifiers.wisdom], ['strength', character.modifiers.strength],
    ['dexterity', character.modifiers.dexterity], ['constitution', character.modifiers.constitution], ['intelligence', character.modifiers.intelligence], ['charisma', character.modifiers.charisma]]

    let spellAttackModifier: number = 0
    if (baseSpellAttackModifier !== "none") {
        for (let item of baseSpellAttackModifier.split('+')) {
            if (item === 'proficiency') {
                item = currentProficiency;
            }
            modifiers.forEach(v => v[0] === item ? item = v[1] : null)
            spellAttackModifier = spellAttackModifier + parseInt(item)
        }
    }

    let spellSaveDc: number = 0;
    if (baseSpellSaveDc !== "none") {
        for (let item of baseSpellSaveDc.split('+')) {
            if (item === 'proficiency') {
                item = currentProficiency;
            }
            modifiers.forEach(v => v[0] === item ? item = v[1] : null)
            spellSaveDc = spellSaveDc + parseInt(item)
        }
    }
    return { spellcastingAbility, spellSaveDc, spellAttackModifier }
}