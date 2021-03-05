import logger from "../../../../utility/logger";
import userCharApi from "../../../api/userCharApi";
import { CharacterModel } from "../../../models/characterModel";

export function currentTotalInfusedItems(currentLevel: number) {
    // put this in server as object with name and description of current items out of total.
    //keep total number items here as switch function and put it vs number of objects in th server
    // make the current infused items tsx go as pop up modal
    let currentInfusions: number = 0
    switch (true) {
        case currentLevel >= 2 && currentLevel <= 5:
            currentInfusions = 2
            break;
        case currentLevel >= 6 && currentLevel <= 9:
            currentInfusions = 3
            break;
        case currentLevel >= 10 && currentLevel <= 13:
            currentInfusions = 4
            break;
        case currentLevel >= 14 && currentLevel <= 17:
            currentInfusions = 5
            break;
        case currentLevel >= 18:
            currentInfusions = 6
            break;
    }
    return currentInfusions
}


export async function updateInfusionToServer(character: CharacterModel) {
    try {
        await userCharApi.updateChar(character)
    } catch (err) {
        logger.log(err)
    }
}