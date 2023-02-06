// 외부 모듈 가져오기
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

// 페이지 라우터 등록
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var joplinRouter = require('./routes/joplin');

// express 애플리케이션 생성
var app = express();

// 뷰 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 커넥션 객체 생성
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'pwa_crud'
});

// DB 연결
connection.connect(function (err) {
  if (err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

// 미들웨어 함수나 함수를 사용 가능한 상태로 준비한다 (마운트)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// frontend의 REST API 연결
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/joplin', joplinRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 외부에서 require를 위해 지정
module.exports = app;
