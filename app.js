var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 밑에는 라우트 파일 저런식으로 열면 라우트 파일이 연결됨



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var indexRouter = require('./routes/index');
var signup = require('./routes/signup');
var makeSignUp = require('./routes/makeSignUp');
var signup_creator = require('./routes/signup_creator');
var login = require('./routes/login');
var list = require('./routes/list');
var board = require('./routes/board');
var info_show = require('./routes/info_show');
var mypage = require('./routes/mypage');
var mypage_creator = require('./routes/mypage_creator');
var write_team = require('./routes/write_team');
var write_show = require('./routes/write_show');
var list_search = require('./routes/list_search');
var star = require('./routes/star');
var show_manage = require('./routes/show_manage');

var logout = require('./routes/logout')
var revise_infor = require('./routes/revise_infor');
var reserv = require('./routes/reserv');


app.use('/', indexRouter);
app.use('/signup', signup);
app.use('/makeSignUp', makeSignUp);
app.use('/signup_creator', signup_creator);
app.use('/login', login);
app.use('/list', list);
app.use('/index', indexRouter);
app.use('/board', board);
app.use('/info_show', info_show);
app.use('/mypage', mypage);
app.use('/mypage_creator',mypage_creator);
app.use('/write_team',write_team);
app.use('/write_show', write_show);
app.use('/list_search',list_search);
app.use('/star', star);
app.use('/show_manage', show_manage);


app.use('/logout',logout);
app.use('/revise_infor',revise_infor);
app.use('/reserv',reserv);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end( err.message);
});

module.exports = app;
