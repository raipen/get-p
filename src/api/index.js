const express = require("express");
const api1 = require("./api1");
const router = express.Router();

function api(){
    const app = router;
    api1(app);
    return app;
}

module.exports = api;