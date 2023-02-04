var express = require('express');
var router = express.Router(); // 라우터 객체 생성

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
