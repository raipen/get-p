// Module
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

router.post('/test', async(req, res)=>{
    console.log("test");
    await User.find({}).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.json(err);
    });
});

// Join Membership
router.post('/signup', async (req, res) => {
    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    const passReg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const { email, password } = req.body;

    switch (true) {
        case !emailReg.test(email):
            res.json({ message: '올바른 이메일을 입력해주세요.', result: false });
            break;
        case !passReg.test(password):
            res.json({ message: '올바른 비밀번호를 입력해주세요.', result: false });
            break;
        default:
            let user = await User.findOne({ email });
            if (user) {
                res.json({ message: '이미 가입된 이메일 입니다. 다른 이메일을 입력해주세요.', result: false });
                break;
            }
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
                                res.json({ message: '회원 가입이 완료되었습니다.', result: true });
                            }
                        });
                    }
                });
            } catch (err) {
                console.log(err);
                res.json({ message: '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.', result: false });
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
                        res.json({ message: '로그인 되었습니다.', result: true });
                    } else {
                        res.json({ message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.', result: false });
                    }
                }
            })
        } catch (err) {
            console.log(err);
            res.json({ message: '로그인에 문제가 생겼습니다. 다시 시도해주세요.', result: false });
        }  
    } else {
        res.json({ message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.', result: false });
    }
});

// Logout
router.get('/logout', (req, res) => {
    console.log(`[/user/logout] ${req.session.email}`);
    // Destroy session
    req.session.destroy(() => { 
        res.json({ message: '로그아웃 하였습니다.', result: true }); 
    });
});

// Withdrawal
router.post('/delete', async (req, res) => {
    try {
        let user = await User.findOne({ email });
        await User.deleteOne({ _id: user._id });
        res.json({ message: '회원 탈퇴를 완료했습니다.', result: true });
    } catch (err) {
        console.log(err);
        res.json({ message: '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.', result: false });
    }
});

module.exports = router;