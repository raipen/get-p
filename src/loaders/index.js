const express_loader = require("./express");

async function loaders(app){
    await express_loader(app);
}

module.exports = loaders;