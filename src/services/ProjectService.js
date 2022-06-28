const Project = require('../models/Project');

class ProjectService {
    async createProject(projectDTO) {
        try {
            const project = new Project(projectDTO);
            await project.save();
        } catch (err) {
            console.err(err);
            throw '프로젝트 생성에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async readProject(projectId) {
        try {
            return await Project.findOne({ _id: projectId });
        } catch (err) {
            console.err(err);
            throw '프로젝트 조회에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async updateProject(projectId, projectDTO) {
        try {
            await Project.findByIdAndUpdate(projectId, projectDTO);
        } catch (err) {
            console.err(err);
            throw '프로젝트 수정에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async deleteProject(projectId) {
        try {
            await Project.deleteOne({ _id: projectId });
        } catch (err) {
            console.err(err);
            throw '프로젝트 삭제에 문제가 생겼습니다. 다시 시도해주세요.';
        }
    }

    async getProjectList() {
        try {
            return await Project.find({});
        } catch (err) {
            console.err(err);
            throw '프로젝트 목록을 조회하는데 오류가 발생했습니다. 다시 시도해주세요.';
        }
    }
}

module.exports = new ProjectService();