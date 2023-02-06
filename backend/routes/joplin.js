var express = require('express');
var router = express.Router(); // 라우터 객체 생성
var path = require('path');

/* GET home page. */
router.get('/page/r', function(req, res, next) {
    console.log(req.query.page);
    res.sendFile(path.join(__dirname, '../public/joplin/기본 키워드.html'));
});

module.exports = router;
