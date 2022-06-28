const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { MAIL_ADDRESS, MAIL_PASSWORD } = require('../config');
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    secure: true, // 다른 port를 사용해야 되면 false 값을 주어야 합니다.
    port: 465, // google mail server port
    auth: {
        user: MAIL_ADDRESS,
        pass: MAIL_PASSWORD
    }
}); // 너무 많이 시도해서 lock 걸렸을 때 "https://accounts.google.com/DisplayUnlockCaptcha"에서 승인 필요
const Email = require('../models/Email');
const User = require('../models/User');

class EmailService {
    SendVerifyEmail(email) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, async (err, buf) => {
                if (err) throw err;
                const code = buf.toString('base64url');
                const _email = new Email({ email, code });
                await _email.save();
                await transporter.sendMail({
                    from: `"Get-P" <${MAIL_ADDRESS}>`,
                    to: email,
                    subject: `[Get-P] 이메일 인증`,
                    html: `<p>인증을 완료해주세요</p>
                    <p><a href="http://localhost:8080/api/users/verify/?email=${email}&code=${code}">인증하기</a></p>`
                });
                console.log(`Send verify email to ${email}`);
                resolve();
            });
        });
    }
    
    async VerifyEmail(emailDTO) {
        const { email, code } = emailDTO;
        try {
            const _email = await Email.findOne({ email });
            let user = await User.findOne({ email });
            user.verify = true;
            await user.save();
            if (code !== _email.code) throw '이메일 인증에 문제가 생겼습니다. 다시 시도해주세요.';
        } catch (err) {
            console.error(err);
            throw '이메일 인증에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new EmailService();