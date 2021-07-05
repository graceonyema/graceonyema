const express = require("express");
const path = require('path');

const indexRouter = require("./routes/index");
// const dashboardRouter = require("./routes/dashboard");

const web = express();


/* view engine setup */
web.set('views', path.join(__dirname, 'views'));
web.set('view engine', 'pug');

// web.use(express.static(path.join(__dirname, 'dist')));
web.use(express.static(path.join(__dirname, 'src'), { extensions: ['html'] }));

/* sub-webs and routes */
// web.use('/manage/', dashboardRouter);
web.use('/', indexRouter);

web.get('*', (req, res) => {
  res.redirect('/');
});

module.exports = web;
