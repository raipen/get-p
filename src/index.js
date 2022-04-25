const express = require("express");
const config = require("./config");
const loaders = require("./loaders");

async function startServer(){
    const app = express();
    loaders(app);
    
    app.listen(config.port, () => {
        console.log(config.port+"로 듣고있어요");
    });
}

startServer();