import * as featureJson from '../../jsonDump/features.json'

const featurePicker = (level: number, className: string) => {
    let features: any[] = [];
    for (let index = 1; index <= level; index++) {
        if (featureJson[className].level[index]) {
            Object.values(featureJson[className].level[index]).forEach(v => features.push(v))
        }
    }

    return { features }

}


export { featurePicker };