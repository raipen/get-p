const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../../models/User');
const UserService = require('../../services/UserService');
const { JWT_SECRET } = require('../../config');

const passportConfig = { usernameField: 'email', passwordField: 'password' };
const JWTConfig = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
};

const passportVerify = async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            done(null, false, { reason: '이메일 또는 비밀번호가 올바르지 않습니다.' });
            return;
        }
        const result = await UserService.Authorize(email, password, user.salt);
        if (result) {
            done(null, user);
            return;
        }
        done(null, false, { reason: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    } catch (error) {
        console.error(error);
        done(error);
    }
};

const JWTVerify = async (jwtPayload, done) => {
    try {
        const user = await User.findOne({ _id: jwtPayload._id });
        if (user) {
            done(null, user);
            return ;
        }
        done(null, false, { reason: '올바르지 않은 인증 정보 입니다.' });
    } catch (error) {
        console.error(error);
        done(error);
    }
};

module.exports = () => {
    passport.use('local', new LocalStrategy(passportConfig, passportVerify));
    passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));
};