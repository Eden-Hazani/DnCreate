import logger from "../../utility/logger";
import { CharacterModel } from "../models/characterModel";


export function generateSavingThrowsPathConditions(character: CharacterModel, items: any, path: any, extraSavingThrowsTotal: number) {
    try {
        let extraSavingThrowsToPick: number = extraSavingThrowsTotal
        let pickedSkillFromStart: string = ""
        const savingThrows = character.characterClassId ? character.characterClassId.savingThrows : [];
        switch (true) {
            case path === "Samurai":
                if (savingThrows) {
                    for (let item of savingThrows) {
                        if (items.includes(item)) {
                            extraSavingThrowsToPick = extraSavingThrowsToPick
                        } else {
                            pickedSkillFromStart = "Wisdom"
                            extraSavingThrowsToPick = extraSavingThrowsToPick - 1
                        }
                    }
                }
                break;
        }
        if (extraSavingThrowsToPick < 0) { extraSavingThrowsToPick = 0 }
        return { extraSavingThrowsToPick, pickedSkillFromStart }
    } catch (err) {
        logger.log(err)
    }
}