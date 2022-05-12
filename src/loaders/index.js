const express_loader = require("./express");
const db_loader = require("./db");

async function loaders(app){
    await db_loader(app);
    await express_loader(app);
}

module.exports = loaders;