'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = function () {
  var _arguments = Array.prototype.slice.call(arguments);

  article = _arguments[0];
  tags = _arguments[1];
  title = _arguments[2];


  getMainPage().then(login).then(getWritePage).then(getDraftId).then(getTags).then(postBlog).then(function (data) {
    console.log('创建Blog成功!');
    console.log('Blog的Url为:', '' + origin + data.url);
    console.log(data);
  }).catch(function (err) {
    return console.log(err.body);
  });
};

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _conf = require('./conf');

var _conf2 = _interopRequireDefault(_conf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var article = '',
    tags = [],
    title = '';

var base_headers = {
  Accept: '*/*',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2',
  'Cache-Control': 'no-cache',
  Connection: 'keep-alive',
  DNT: 1,
  Host: 'segmentfault.com',
  Origin: 'https://segmentfault.com',
  Pragma: 'no-cache',
  Referer: 'https://segmentfault.com/',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest' },
    origin = 'https://segmentfault.com',
    urls = {
  origin: origin,
  login: origin + '/api/user/login',
  write: origin + '/write?freshman=1',
  draft: origin + '/api/article/draft/save',
  tag: origin + '/api/tags/search',
  blog: origin + '/api/articles/add' };

var cookie = void 0;

function getToken(s) {
  var $ = _cheerio2.default.load(s),
      text = $('body>script').eq(1).text(),
      fn = new Function('window', text + ';return window.SF.token'),
      token = fn({});

  $ = null;
  return token;
}

function getBlogId(s) {
  var $ = _cheerio2.default.load(s),
      v = $('select[name=blogId]').val();
  $ = null;

  return v;
}

function getMainPage() {
  return new Promise(function (fulfill, reject) {
    _superagent2.default.get(urls.origin).end(function (err, res) {
      if (err) reject(err);else fulfill(res);
    });
  });
}

function login(res) {
  var token = getToken(res.text);

  cookie = res.headers['set-cookie'].join(',').match(/(PHPSESSID=.+?);/)[1];
  return new Promise(function (fulfill, reject) {
    _superagent2.default.post(urls.login).query({ '_': token }).set(base_headers).set('Cookie', cookie).type('form').send(_conf2.default).redirects(0).end(function (err, res) {
      if (err) reject(err);else if (res.body.message !== '') reject(res);else fulfill();
    });
  });
}

function getWritePage() {
  var referer = urls.write;
  return new Promise(function (fulfill, reject) {
    _superagent2.default.get(urls.write).set(base_headers).set('Cookie', cookie).set('Referer', referer).end(function (err, res) {
      if (err) reject(err);else fulfill(res);
    });
  });
}

function getDraftId(res) {
  var referer = urls.write,
      token = getToken(res.text),
      blogId = getBlogId(res.text);

  return new Promise(function (fulfill, reject) {
    _superagent2.default.post(urls.draft).query({ '_': token }).set(base_headers).set('Cookie', cookie).set('Referer', referer).type('form').send({
      do: 'saveArticle',
      type: 'article',
      title: '',
      text: '',
      weibo: 0,
      blogId: blogId,
      id: '',
      articleId: '',
      'tags%5B%5D': ''
    }).redirects(0).end(function (err, res) {
      if (err) reject(err);else fulfill([res.body.data, token, blogId]);
    });
  });
}

function getTags() {
  var _arguments$ = _slicedToArray(arguments[0], 3),
      draftId = _arguments$[0],
      token = _arguments$[1],
      blogId = _arguments$[2];

  var referer = urls.write;

  var pts = [];

  tags.forEach(function (tag) {
    return pts.push(new Promise(function (fulfill, reject) {
      _superagent2.default.get(urls.tag).query({ 'q': tag }).query({ '_': token }).set(base_headers).set('Cookie', cookie).set('Referer', referer).redirects(0).end(function (err, res) {
        if (err) reject(err);else fulfill(res);
      });
    }).then(function (res) {
      var v = res.body.data.filter(function (_tag) {
        return _tag.name === tag;
      })[0];
      if (v) return v.id;
    }));
  });
  return Promise.all(pts).then(function (ids) {
    return [draftId, token, blogId, ids.filter(function (v) {
      return v;
    })];
  });
}

function postBlog() {
  var _arguments$2 = _slicedToArray(arguments[0], 4),
      draftId = _arguments$2[0],
      token = _arguments$2[1],
      blogId = _arguments$2[2],
      tagIds = _arguments$2[3],
      referer = urls.write,
      blog = {
    title: title,
    text: article,
    id: '',
    blogId: blogId,
    weibo: 0,
    license: 1,
    draftId: draftId,
    created: ''
  },
      content = Object.keys(blog).map(function (k) {
    return k + '=' + blog[k];
  }).concat(tagIds.map(function (tagId) {
    return 'tags%5B%5D=' + tagId;
  })).join('&');

  return new Promise(function (fulfill, reject) {
    _superagent2.default.post(urls.blog).query('_=' + token).set(base_headers).set('Cookie', cookie).set('Referer', referer).type('form').send(content).redirects(0).end(function (err, res) {
      if (err) reject(err);else fulfill(res.body.data);
    });
  });
}
//# sourceMappingURL=../maps/post.js.map
