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
    if (typeof req.query.pagePath == 'string') {
        res.sendFile(req.query.pagePath);
    }
});

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

export default router;