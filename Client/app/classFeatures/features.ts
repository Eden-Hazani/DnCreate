import * as featureJson from '../../jsonDump/features.json'
import logger from '../../utility/logger';

const featurePicker = (level: number, className: string) => {
    try {
        let features: any[] = [];
        for (let index = 1; index <= level; index++) {
            if (featureJson[className].level[index]) {
                Object.values(featureJson[className].level[index]).forEach(v => features.push(v))
            }
        }

        return { features }
    } catch (err) {
        logger.log(err)
    }

}


export { featurePicker };