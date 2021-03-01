import logger from "../../utility/logger";
import { CharacterModel } from "../models/characterModel";


export function generateSavingThrowsPathConditions(character: CharacterModel, items: any, path: any, extraSavingThrowsTotal: number) {
    try {
        let flag: boolean = false;
        let extraSavingThrowsToPick: number = extraSavingThrowsTotal
        let pickedSkillFromStart: string = ""
        const savingThrows = character.savingThrows
        switch (true) {
            case path === "Samurai":
                if (savingThrows) {
                    let index: number = 0;
                    for (let item of savingThrows) {
                        if (index === savingThrows.length && !items.includes(item)) {
                            pickedSkillFromStart = "Wisdom"
                            extraSavingThrowsToPick = extraSavingThrowsToPick - 1;
                            break;
                        }
                        if (items.includes(item)) {
                            extraSavingThrowsToPick = extraSavingThrowsToPick
                            break;
                        }
                        index++
                    }
                }
                break;
        }
        if (extraSavingThrowsToPick < 0) { extraSavingThrowsToPick = 0 }
        return { extraSavingThrowsToPick, pickedSkillFromStart }
    } catch (err) {
        logger.log(new Error(err))
    }
}