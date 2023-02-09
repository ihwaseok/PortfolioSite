"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const path_1 = __importDefault(require("path"));
// 라우터 객체 생성
const router = express_1.default.Router();
// 커넥션 생성
const connection = mysql_1.default.createConnection({
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
router.get('/page/r', function (req, res, next) {
    console.log(req.query.page);
    res.sendFile(path_1.default.join(__dirname, '../public/joplin/기본 키워드.html'));
});
router.get('/menu/r', function (req, res, next) {
    if (req.query.id == 'all') {
        connection.query('SELECT * FROM menu WHERE is_sub = "N"', function (err, row) {
            if (err)
                throw err;
            res.send(row);
        });
    }
});
exports.default = router;
