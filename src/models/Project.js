const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // 해당 프로젝트 수행을 의뢰한 회사
    requester: {
        type: mongoose.ObjectId,
        required: true
    },
    // 받은 제안 리스트
    proposals: [mongoose.ObjectId],
    // 받은 제안들 중에서 회사가 프로젝트를 수행하도록 고용한 people
    performer: {
        type: mongoose.ObjectId
    },
    // 프로젝트 미팅 방식. 온라인: 0, 오프라인: 1
    meeting: {
        type: Number,
        required: true
    },
    // 성공 보수
    success_pay: {
        type: Number,
        required: true
    },
    // 실패 보증금
    fail_deposit: {
        type: Number,
        required: true
    },
    // 프로젝트 유형
    category: {
        type: String,
        required: true
    },
    // 프로젝트 제목
    title: {
        type: String,
        required: true
    },
    // 프로젝트 상세 설명
    description: {
        type: String,
        required: true
    },
    // 첨부 파일 (첨부 파일 URL)
    attachment_url: {
        type: String
    },
    // 지원자 모집 마감일
    application_deadline: {
        type: Date,
        required: true
    },
    // 작업 마감일
    project_deadline: {
        type: Date,
        required: true
    },
    // 작업 기간 (일 단위)
    project_duration: {
        type: Number,
        required: true
    },
    // 프로젝트 태그 (최대 8개)
    tag: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.noew
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;