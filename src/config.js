const dotenv = require('dotenv');

dotenv.config();

const config = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    MAILADDRESS: process.env.MAILADDRESS,
    MAILPASSWORD: process.env.MAILPASSWORD
}

module.exports = config;