"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router(); // 라우터 객체 생성
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
exports.default = router;
