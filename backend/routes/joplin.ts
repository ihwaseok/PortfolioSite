import Express, { Router, Request, Response, NextFunction } from 'express';
import Mysql, { Connection, MysqlError, OkPacket } from 'mysql';
import MybatisMapper from 'mybatis-mapper';
import Path from 'path';
import Fs from 'fs';
import Rl from 'readline';
import type { ADMIN_MENU } from '../custom/customType';


// 라우터 객체 생성
const router: Router = Express.Router();

// 커넥션 생성
const connection: Connection = Mysql.createConnection({
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

// myBatis xml파일 매핑
MybatisMapper.createMapper([Path.join(__dirname, '../../query/joplin.xml')]);

// myBatis format 설정
const queryFormat: MybatisMapper.Format = { language: 'sql', indent: ' '};

// Html 파일 가져오기
router.get('/page/r', function(req: Request, res: Response, next: NextFunction) {
    const pagePath: string = req.query.pagePath!.toString();
    const readPath: string = Path.join(__dirname, '../../static/joplin' + pagePath);
    
    res.sendFile(readPath, (err: Error) => {
        if (err) {
            res.send(err);
            console.log('routes/joplin.ts : Html 파일 로드 에러');
            console.error(err);
        }
    });
});

// 메뉴 데이터 가져오기
router.get('/menu/r', function(req: Request, res: Response, next: NextFunction) {
    const id: string = req.query.id!.toString();

    if (id == 'all') {
        const query: string = MybatisMapper.getStatement('joplinMapper', 'getMenuAll', undefined, queryFormat);
        
        connection.query(query, function (err: Error, row: object[]) {
            if (err) {
                console.log('routes/joplin.ts : 전체 데이터 쿼리 에러');
                console.error(err);
            }

            res.send(row);
        });
    }
    else {
        const param: MybatisMapper.Params = { id : id };
        const query: string = MybatisMapper.getStatement('joplinMapper', 'getMenuById', param, queryFormat);
        
        connection.query(query, function (err: Error, row: object[]) {
            if (err) {
                console.log('routes/joplin.ts : 개별 데이터 쿼리 에러');
                console.error(err);
            }
            res.send(row);
        });
    }
});

// Joplin Sync 동작
// 1. joplin 하위 폴더를 탐색하며 얻은 데이터를 DB에 저장
// 2. 탐색하면서 html 파일 내부의 리소스 경로 수정
router.get('/sync/r', function(req: Request, res: Response, next: NextFunction) {
    let dataList: ADMIN_MENU[] = [];
    const joplinDir: string = Path.join(__dirname, '../../static/joplin');
    const option: recursiveOption = {
        exceptList : ['_resources', 'pluginAssets', 'index.md'],
        parentId : '',
        rootDir : joplinDir
    };

    // 재귀 탐색으로 dataList에 데이터를 삽입 & md 파일의 리소스 경로 수정
    searchRecursive(joplinDir, dataList, option);

    // 삽입전 테이블 데이터 삭제
    const deleteQuery: string = 'DELETE FROM admin_menu WHERE CATEGORY = "Joplin"';
    connection.query(deleteQuery, function (err: Error) {
        if (err) {
            console.log('routes/joplin.ts : 테이블 삭제 쿼리 에러');
            console.error(err);
        }

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
        if (err) {
            console.log('routes/joplin.ts : 데이터 삽입 쿼리 에러');
            console.error(err);
        }

        console.log('Joplin Sync Menu Data Inserted: ' + result.affectedRows);
    });

    res.send('Success');
});

// 하위 폴더를 재귀적으로 탐색 (Joplin Sync)
function searchRecursive (dirPath: string, result: ADMIN_MENU[], option: recursiveOption): void {
    const childList = Fs.readdirSync(dirPath);
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

type recursiveOption = {
    exceptList: string[],
    parentId: string,
    rootDir: string
}

// Html 파일의 리소스 경로 수정 (Joplin Sync)
function updateResoucePath (path: string): void {
    const resPath: string = '/joplinRes';
    const reader: Fs.ReadStream = Fs.createReadStream(path);
    const lineEvent: Rl.Interface = Rl.createInterface(reader);
    let updatedHtml: Uint8Array[] = [];
    let metaChk: number = 0;
    
    // 한줄씩 읽으면서 처리
    lineEvent.on('line', (line: string) => {

        /* html -> md 로 수정하면서 주석 처리
        // css 경로 수정
        // css 파일은 frontend의 main.ts에서 등록하기 때문에 단순히 에러 안나도록 수정
        if (line.includes('pluginAssets') && !line.includes('joplin')) {
            line = line.replace(/href=/g, 'src=');
            line = line.replace(/pluginAssets/g, resPath + '/pluginAssets');
        }
        */

        // 메타 데이터 주석처리
        if (metaChk < 2) {
            if (line.includes('---')) {
                metaChk++;
            }

            if (metaChk <= 2 && !line.includes('<!--')) {
                line = '<!-- ' + line + ' -->';
            }
            else if (metaChk == 2) {
                metaChk++;
            }
        }

        // 이미지 파일 경로 수정
        if (line.includes('_resources') && !line.includes('joplinRes')) {
            line = line.replace(/\.\.\//g, '');
            line = line.replace(/_resources/g, resPath + '/_resources');
        }
        
        updatedHtml.push(Buffer.from(line + '\r'));
    });

    // 파일 전부 읽은 뒤 이벤트
    lineEvent.on('close', () => {
        Fs.writeFile(path, Buffer.concat(updatedHtml).toString(), (err: NodeJS.ErrnoException | null) => {
            if (err) {
                console.log('routes/joplin.ts : 리소스 경로 수정 파일 다시쓰기 에러');
                console.error(err);
            }
        })
    });
}

// Joplin 그리드 데이터 가져오기
router.get('/menuGrid/r', function(req: Request, res: Response, next: NextFunction) {
    const query = MybatisMapper.getStatement('joplinMapper', 'getMenuGrid', undefined, queryFormat);

    connection.query(query, function (err: Error, row: object[]): void {
        if (err) {
            console.log('routes/joplin.ts : index 그리드 데이터 쿼리 에러');
            console.error(err);
        }

        res.send(row);
    });
});

export default router;