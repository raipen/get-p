const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    // 기업명
    companyName: {
        type: String,
        required: true,
    },
    // 기업 프로필 사진
    companyImage: {
        type: String,
    },
    // 업종
    industry: {
        type: String,
        required: true,
    },
    // 대표자
    representativeDirector: {
        type: String,
        required: true,
    },
    // 기업 소개
    discription: {
        type: String
    },
    // 대표 전화
    phoneNumber: {
        type: String,
        required: true,
    },
    // 웹 사이트
    url: {
        type: String
    },
    // 기업 주소
    address: {
        type: String,
        required: true,
    },
    // 계정
    userObjectId: {
        type: mongoose.ObjectId,
        required: true
    }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;