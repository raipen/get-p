const api = require("../api");

async function express_loader(app){
    app.use(api());
    return;
}

module.exports = express_loader;