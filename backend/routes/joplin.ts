import express, { Request, Response, NextFunction } from 'express';
import mysql, { Connection, MysqlError } from 'mysql';
import path from 'path';
import fs, { read, WriteStream } from 'fs'
import rl from 'readline'


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
        const resPath: string = '/joplin';
        const reader = fs.createReadStream(readPath);
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
            fs.writeFile(readPath, Buffer.concat(updatedHtml).toString(), (err) => {
                if (err) throw err;

                res.sendFile(readPath, (err) => {
                    if (err) throw err;
                });
            })
        });
    }
});

// 메뉴 데이터 가져오기
router.get('/menu/r', function(req: Request, res: Response, next: NextFunction) {
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

        connection.query(query, function (err:Error, row:object[]) {
            if (err) throw err;
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

        connection.query(query, function (err:Error, row:object[]) {
            if (err) throw err;
            res.send(row);
        });
    }
});

// Joplin Sync 동작
router.get('/csv/c', function(req: Request, res: Response, next: NextFunction) {
    console.log('express---------------------------------------------------');
    // html파일 md파일로 읽도록 변경 먼저
    fs.readdir(path.join(__dirname, '../joplin'), function (err: Error | null, items: string[] | null) {
        console.log(items);
    })

    res.send();
});

export default router;