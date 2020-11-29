import { CharacterModel } from "../models/characterModel";


function pathChoiceChangePicker(character: CharacterModel) {
    let featureTree: any;
    switch (true) {
        case character.path.name === "Path of the Storm Herald":
            featureTree = "Storm Aura"
            break;
    }
    return featureTree;
}

function allowedChangingPaths(character: CharacterModel) {
    let isTrue: boolean = false;
    switch (true) {
        case character.path.name === "Path of the Storm Herald":
            isTrue = true
            break;
    }
    return isTrue;
}


export { pathChoiceChangePicker, allowedChangingPaths }