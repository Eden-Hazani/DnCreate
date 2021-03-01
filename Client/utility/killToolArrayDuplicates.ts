export function killToolArrayDuplicates(array: any[]) {
    let tempArray = array;
    let strippedArray: string[] = []
    for (let item of tempArray) {
        strippedArray.push(item[0])
    }
    let findDuplicates = strippedArray.filter((item, index) => strippedArray.indexOf(item) !== index)
    if (findDuplicates.length > 0) {
        for (let newItem of findDuplicates) {
            let index: number = 0
            for (let item of tempArray) {
                if (item[0] === newItem) {
                    tempArray.splice(index, 1)
                    break;
                }
                index++
            }
        }
    }
    return tempArray
}
