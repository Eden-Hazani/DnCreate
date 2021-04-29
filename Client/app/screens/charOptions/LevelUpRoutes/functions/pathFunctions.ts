import logger from "../../../../../utility/logger"
import subClassesApi from "../../../../api/subClassesApi"
import * as Path from "../../../../../jsonDump/paths.json"
import { CharacterModel } from "../../../../models/characterModel"

const extractCustomPathJson = async (pathName: any, level: number, pathFeature: any) => {
    try {
        const path: any = await subClassesApi.getSubclass(pathName)
        if (pathFeature && path.data && level) {
            return Object.values(path.data.levelUpChart[level])
        }
        return []
    } catch (err) {
        logger.log(new Error(err))
        return []
    }
}


const customOrOfficialPath = (character: CharacterModel, pathChosen: any, path: any, pathFeature: any) => {
    try {
        if (Path[character.characterClass][pathChosen?.name || path.name]) {
            return Object.values(Path[character.characterClass][pathChosen?.name || character.path.name][character.level])
        } else {
            return extractCustomPathJson(pathChosen.name, character.level || 1, pathFeature)
        }
    } catch (err) {
        logger.log(new Error(err))
        return []
    }
}

export { extractCustomPathJson, customOrOfficialPath }