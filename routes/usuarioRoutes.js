const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/register', usuarioController.registerUser);
router.post('/verify', usuarioController.verifyUser);
router.post('/login', usuarioController.login);
router.post('/verifyLogin', usuarioController.verifyLogin);
router.post('/forgotPassword', usuarioController.forgotPassword);
router.post('/resetPassword', usuarioController.resetPassword);

module.exports = router;