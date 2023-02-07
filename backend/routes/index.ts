import express, { Express, Request, Response, NextFunction} from 'express';
import path from 'path';
const router = express.Router(); // 라우터 객체 생성

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default router;
