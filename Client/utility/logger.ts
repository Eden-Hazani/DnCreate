import Bugsnag from '@bugsnag/expo'
import { Config } from '../config';
const log = (error: any) => Bugsnag.notify(error);

const start = () => {
    // if (__DEV__) {
    //     return
    // }
    Bugsnag.start(Config.bugSnagApiKey);
};

export default { log, start }