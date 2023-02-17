"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
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
    if (typeof req.query.pagePath == 'string') {
        const readPath = path_1.default.join(__dirname, '../../static/joplin' + req.query.pagePath);
        const resPath = '/joplin';
        const reader = fs_1.default.createReadStream(readPath);
        const lineEvent = readline_1.default.createInterface(reader);
        let updatedHtml = [];
        lineEvent.on('line', (line) => {
            if (line.includes('pluginAssets') && !line.includes('joplin')) {
                line = line.replace(/href=/g, 'src=');
                line = line.replace(/pluginAssets/g, resPath + '/pluginAssets');
            }
            if (line.includes('_resources') && !line.includes('joplin')) {
                line = line.replace(/\.\.\//g, '');
                line = line.replace(/_resources/g, resPath + '/_resources');
            }
            updatedHtml.push(Buffer.from(line + '\r'));
        });
        lineEvent.on('close', () => {
            fs_1.default.writeFile(readPath, Buffer.concat(updatedHtml).toString(), (err) => {
                if (err)
                    throw err;
                res.sendFile(readPath, (err) => {
                    if (err)
                        throw err;
                });
            });
        });
    }
});
router.get('/menu/r', function (req, res, next) {
    if (req.query.id == 'all') {
        const query = `
            select a.id AS ID, a.name AS NAME, a.parent_id AS PARENT_ID, a.path AS PATH, a.sort_no AS SORT_NO, a.is_sub as IS_DIR
                    , group_concat(b.id order by b.sort_no) as CHILD_MENU_ID
            from menu a
            left outer join menu b
                on a.id = b.parent_id
                and b.is_sub = 'N'
            where a.is_sub = 'N'
            group by a.id, a.name, a.parent_id, a.path, a.sort_no, a.is_sub
            order by a.id
        `;
        connection.query(query, function (err, row) {
            if (err)
                throw err;
            res.send(row);
        });
    }
    else {
        const query = `
            select a.id AS ID, a.name AS NAME, a.parent_id AS PARENT_ID, a.path AS PATH, a.sort_no AS SORT_NO, a.is_sub as IS_DIR
            from menu a
            where a.parent_id = ${req.query.id}
            and a.is_sub = 'Y'
            order by a.id
        `;
        connection.query(query, function (err, row) {
            if (err)
                throw err;
            res.send(row);
        });
    }
});
router.get('/csv/c', function (req, res, next) {
    console.log('express---------------------------------------------------');
    // html파일 md파일로 읽도록 변경 먼저
    fs_1.default.readdir(path_1.default.join(__dirname, '../joplin'), function (err, items) {
        console.log(items);
    });
    res.send();
});
exports.default = router;
