var createError = require('http-errors');
var express = require('express');
const mysql = require('mysql2')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var { connectmySql,connectionDB } = require('./connectDB');
const MainRouter = require('./routes/users.update');

console.log("step5")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', MainRouter);



// app.use('/users',signUpRouter);
// app.use('/users',loginRouter);
// app.use('/users',deleteRouter);
// app.use('/users',updateRouter);

// db connection
connectionDB().then(() => {
  console.log('db connection success')
}).catch((err) => {
  console.log('db connection error : ', err);
})


// MySQL connection
connectmySql().then((mysqlConnection) => {
  console.log('MySQL connected successfully1');
}).catch((err) => {
  console.log('MySQL connection error:', err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
