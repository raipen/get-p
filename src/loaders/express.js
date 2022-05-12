const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const api = require("../api");

async function express_loader(app){
    // Middle-ware settings
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
        session({
            resave: false,
            saveUninitialized: true,
            secret: "get-p",
            cookie: {
                httpOnly: true,
                secure: false
            }
        })
    );

    // API Route
    app.use(require("../api"));
    return;
}

module.exports = express_loader;