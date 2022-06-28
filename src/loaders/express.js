const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport');
const { COOKIE_SECRET } = require('../config');

async function express_loader(app) {
    // Middle-ware settings
    app.use(passport.initialize());
    passportConfig();
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
        session({
            resave: false,
            saveUninitialized: true,
            secret: COOKIE_SECRET,
            cookie: {
                httpOnly: true,
                secure: false
            }
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // API Route
    app.use(require("../api"));
    return;
}

module.exports = express_loader;