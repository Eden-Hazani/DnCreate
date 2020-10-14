

export function filterAlreadyPicked(array: any[], arrayWithPickedValues: any[]) {
    let simplifiedPickedArray: any[] = [];
    for (let item of arrayWithPickedValues) {
        simplifiedPickedArray.push(item.name)
    }
    const newArray = array.filter(function (item) {
        return !simplifiedPickedArray.includes(item.name);
    })

    return newArray

}
