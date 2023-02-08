import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
const router = express.Router(); // 라우터 객체 생성

/* GET home page. */
router.get('/page/r', function(req:Request, res:Response, next:NextFunction) {
    console.log(req.query.page);
    res.sendFile(path.join(__dirname, '../public/joplin/기본 키워드.html'));
});

export default router;