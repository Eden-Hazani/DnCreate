import { CharacterModel } from '../app/models/characterModel'
import * as scoresJson from '../jsonDump/spellCastingScores.json'


export function SpellCastingSwitch(character: CharacterModel, currentProficiency: number) {
    const baseSpellSaveDc = scoresJson[character.characterClass].baseSpellSaveDc
    const spellcastingAbility = scoresJson[character.characterClass].spellcastingAbility
    const baseSpellAttackModifier = scoresJson[character.characterClass].spellAttackModifier
    const modifiers = [['wisdom', character.modifiers.wisdom], ['strength', character.modifiers.strength],
    ['dexterity', character.modifiers.dexterity], ['constitution', character.modifiers.constitution], ['intelligence', character.modifiers.intelligence], ['charisma', character.modifiers.charisma]]

    let spellAttackModifier: number = 0
    for (let item of baseSpellAttackModifier.split('+')) {
        if (item === 'proficiency') {
            item = currentProficiency;
        }
        modifiers.forEach(v => v[0] === item ? item = v[1] : null)
        spellAttackModifier = spellAttackModifier + parseInt(item)
    }

    let spellSaveDc: number = 0;
    for (let item of baseSpellSaveDc.split('+')) {
        if (item === 'proficiency') {
            item = currentProficiency;
        }
        modifiers.forEach(v => v[0] === item ? item = v[1] : null)
        spellSaveDc = spellSaveDc + parseInt(item)
    }

    return { spellcastingAbility, spellSaveDc, spellAttackModifier }
}