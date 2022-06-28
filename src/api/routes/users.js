// Module
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Services
const UserService = require('../../services/UserService');
const EmailService = require('../../services/EmailService');
const { JWT_SECRET } = require('../../config');

// Return a list of all users
router.post('/', async (req, res) => {
    try {
        const userList = await UserService.UserList();
        res.status(200).json(userList);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const userDTO = req.body;
    try {
        await UserService.SignUp(userDTO);
        console.log(`[/users/signup] ${userDTO.email}`);
        res.status(201).send();
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// Verify email
router.get('/verify', async (req, res) => {
    const emailDTO = req.query;
    try {
        await EmailService.VerifyEmail(emailDTO);
        console.log(`[/users/verify] ${emailDTO.email} verify success`);
        res.status(200).send();
    } catch (err) {
        console.log(`[/users/verify] ${emailDTO.email} verify false`);
        res.status(400).json({ message: err });
    }
});

// Sign In
router.post('/signin', async (req, res, next) => {
    try {
        passport.authenticate('local', (authError, user, info) => {
            if (authError || !user) {
                res.status(400).json({ message: info.reason })
                return;
            }
            req.login(user, { session: false }, (loginError) => {
                if (loginError) {
                    res.send(loginError);
                    return;
                }
                const token = jwt.sign({ _id: user._id, email: user.email }, JWT_SECRET);
                res.status(200).json(token);
            });
        })(req, res);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// Withdrawal
router.post('/delete',  passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await UserService.Delete(req.user.email);
        console.log(`[/users/delete] ${req.user.email}`);
        res.status(200).send();
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;