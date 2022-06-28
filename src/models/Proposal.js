const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    project: {
        type: mongoose.ObjectId,
        required: true
    },
    people: {
        type: mongoose.ObjectId,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    
    createdAt: {
        type: Date,
        default: Date.noew
    }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;