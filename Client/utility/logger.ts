import Bugsnag from '@bugsnag/expo'
const log = (error: any) => Bugsnag.notify(error);

const start = () => {
    // if (__DEV__) {
    //     return
    // }
    Bugsnag.start();
};

export default { log, start }