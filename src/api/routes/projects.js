// Module
const express = require('express');
const passport = require('passport');
const router = express.Router();
const ProjectService = require('../../services/ProjectService');

// create project
router.post('/', async (req, res) => {
    try {
        const projectDTO = req.body;
        await ProjectService.createProject(projectDTO);
        res.status(201);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// read project
router.get('/:id', async (req, res) => {
    try {
        const project = await ProjectService.readProject(req.params.id);
        res.status(200).json(project);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// update project
router.put('/:id', async (req, res) => {
    try {
        const projectDTO = req.body;
        await ProjectService.updateProject(req.params.id, projectDTO);
        res.status(200);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// delete project
router.delete('/:id', async (req, res) => {
    try {
        await ProjectService.deleteProject(req.params.id);
        res.status(200);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

// get project list 
router.get('/', async (req, res) => {
    try {
        const projects = await ProjectService.getProjectList();
        res.status(200).json(projects);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// select performer
router.post('/:id/performer', async (req, res) => {
    try {
        await ProjectService.selectPerformer(req.params.id, r);
        res.status(200);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// read proposal
router.get('/:projectId/proposals/:userId', async (req, res) => {
    try {
        const proposal = ProjectService.readProposal(req.params.projectId, req.params.userId);
        res.status(200).json(proposal);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// send proposal
router.post('/:id/proposals/', async (req, res) => {
    try {
        await ProjectService.sendProposal(req.params.id);
        res.status(200);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// get proposal list 
router.get('/:id/proposals/', async (req, res) => {
    try {
        const proposals = await ProjectService.getProposalList(req.params.id);
        res.status(200).json(proposals);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports = router;