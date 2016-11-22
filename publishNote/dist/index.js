'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _post = require('./post');

var _post2 = _interopRequireDefault(_post);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

var _process$argv = _toArray(process.argv),
    interpreter = _process$argv[0],
    entry = _process$argv[1],
    aticlePath = _process$argv[2],
    title = _process$argv[3],
    tags = _process$argv.slice(4);

aticlePath = _path2.default.resolve(__dirname, aticlePath);

var article = _fs2.default.readFileSync(aticlePath, 'utf-8');

(0, _post2.default)(article, tags, title);
//# sourceMappingURL=../map/index.js.map
