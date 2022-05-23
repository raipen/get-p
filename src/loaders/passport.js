const passport = require('passport');
const local = require('localStrategy');
const User = require('../models/User');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (UserObjectId, done) => {
        const user = await User.findOne({ _id: UserObjectId });
        done(null, user);
    });

    local();
}