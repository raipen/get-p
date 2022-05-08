const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/',async (req, res) => {
    fs.readFile('./src/html/test.html','utf-8',(error,data)=>{
        console.log(error);
        console.log(data);
        res.send(data);
    });
});

module.exports = router;