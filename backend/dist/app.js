"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 외부 모듈 가져오기
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mysql_1 = __importDefault(require("mysql"));
// 페이지 라우터 등록
const index_1 = __importDefault(require("./routes/index"));
const joplin_1 = __importDefault(require("./routes/joplin"));
// express 애플리케이션 생성
const app = (0, express_1.default)();
// 뷰 엔진 설정
app.set('view engine', 'jade');
app.set('views', path_1.default.join(__dirname, 'views'));
// 커넥션 객체 생성
const connection = mysql_1.default.createConnection({
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
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// frontend의 REST API 연결
app.use('/', index_1.default);
app.use('/joplin', joplin_1.default);
// 리소스 경로 설정
app.use('/joplinRes', express_1.default.static(path_1.default.join(__dirname, '../static/joplin')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// 외부에서 import를 위해 지정
exports.default = app;
