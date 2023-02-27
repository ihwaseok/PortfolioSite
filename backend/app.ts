// 외부 모듈 가져오기
import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mysql from 'mysql';

// 페이지 라우터 등록
import indexRouter from './routes/index';
import joplinRouter from './routes/joplin';

// express 애플리케이션 생성
const app = express();

// 뷰 엔진 설정
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

// 커넥션 객체 생성
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'portpolio_site'
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
app.use('/joplin', joplinRouter);

// 리소스 경로 설정
app.use('/joplinRes', express.static(path.join(__dirname, '../static/joplin')));

// catch 404 and forward to error handler
app.use(function(req:Request, res:Response, next:NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err:HttpError, req:Request, res:Response, next:NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 외부에서 import를 위해 지정
export default app;
