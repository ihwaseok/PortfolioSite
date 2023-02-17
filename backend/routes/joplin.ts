import express, { Request, Response, NextFunction } from 'express';
import mysql, { Connection, MysqlError, OkPacket } from 'mysql';
import path from 'path';
import fs, { read, WriteStream } from 'fs'
import rl from 'readline'
import type { ADMIN_MENU } from '../custom/customType'


// 라우터 객체 생성
const router = express.Router();

// 커넥션 생성
const connection:Connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'portpolio_site'
});

// DB 연결
connection.connect(function (err:MysqlError) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

// Html 파일 가져오기
router.get('/page/r', function(req:Request, res:Response, next:NextFunction) {
    if (typeof req.query.pagePath == 'string') {
        const readPath: string = path.join(__dirname, '../../static/joplin' + req.query.pagePath);
        
        res.sendFile(readPath, (err) => {
            if (err) throw err;
        });
    }
});

// 메뉴 데이터 가져오기
router.get('/menu/r', function(req: Request, res: Response, next: NextFunction) {
    if (req.query.id == 'all') {
        const query = `
            SELECT A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
                    , GROUP_CONCAT(B.ID ORDER BY B.SORT_NO) AS CHILD_MENU_ID
            FROM admin_menu A
            LEFT OUTER JOIN admin_menu B
                ON A.ID = B.PARENT_ID
                AND B.IS_DIR = 'N'
            WHERE A.IS_DIR = 'N'
            GROUP BY A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
            ORDER BY A.ID
        `;

        connection.query(query, function (err:Error, row:object[]) {
            if (err) throw err;
            res.send(row);
        });
    }
    else {
        const query = `
            SELECT A.ID, A.NAME, A.PARENT_ID, A.PATH, A.SORT_NO, A.IS_DIR
            FROM admin_menu A
            WHERE A.PARENT_ID = ${req.query.id}
            AND A.ID_DIR = 'Y'
            ORDER BY A.ID
        `;

        connection.query(query, function (err:Error, row:object[]) {
            if (err) throw err;
            res.send(row);
        });
    }
});

// Joplin Sync 동작
// 1. joplin 하위 폴더를 탐색하며 얻은 데이터를 DB에 저장
// 2. 탐색하면서 html 파일 내부의 리소스 경로 수정
router.get('/csv/c', function(req: Request, res: Response, next: NextFunction) {
    let dataList: ADMIN_MENU[] = [];
    const joplinDir = path.join(__dirname, '../../static/joplin');
    const option: recursiveOption = {
        exceptList : ['_resources', 'pluginAssets', 'index.html'],
        parentId : '',
        rootDir : joplinDir
    };

    // 재귀 탐색으로 dataList에 데이터를 삽입 & Html 파일의 리소스 경로 수정
    searchRecursive(joplinDir, dataList, option);

    // 삽입전 테이블 데이터 삭제
    const deleteQuery: string = 'TRUNCATE TABLE admin_menu';
    connection.query(deleteQuery, function (err) {
        if (err) throw err;

        console.log('Joplin Sync Menu Table Truncated');
    });
    
    // 데이터 삽입
    const insertQuery: string = 'INSERT INTO admin_menu (ID, NAME, PARENT_ID, CATEGORY, PATH, IS_DIR, SORT_NO, CREATED_DT) VALUES ?';
    const values: (string | number)[][] = [];
    for (const data of dataList) {
        const value: (string | number)[] = [data.ID, data.NAME, data.PARENT_ID, data.CATEGORY, data.PATH, data.IS_DIR, data.SORT_NO, data.CREATE_DT];
        values.push(value);
    }

    connection.query(insertQuery, [values], function (err: Error | null, result: OkPacket): void {
        if (err) throw err;

        console.log('Joplin Sync Menu Data Inserted: ' + result.affectedRows);
    });

    res.send('Success');
});

// 하위 폴더를 재귀적으로 탐색 (Joplin Sync)
function searchRecursive (dirPath: string, result: ADMIN_MENU[], option: recursiveOption): void {
    const childList = fs.readdirSync(dirPath);
    let sortNo: number = 0;

    for (const child of childList) {
        if (!option.exceptList.includes(child)) {
            const TIME_ZONE: number = 3240 * 10000;
            const now: string = new Date(+new Date() + TIME_ZONE).toISOString().replace('T', ' ').substring(0, 19);
            let data: ADMIN_MENU = {ID:'', NAME:'', PARENT_ID:'', CATEGORY:'', PATH:'', IS_DIR:'', SORT_NO:0, CREATE_DT:''};
            sortNo++;

            data.ID = option.parentId == '' ? sortNo.toString().padStart(3, '0') : option.parentId + '_' + sortNo.toString().padStart(3, '0');
            data.PARENT_ID = option.parentId;
            data.CATEGORY = 'Joplin'
            data.PATH = dirPath + '/' + child;
            data.SORT_NO = sortNo;
            data.CREATE_DT = now;
            
            if (child.includes('.html')) {
                data.IS_DIR = 'N';
                data.NAME = child.replace('.html', '');

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

type recursiveOption = {
    exceptList: string[],
    parentId: string,
    rootDir: string
}

// Html 파일의 리소스 경로 수정 (Joplin Sync)
function updateResoucePath (path: string): void {
    const resPath: string = '/joplin';
    const reader = fs.createReadStream(path);
    const lineEvent = rl.createInterface(reader);
    let updatedHtml: Uint8Array[] = [];
    
    // 한줄씩 읽으면서 처리
    lineEvent.on('line', (line: string) => {
        // css 경로 수정
        // css 파일은 frontend의 main.ts에서 등록하기 때문에 단순히 에러 안나도록 수정
        if (line.includes('pluginAssets') && !line.includes('joplin')) {
            line = line.replace(/href=/g, 'src=');
            line = line.replace(/pluginAssets/g, resPath + '/pluginAssets');
        }

        // 이미지 파일 경로 수정
        if (line.includes('_resources') && !line.includes('joplin')) {
            line = line.replace(/\.\.\//g, '');
            line = line.replace(/_resources/g, resPath + '/_resources');
        }
        
        updatedHtml.push(Buffer.from(line + '\r'));
    });

    // 파일 전부 읽은 뒤 이벤트
    lineEvent.on('close', () => {
        fs.writeFile(path, Buffer.concat(updatedHtml).toString(), (err) => {
            if (err) throw err;
        })
    });
}

export default router;