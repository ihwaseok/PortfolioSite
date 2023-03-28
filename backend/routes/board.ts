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
MybatisMapper.createMapper([Path.join(__dirname, '../../query/board.xml')]);

// myBatis format 설정
const queryFormat: MybatisMapper.Format = { language: 'sql', indent: ' '};

// 메뉴 데이터 가져오기
router.get('/boardList/r', function(req: Request, res: Response, next: NextFunction) {
    const path: string = req.query.pagePath!.toString();
    
    if (path == 'all') {
        const query: string = MybatisMapper.getStatement('boardMapper', 'selectBoardList', undefined, queryFormat);
        
        connection.query(query, function (err: Error, row: object[]) {
            if (err) {
                console.log('routes/board.ts : 전체 데이터 쿼리 에러');
                console.error(err);
            }
            
            res.send(row);
        });
    }
});

// 새 게시글 등록
router.post('/boardList/c', function(req: Request, res: Response, next: NextFunction) {
    const formData: MybatisMapper.Params = req.body.params;
    const query: string = MybatisMapper.getStatement('boardMapper', 'insertBoardList', formData, queryFormat);
    
    connection.query(query, function (err: Error, row: object[]) {
        if (err) {
            console.log('routes/board.ts : 데이터 수정 쿼리 에러');
            console.error(err);
        }
        
        res.send(row);
    });
    
});

// 상세 페이지 데이터 가져오기
router.get('/detail/r', function(req: Request, res: Response, next: NextFunction) {
    const formData: MybatisMapper.Params = { id : req.query.id!.toString() };   
    const query: string = MybatisMapper.getStatement('boardMapper', 'selectBoardDetail', formData, queryFormat);
    
    connection.query(query, function (err: Error, row: object[]) {
        if (err) {
            console.log('routes/board.ts : 상세 데이터 조회 쿼리 에러');
            console.error(err);
        }
        
        res.send(row);
    });
    
});

// 상세 페이지 데이터 수정
router.post('/detail/u', function(req: Request, res: Response, next: NextFunction) {
    const formData: MybatisMapper.Params = req.body.params;
    const query: string = MybatisMapper.getStatement('boardMapper', 'updateBoard', formData, queryFormat);
    
    connection.query(query, function (err: Error, row: object[]) {
        if (err) {
            console.log('routes/board.ts : 데이터 수정 쿼리 에러');
            console.error(err);
        }
        
        res.send(row);
    });
    
});

// 상세 페이지 데이터 삭제
router.post('/detail/d', function(req: Request, res: Response, next: NextFunction) {
    const formData: MybatisMapper.Params = req.body.params;
    const query: string = MybatisMapper.getStatement('boardMapper', 'deleteBoard', formData, queryFormat);
    
    connection.query(query, function (err: Error, row: object[]) {
        if (err) {
            console.log('routes/board.ts : 데이터 수정 쿼리 에러');
            console.error(err);
        }
        
        res.send(row);
    });
    
});

export default router;