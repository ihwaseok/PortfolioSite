import express, { Request, Response, NextFunction } from 'express';
import mysql, { Connection, MysqlError } from 'mysql';
import path from 'path';

// 라우터 객체 생성
const router = express.Router();

// 커넥션 생성
const connection:Connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'pwa_crud'
});

// DB 연결
connection.connect(function (err:MysqlError) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

router.get('/page/r', function(req:Request, res:Response, next:NextFunction) {
    console.log(req.query.page);
    res.sendFile(path.join(__dirname, '../public/joplin/기본 키워드.html'));
});

router.get('/menu/r', function(req: Request, res: Response, next: NextFunction) {
    if (req.query.id == 'all') {
        connection.query('SELECT * FROM menu WHERE is_sub = "N" ORDER BY id', function (err:Error, row:object[]) {
            if (err) throw err;
            res.send(row);
        });
    }
});

export default router;