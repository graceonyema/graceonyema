const express = require('express');
const router = express.Router();
const siteData = require('../data/siteData.json');


/** Routes **/

// Home
router.get('/', (req, res) => {
  res.render('index', {
    ...siteData
  });
});

module.exports = router;
