const cors = require("cors");
const express = require("express");
const dotenv = require('dotenv');
const debug = require('debug')('app:server');
const logger = require("morgan");
const compression = require("compression");
const path = require('path');

const errorHandler = require("./util/errorHandler");
const siteData = require('./data.js');

// environment configuration
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'web/views/pages'));
app.set('view engine', 'pug');

// middlewares for development and production env.
// app.use(compression());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(express.static(path.join(__dirname, 'web/src')));
app.use(express.static(path.join(__dirname, 'web/src'), { extensions: ['html'] }));


app.get('/', (req, res) => {
  res.render('index', { ...siteData });
});

app.get('/about', (req, res) => {
  res.render('about', { 
    title: "About", 
    ...siteData 
  });
});

app.get('/services', (req, res) => {
  res.render('services', { 
    title: "Work with me", 
    ...siteData 
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', { 
    title: "Contact", 
    ...siteData 
  });
});

app.get('*', (req, res) => {
  res.redirect('/');
});

// default error handler
app.use(errorHandler);

// start app server
app.listen(port, () => {
  debug(`App running on port ${port}.`);
});

module.exports = app;
