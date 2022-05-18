const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { MAILADDRESS, MAILPASSWORD } = require('../config');
const User = require('../models/User');
const Email = require('../models/Email');
const transporter = nodemailer.createTransport({
    service:"gmail",
    host: 'smtp.gmail.com',
    secure: true,  //다른 포트를 사용해야 되면 false값을 주어야 합니다.
    port: 465,   //구글 메일서버 포트
    auth: {
        user: MAILADDRESS,
        pass: MAILPASSWORD
    }
})//너무 많이 시도해서 락 걸렸을 때 https://accounts.google.com/DisplayUnlockCaptcha 에서 승인


class UserService {
    isValidEmail(email) {
        const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (emailReg.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    isValidPassword(password) {
        const passReg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        if (passReg.test(password)) {
            return true;
        } else {
            return false;
        }
    }

    SendVerifyMail(email){
        crypto.randomBytes(64, async (err, buf) => {
            if (err) throw err;
            let code = buf.toString('base64url');
            const emailModel = new Email({
                email,
                code: code
            })
            await emailModel.save();
            let info = await transporter.sendMail({
                from: `"Get-P" <${MAILADDRESS}>`,
                to: email,
                subject: `[Get-P]이메일 인증`,
                html: `<p>인증을 완료해주세요</p>
                <p><a href="http://localhost:8080/api/users/verify/?email=${email}&code=${code}">인증하기</a></p>`
            });
            console.log("[/users/signup] send verify email "+ email);
            for(let key in info){
                console.log('키 : '+key + ', 값 : ' + info[key])
            }
        });
    }
    
    async SignUp(userDTO) {
        const { email, password } = userDTO;
        switch (true) {
            case !this.isValidEmail(email):
                throw '올바른 이메일을 입력해주세요.';
            case !this.isValidPassword(password):
                throw '올바른 비밀번호를 입력해주세요.';
            default:
                try {
                    const user = await User.findOne({ email });
                    if (user) throw '이미 가입된 이메일 입니다. 다른 이메일을 입력해주세요.';
                    return await this.GenerateUser(email, password);
                } catch (err) {
                    console.log(err);
                    throw '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.';
                }
        }
    }

    async GenerateUser(email, password) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) throw err;
                crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', async (err, key) => {
                    if (err) throw err;
                    const user = new User({
                        email,
                        password: key.toString('base64'),
                        salt: buf.toString('base64'),
                        verify: false
                    });
                    await user.save();
                    this.SendVerifyMail(email);
                    resolve(user._id);
                });
            });
        });
    }

    async SignIn(userDTO) {
        const { email, password } = userDTO;
        try {
            const user = await User.findOne({ email }).select({ salt: 1 });
            if (!await this.Authorize(email, password, user.salt)) throw '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.';
        } catch (err) {
            console.log(err);
            throw '로그인에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async Authorize(email, password, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', async (err, key) => {
                if (err) throw err;
                const user = await User.findOne({
                    email,
                    password: key.toString('base64')
                });
                if (user) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async Delete(email) {
        try {
            const user = await User.findOne({ email });
            await User.deleteOne({ _id: user._id });
        } catch (err) {
            console.log(err);
            throw '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async UserList() {
        try {
            return await User.find({});
        } catch (err) {
            console.log(err);
            throw '사용자 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new UserService();