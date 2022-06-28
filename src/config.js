const dotenv = require('dotenv');

dotenv.config();

const config = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,  
    MAIL_ADDRESS: process.env.MAIL_ADDRESS,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET
}

module.exports = config;