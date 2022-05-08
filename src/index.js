// Module
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { connectToServer } = require('./connect');
const { PORT } = require('./config');
const cors = require('cors');
const app = express();

// Connect to MongoDB Atlas
connectToServer(() => {});

// Middle-ware settings
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: "get-p",
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);

// Routes
app.use('/api/user', require('./routes/userRouter'));
app.use('/api/test',require('./routes/testTool'));

// Port settings
app.listen(PORT, () => {
    console.log(`Express is listening on ${PORT}`);
});