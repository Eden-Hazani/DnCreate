import { CharacterModel } from "../../../models/characterModel";

const rollForDamageCalc = (character: CharacterModel) => {
    if (!character.currentWeapon?.modifier) {
        alert('Using DnCreate to roll for damage is only available if your weapon has an assigned modifier, go to the weapons circle and edit your weapon with the modifier you want then try again :)')
        return {
            diceAmount: 0, diceType: 0,
            diceRolling: false, currentDiceRollValue: 0
        };
    }
    if (character.modifiers && character.currentWeapon.dice) {
        let currentAddedVal = character.modifiers[character.currentWeapon.modifier.toLowerCase()] + (character.currentWeapon.addedDamage || 0)
        if (character.equipment) {
            for (let item of character.equipment) {
                if (item.addedDam && item.isEquipped) {
                    currentAddedVal = currentAddedVal + item.addedDam
                }
            }
        }
        return {
            diceAmount: character.currentWeapon.diceAmount || 1, diceType: parseInt(character.currentWeapon.dice.split('D')[1] || '0'),
            diceRolling: true, currentDiceRollValue: currentAddedVal
        };
    }
    return {
        diceAmount: 0, diceType: 0,
        diceRolling: false, currentDiceRollValue: 0
    }
}

export default rollForDamageCalc