import Express, { Router, Request, Response, NextFunction } from 'express';
import Path from 'path';

// 라우터 객체 생성
const router: Router = Express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.sendFile(Path.join(__dirname, '../public/index.html'));
});

export default router;
