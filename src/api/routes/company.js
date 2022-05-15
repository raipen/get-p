// Module
const express = require('express');
const router = express.Router();
const CompanyService = require('../../services/CompanyService');

// Return a list of all users
router.post('/list', async (req, res) => {
    try {
        const companyList = await CompanyService.CompanyList();
        console.log(`[/company/list]`);
        res.json(companyList);
    } catch (err) {
        res.json({ message: err, result: false});
    }
});

// Sign Up
router.post('/signup', async (req, res) => {
    const comapnyDTO = req.body;
    try {
        await CompanyService.SignUp(comapnyDTO);
        console.log(`[/company/signup] ${comapnyDTO.email}`);
        res.json({ message: '회원 가입이 완료되었습니다.', result: true });
    } catch (err) {
        res.json({ message: err, result: false});
    }
});

module.exports = router;