import { CharacterModel } from "../models/characterModel";


export function generateSkillPickPathCondition(character: CharacterModel, items: any, path: any, extraSkillsTotal: number) {
    let extraSkillsToPick: number = extraSkillsTotal
    let pickedSkillFromStart: any = null
    const literalCharSkills = character.skills.map(skill => { return skill[0] })
    switch (true) {
        case path === "College of Satire":
            for (let item of character.tools) {
                if (items.includes(item[0])) {
                    extraSkillsToPick = extraSkillsToPick - 1
                }
            }
            break;
        case path === "Banneret":
            if (literalCharSkills.includes("Persuasion")) {
                extraSkillsToPick = extraSkillsToPick
            } else {
                pickedSkillFromStart = "Persuasion"
                extraSkillsToPick = extraSkillsToPick - 1
            }
            break;
    }
    return { extraSkillsToPick, pickedSkillFromStart }
}