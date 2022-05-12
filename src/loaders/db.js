const connectToMongooseDB = require('./mongoose');

async function db_loader(app){
    // Connect to MongoDB Atlas
    connectToMongooseDB(() => {});
    return;
}

module.exports = db_loader;