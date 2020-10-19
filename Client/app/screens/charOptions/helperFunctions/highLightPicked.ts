import { CharacterModel } from "../../../models/characterModel";


export function highLightPicked(arrayWithPickedValues: any[], array: any[]) {
    const booleanArray: boolean[] = [];
    let simplifiedPickedArray: any[] = [];
    for (let item of arrayWithPickedValues) {
        simplifiedPickedArray.push(item.name)
    }
    array.forEach(function (item, index) {
        if (simplifiedPickedArray.includes(item.name)) {
            booleanArray[index] = true;
        }
    })
    return booleanArray

}