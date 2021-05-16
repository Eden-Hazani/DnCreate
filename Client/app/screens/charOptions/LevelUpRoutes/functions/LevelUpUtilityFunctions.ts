import logger from "../../../../../utility/logger";
import { CharacterModel } from "../../../../models/characterModel";

const levelUpModifierListStats = (character: CharacterModel) => {
    try {
        const stats: any[] = [];
        stats.push(['strength', character.strength])
        stats.push(['constitution', character.constitution])
        stats.push(['dexterity', character.dexterity])
        stats.push(['intelligence', character.intelligence])
        stats.push(['wisdom', character.wisdom])
        stats.push(['charisma', character.charisma]);
        return stats
    } catch (err) {
        logger.log(new Error(err))
        return []
    }
}


const alterErrorSequence = (error: { isError: boolean, errorDesc: string }, errorList: { isError: boolean, errorDesc: string }[], updateErrorList: Function) => {
    // let updatedErrorList = [...errorList];
    let flag: boolean = false;
    for (let item of errorList) {
        if (error.errorDesc === item.errorDesc) {
            item.isError = error.isError;
            flag = true
        }
    }
    if (!flag) {
        errorList.push(error)
        // updatedErrorList = [...errorList, error]
    }
    updateErrorList(errorList)
}

export { levelUpModifierListStats, alterErrorSequence }