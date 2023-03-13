import Express, { Router, Request, Response, NextFunction } from 'express';
import Mysql, { Connection, MysqlError, OkPacket } from 'mysql';
import MybatisMapper from 'mybatis-mapper';
import Path from 'path';

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
MybatisMapper.createMapper([Path.join(__dirname, '../../query/public.xml')]);

// myBatis format 설정
const queryFormat: MybatisMapper.Format = { language: 'sql', indent: ' '};

// 메뉴 데이터 가져오기
router.get('/menu/r', function(req: Request, res: Response, next: NextFunction) {
    const id: string = req.query.id!.toString();

    if (id == 'all') {
        const query: string = MybatisMapper.getStatement('publicMapper', 'getMenuAll', undefined, queryFormat);
        
        connection.query(query, function (err: Error, row: object[]) {
            if (err) {
                console.log('routes/public.ts : 전체 데이터 쿼리 에러');
                console.error(err);
            }

            res.send(row);
        });
    }
});

export default router;