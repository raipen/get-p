const { MongoClient } = require("mongodb");
const config = require("./config");
const client = new MongoClient(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
    connectToServer: function (callback) {
        client.connect((err, db) => {
            if (err || !db) {
                return callback(err);
            }
            dbConnection = db.db("Get-P");
            console.log("Successfully connected to MongoDB.");
            return callback();
        });
    },
    getDb: () => {
        return dbConnection;
    }
};