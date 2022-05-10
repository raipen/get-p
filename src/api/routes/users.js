// Module
const express = require('express');
const router = express.Router();
const UserService = require('../../services/UserService');

// Return a list of all users
router.post('/list', async (req, res) => {
    const userList = await UserService.UserList();
    res.json(userList);
});

// Sign Up
router.post('/signup', async (req, res) => {
    const userDTO = req.body;
    const { message, result } = await UserService.SignUp(userDTO);
    res.json({ message, result });
});

// Sign In
router.post('/signin', async (req, res) => {
    const userDTO = req.body;
    const { email } = userDTO;
    const { message, result } = await UserService.SignIn(userDTO);
    req.session.email = email;
    res.json({ message, result });
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
    const userDTO = req.body;
    const { message, result } = await UserService.Delete(userDTO);
    res.json({ message, result });
});

module.exports = router;