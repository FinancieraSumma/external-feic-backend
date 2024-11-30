const express = require('express');
const router = express.Router();
const testSqlController = require('../controllers/testSqlController');

router.get('/testSql', testSqlController.testSql);
router.get('/test', (req, res) => {
    res.send('Test route is working');
  });
  
module.exports = router;