// Module
const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');

// Return a list of all users
router.post('/list', async (req, res) => {
    try {
        const userList = await UserService.UserList();
        console.log(`[/users/list]`);
        res.json(userList);
    } catch (err) {
        res.json({ message: err, result: false});
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const userDTO = req.body;
    try {
        await UserService.SignUp(userDTO);
        console.log(`[/users/signup] ${userDTO.email}`);
        res.json({ message: '회원 가입이 완료되었습니다.', result: true });
    } catch (err) {
        res.json({ message: err, result: false});
    }
});

router.get('/verify', async (req, res) => {
    const userDTO = req.query;
    try {
        await UserService.Verify(userDTO);
        console.log(`[/users/verify]`);
        res.json({ message: '이메일 인증이 완료되었습니다.', result: true });
    } catch (err) {
        res.json({ message: err, result: false});
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const userDTO = req.body;
    try {
        await UserService.SignIn(userDTO);
        console.log(`[/users/signin] ${userDTO.email}`);
        req.session.email = email;
        res.json({ message: '로그인 되었습니다.', result: true });
    } catch (err) {
        res.json({ message: err, result: false });
    }
});

// Logout
router.get('/logout', (req, res) => {
    console.log(`[/users/logout] ${req.session.email}`);
    // Destroy session
    req.session.destroy(() => { 
        res.json({ message: '로그아웃 하였습니다.', result: true }); 
    });
});

// Withdrawal
router.post('/delete', async (req, res) => {
    try {
        await UserService.Delete(req.session.email);
        console.log(`[/users/delete] ${req.session.email}`);
        res.json({ message: '회원 탈퇴를 완료했습니다.', result: true });
    } catch (err) {
        res.json({ message: err, result: false });
    }
});

module.exports = router;