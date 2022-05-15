const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name: {
        types: String,
        required: true
    },
    desc: {
        types: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String,
        required: true
    }
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;