import express, { Request, Response, NextFunction} from 'express';
import mysql, { Connection, MysqlError } from 'mysql';
import bcrypt from 'bcryptjs';
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

// URL 등록
router.get('/', function(req:Request, res:Response, next:NextFunction) {
  connection.query('SELECT * FROM users', function (err, rows) {
    if (err) throw err;
    res.send(rows);
  });
});

router.post('/signUp', function (req:Request, res:Response) {
  const user = {
    'userid'  : req.body.user.userid,
    'name'    : req.body.user.name,
    'password': req.body.user.password
  };

  connection.query('SELECT userid FROM users WHERE userid = "' + user.userid + '"', function (err:Error, row:object[]) {
    // 동일한 아이디가 없을 경우 등록
    if (row[0] == undefined) {
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);

      connection.query('INSERT INTO users (userid, name, password) VALUES ("' + user.userid + '","' + user.name + '","' + encryptedPassword + '")', user, function (err:Error | null, row2:object[]) {
        if (err) throw err;
      });

      res.json({
        success: true,
        message: 'Sign Up Success!'
      })
    }
    else {
      res.json({
        success: false,
        message: 'Sign Up Failed Please use another ID'
      })
    }
  });
});

router.post('/login', function (req:Request, res:Response) {
  const user = {
    'userid'  : req.body.user.userid,
    'password': req.body.user.password
  }

  connection.query('SELECT userid, password FROM users WHERE userid = "' + user.userid + '"', function (err:Error, row:typeof user[]) {
    if (err) {
      res.json({
        success: false,
        message: 'Login failed please check your id or password!'
      })
    }

    if (row[0] !== undefined && row[0].userid === user.userid) {
      bcrypt.compare(user.password, row[0].password, function (err, res2) {
        if (res2) {
          res.json({
            success: true,
            message: 'Login successful!'
          })
        }
        else {
          res.json({
            message: 'Login failed please check your id or password!'
          })
        }
      });
    }
  })
});

export default router;
