const Company = require('../models/Company');
const UserService = require('./UserService');

class CompanyService {
    async SignUp(companyDTO) {
        const {
            companyName,
            // companyImage,
            industry,
            representativeDirector,
            discription,
            phoneNumber,
            url,
            address,
            email,
            password
        } = companyDTO;
        try {
            const user = await UserService.SignUp({ email, password });
            const userObjectId = user._id;
            const company = new Company({
                companyName,
                // companyImage,
                industry,
                representativeDirector,
                discription,
                phoneNumber,
                url,
                address,
                userObjectId
            });
            await company.save();
        } catch (err) {
            console.log(err);
            throw '회원 가입에 문제가 생겼습니다. 다시 시도해주세요.';
        } 
    }

    async CompanyList() {
        try {
            return await Company.find({});
        } catch (err) {
            console.log(err);
            throw '회사 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new CompanyService();