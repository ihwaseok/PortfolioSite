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
// Html 파일 가져오기
router.get('/page/r', function (req, res, next) {
    var _a;
    const pagePath = (_a = req.query.pagePath) === null || _a === void 0 ? void 0 : _a.toString();
    const readPath = path_1.default.join(__dirname, '../../static/joplin' + pagePath);
    res.sendFile(readPath, (err) => {
        if (err)
            throw err;
    });
});
// 메뉴 데이터 가져오기
router.get('/menu/r', function (req, res, next) {
    var _a;
    const id = (_a = req.query.id) === null || _a === void 0 ? void 0 : _a.toString();
    if (id == 'all') {
        const query = `
            SELECT A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
                    , GROUP_CONCAT(B.ID ORDER BY B.SORT_NO) AS CHILD_MENU_ID
            FROM admin_menu A
            LEFT OUTER JOIN admin_menu B
                ON A.ID = B.PARENT_ID
                AND B.IS_DIR = 'Y'
            WHERE A.IS_DIR = 'Y'
            GROUP BY A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
            ORDER BY A.ID
        `;
        connection.query(query, function (err, row) {
            if (err)
                throw err;
            res.send(row);
        });
    }
    else {
        const query = `
            SELECT A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
            FROM admin_menu A
            WHERE A.PARENT_ID = '${id}'
            AND A.IS_DIR = 'N'
            ORDER BY A.ID
        `;
        connection.query(query, function (err, row) {
            if (err)
                throw err;
            res.send(row);
        });
    }
});
// Joplin Sync 동작
// 1. joplin 하위 폴더를 탐색하며 얻은 데이터를 DB에 저장
// 2. 탐색하면서 html 파일 내부의 리소스 경로 수정
router.get('/csv/c', function (req, res, next) {
    let dataList = [];
    const joplinDir = path_1.default.join(__dirname, '../../static/joplin');
    const option = {
        exceptList: ['_resources', 'pluginAssets', 'index.md'],
        parentId: '',
        rootDir: joplinDir
    };
    // 재귀 탐색으로 dataList에 데이터를 삽입 & md 파일의 리소스 경로 수정
    searchRecursive(joplinDir, dataList, option);
    // 삽입전 테이블 데이터 삭제
    const deleteQuery = 'TRUNCATE TABLE admin_menu';
    connection.query(deleteQuery, function (err) {
        if (err)
            throw err;
        console.log('Joplin Sync Menu Table Truncated');
    });
    // 데이터 삽입
    const insertQuery = 'INSERT INTO admin_menu (ID, NAME, PARENT_ID, CATEGORY, PATH, IS_DIR, SORT_NO, CREATED_DT) VALUES ?';
    const values = [];
    for (const data of dataList) {
        const value = [data.ID, data.NAME, data.PARENT_ID, data.CATEGORY, data.PATH, data.IS_DIR, data.SORT_NO, data.CREATE_DT];
        values.push(value);
    }
    connection.query(insertQuery, [values], function (err, result) {
        if (err)
            throw err;
        console.log('Joplin Sync Menu Data Inserted: ' + result.affectedRows);
    });
    res.send('Success');
});
// 하위 폴더를 재귀적으로 탐색 (Joplin Sync)
function searchRecursive(dirPath, result, option) {
    const childList = fs_1.default.readdirSync(dirPath);
    let sortNo = 0;
    for (const child of childList) {
        if (!option.exceptList.includes(child)) {
            const TIME_ZONE = 3240 * 10000;
            const now = new Date(+new Date() + TIME_ZONE).toISOString().replace('T', ' ').substring(0, 19);
            let data = { ID: '', NAME: '', PARENT_ID: '', CATEGORY: '', PATH: '', IS_DIR: '', SORT_NO: 0, CREATE_DT: '' };
            sortNo++;
            data.ID = option.parentId == '' ? sortNo.toString().padStart(3, '0') : option.parentId + '_' + sortNo.toString().padStart(3, '0');
            data.PARENT_ID = option.parentId;
            data.CATEGORY = 'Joplin';
            data.PATH = dirPath + '/' + child;
            data.SORT_NO = sortNo;
            data.CREATE_DT = now;
            if (child.includes('.md')) {
                data.IS_DIR = 'N';
                data.NAME = child.replace('.md', '');
                // 리소스 경로 수정
                updateResoucePath(data.PATH);
            }
            else {
                data.IS_DIR = 'Y';
                data.NAME = child;
                // 재귀에 들어가기 전에 현재 ID를 parent ID로
                option.parentId = data.ID;
                // 재귀함수
                searchRecursive(data.PATH, result, option);
                // 재귀에서 빠져 나온경우 parentId 맞춰줌
                let idList = option.parentId.split('_');
                idList.pop();
                option.parentId = idList.join('_');
            }
            data.PATH = data.PATH.replace(option.rootDir, '');
            result.push(data);
        }
    }
}
// Html 파일의 리소스 경로 수정 (Joplin Sync)
function updateResoucePath(path) {
    const resPath = '/joplinRes';
    const reader = fs_1.default.createReadStream(path);
    const lineEvent = readline_1.default.createInterface(reader);
    let updatedHtml = [];
    let metaChk = 0;
    // 한줄씩 읽으면서 처리
    lineEvent.on('line', (line) => {
        /* html -> md 로 수정하면서 주석 처리
        // css 경로 수정
        // css 파일은 frontend의 main.ts에서 등록하기 때문에 단순히 에러 안나도록 수정
        if (line.includes('pluginAssets') && !line.includes('joplin')) {
            line = line.replace(/href=/g, 'src=');
            line = line.replace(/pluginAssets/g, resPath + '/pluginAssets');
        }
        */
        // 메타데이터 삭제
        if (metaChk < 2) {
            if (line.includes('---')) {
                metaChk++;
            }
            line = '';
        }
        // 이미지 파일 경로 수정
        if (line.includes('src=') && !line.includes('joplinRes')) {
            line = line.replace(/\.\.\//g, '');
            line = line.replace(/_resources/g, resPath + '/_resources');
        }
        updatedHtml.push(Buffer.from(line + '\r'));
    });
    // 파일 전부 읽은 뒤 이벤트
    lineEvent.on('close', () => {
        fs_1.default.writeFile(path, Buffer.concat(updatedHtml).toString(), (err) => {
            if (err)
                throw err;
        });
    });
}
exports.default = router;
