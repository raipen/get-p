// Module
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

// Join Membership
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    // Username duplicate check
    let user = await User.findOne({ email });
    // When username is duplicated
    if (user) {
        res.json({ message: '이미 가입된 이메일 입니다. 다른 이메일을 입력해주세요.' });
    } else {
        try { 
            crypto.randomBytes(64, (err, buf) => {
                if (!err) {
                    crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', async (err, key) => {
                        if (!err) {
                            user = new User({
                                email,
                                password: key.toString('base64'),
                                salt: buf.toString('base64'),
                            });
                            await user.save();
                            console.log(`[/user/signup] ${email}`)
                            res.json({ message: '회원 가입이 완료되었습니다.' });
                        }
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.json({ message: '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.' });
        }
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select({ salt: 1 });
    if (user) {
        try {
            crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', async (err, key) => {
                if (!err) {
                    user = await User.findOne({
                        email,
                        password: key.toString('base64')
                    });
                    if (user) {
                        req.session.email = email;
                        console.log(`[/user/login] ${email}`);
                        res.json({ message: '로그인 되었습니다.' });
                    } else {
                        res.json({ message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.' });
                    }
                }
            })
        } catch (err) {
            console.log(err);
            res.json({ message: '로그인에 문제가 생겼습니다. 다시 시도해주세요.' });
        }  
    } else {
        res.json({ message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    console.log(`[/user/logout] ${req.session.email}`);
    // Destroy session
    req.session.destroy(() => { 
        res.json({ message: '로그아웃 하였습니다.' }); 
    });
});

// Withdrawal
router.post('/delete', async (req, res) => {
    try {
        let user = await User.findOne({ email });
        await User.deleteOne({ _id: user._id });
        res.json({ message: '회원 탈퇴를 완료했습니다.' });
    } catch (err) {
        console.log(err);
        res.json({ message: '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.' });
    }
});

module.exports = router;