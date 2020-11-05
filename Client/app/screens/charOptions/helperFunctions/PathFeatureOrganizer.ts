
export function PathFeatureOrganizer(path: any, extraChoiceVal: any) {
    const result: any[] = [];
    let deepClone = JSON.parse(JSON.stringify(path));
    Object.values(deepClone).map((item: any) => {
        result.push(item)
    })
    for (let item of result) {
        if (item.choice) {
            item.choice = extraChoiceVal
        }
    }
    return result
}