import logger from "../../utility/logger";
import { CharacterModel } from "../models/characterModel";


function pathChoiceChangePicker(character: CharacterModel) {
    try {
        let featureTree: any;
        switch (true) {
            case character.path.name === "Path of the Storm Herald":
                featureTree = "Storm Aura"
                break;
        }
        return featureTree;
    } catch (err) {
        logger.log(new Error(err))
    }
}

function allowedChangingPaths(character: CharacterModel) {
    try {
        let isTrue: boolean = false;
        switch (true) {
            case character.path.name === "Path of the Storm Herald":
                isTrue = true
                break;
        }
        return isTrue;
    } catch (err) {
        logger.log(new Error(err))
    }
}


export { pathChoiceChangePicker, allowedChangingPaths }