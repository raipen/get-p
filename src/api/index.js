const { Router } = require('express');
const app = Router();

app.use('/users', require('./routes/users'));
app.use('/company', require('./routes/company'));
app.use('/projects', require('./routes/projects'));
app.use('/test', require('./routes/testTool'));

module.exports = app;