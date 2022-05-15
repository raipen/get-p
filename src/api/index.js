const { Router } = require('express');

const app = Router();
app.use('/api/users', require('./routes/users'));
app.use('/api/test', require('./routes/testTool'));
app.use('/api/company', require('./routes/company'));

module.exports = app;