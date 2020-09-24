const mongoose = require('mongoose');

function connectAsync() {
    return new Promise((resolve, reject) => {
        const connStr = config.mongodb.connectionString;

        const options = { useNewUrlParser: true, useUnifiedTopology: true };

        mongoose.connect(connStr, options, (err, db) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(db);
        })
    })
}


(async () => {
    try {
        const db = await connectAsync();
        console.log('connected to DB')
    } catch (err) { console.log(err); }
})();