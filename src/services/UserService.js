const crypto = require('crypto');
const User = require('../models/User');

class UserService {
    async SignUp(userDTO) {
        const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        const passReg = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const { email, password } = userDTO;
    
        switch (true) {
            case !emailReg.test(email):
                return { message: '올바른 이메일을 입력해주세요.', result: false };
            case !passReg.test(password):
                return { message: '올바른 비밀번호를 입력해주세요.', result: false };
            default:
                let user = await User.findOne({ email });
                if (user) {
                    return { message: '이미 가입된 이메일 입니다. 다른 이메일을 입력해주세요.', result: false };
                }
                try { 
                    let test = await this.generateUser(email,password);
                    console.log("asdf");
                    console.log(test);
                    return test;
                } catch (err) {
                    console.log(err);
                    return { message: '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.', result: false };
                }
        }
    }

    async generateUser(email,password){
        try{
            crypto.randomBytes(64, (err, buf) => {
                if (!err) {
                    crypto.pbkdf2(password, buf.toString('base64'), 100000, 64, 'sha512', async (err, key) => {
                        if (!err) {
                            user = await new User({
                                email,
                                password: key.toString('base64'),
                                salt: buf.toString('base64'),
                            });
                            await user.save();
                            console.log(`[/user/signup] ${email}`);
                            return new Promise((resolve, reject) =>{
                                resolve({ message: '회원 가입이 완료되었습니다.', result: true });
                            });
                        }
                    });
                }
            });
        }catch(err){
            return new Promise((resolve, reject) =>{
                resolve()
            });
        }
    }

    async SignIn(userDTO) {
        const { email, password } = userDTO;
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
                            console.log(`[/user/login] ${email}`);
                            return { message: '로그인 되었습니다.', result: true };
                        } else {
                            return { message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.', result: false };
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                return { message: '로그인에 문제가 생겼습니다. 다시 시도해주세요.', result: false };
            }  
        } else {
            return { message: '이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.', result: false };
        }
    }

    async Delete(userDTO) {
        const { email } = userDTO;
        try {
            let user = await User.findOne({ email });
            await User.deleteOne({ _id: user._id });
            return { message: '회원 탈퇴를 완료했습니다.', result: true };
        } catch (err) {
            console.log(err);
            return { message: '회원 탈퇴에 문제가 생겼습니다. 다시 시도해주세요.', result: false };
        }
    }

    async UserList() {
        try {
            return await User.find({});
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new UserService();