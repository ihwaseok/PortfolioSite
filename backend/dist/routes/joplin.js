"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router(); // 라우터 객체 생성
/* GET home page. */
router.get('/page/r', function (req, res, next) {
    console.log(req.query.page);
    res.sendFile(path_1.default.join(__dirname, '../public/joplin/기본 키워드.html'));
});
exports.default = router;
