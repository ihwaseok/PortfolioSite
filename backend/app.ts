// 외부 모듈 가져오기
import CreateError, { HttpError } from 'http-errors';
import ExpressModule, { Express, Request, Response, NextFunction } from 'express';
import Path from 'path';
import CookieParser from 'cookie-parser';
import Logger from 'morgan';
import Mysql from 'mysql';
import History from 'connect-history-api-fallback';

// 페이지 라우터 등록
import IndexRouter from './routes/index';
import JoplinRouter from './routes/joplin';
import PublicRouter from './routes/public';
import BoardRouter from './routes/board';

// express 애플리케이션 생성
const app: Express = ExpressModule();

// 뷰 엔진 설정
app.set('view engine', 'jade');
app.set('views', Path.join(__dirname, 'views'));

// 커넥션 객체 생성
const connection: Mysql.Connection = Mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'portpolio_site'
});

// DB 연결
connection.connect(function (err: Error) {
  if (err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

// 미들웨어 함수나 함수를 사용 가능한 상태로 준비한다 (마운트)
app.use(Logger('dev'));
app.use(ExpressModule.json());
app.use(ExpressModule.urlencoded({ extended: false }));
app.use(CookieParser());
app.use(ExpressModule.static(Path.join(__dirname, 'public')));
app.use(History({ index: '/' }));

// frontend의 REST API 연결
app.use('/', IndexRouter);
app.use('/joplin', JoplinRouter);
app.use('/public', PublicRouter);
app.use('/board', BoardRouter);

// 리소스 경로 설정
app.use('/joplinRes', ExpressModule.static(Path.join(__dirname, '../static/joplin')));

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction): void {
  next(CreateError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction): void {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 외부에서 import를 위해 지정
export default app;
