import { CharacterModel } from "../models/characterModel";


export function generateSavingThrowsPathConditions(character: CharacterModel, items: any, path: any, extraSavingThrowsTotal: number) {
    let extraSavingThrowsToPick: number = extraSavingThrowsTotal
    let pickedSkillFromStart: any = null
    const savingThrows = character.characterClassId.savingThrows;
    switch (true) {
        case path === "Samurai":
            for (let item of savingThrows) {
                if (items.includes(item)) {
                    extraSavingThrowsToPick = extraSavingThrowsToPick
                } else {
                    pickedSkillFromStart = "Wisdom"
                    extraSavingThrowsToPick = extraSavingThrowsToPick - 1
                }
            }
            break;
    }
    if (extraSavingThrowsToPick < 0) { extraSavingThrowsToPick = 0 }
    return { extraSavingThrowsToPick, pickedSkillFromStart }
}