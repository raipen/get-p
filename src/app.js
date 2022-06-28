const express = require('express');
const { PORT } = require('./config');
const loaders = require('./loaders');

async function startServer(){
    const app = express();
    loaders(app);
    app.listen(PORT, () => {
        console.log(`Express is listening on ${PORT}`);
    });
}

startServer();