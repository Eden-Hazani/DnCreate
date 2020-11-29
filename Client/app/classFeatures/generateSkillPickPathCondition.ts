import { CharacterModel } from "../models/characterModel";


export function generateSkillPickPathCondition(character: CharacterModel, items: any, path: any, extraSkillsTotal: number) {
    let extraSkillsToPick: number = extraSkillsTotal
    switch (true) {
        case path === "College of Satire":
            for (let item of character.tools) {
                if (items.includes(item[0])) {
                    extraSkillsToPick = extraSkillsToPick - 1
                }
            }
            break;
    }
    console.log(extraSkillsToPick)
    return extraSkillsToPick
}