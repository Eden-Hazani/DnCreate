function getError(err) {
    if (config.isProduction) {
        return "Some Error Occurred, Please try again later"
    }
    return err.message
}


module.exports = {
    getError
};