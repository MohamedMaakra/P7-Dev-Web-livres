const express= require('express');
const router=  express.Router();
const userCtrl= require('../controllers/user')
const validator = require('../middleware/validator')
const rateLimit = require('express-rate-limit')

const limit = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 30, // Limite chaque IP par `window` (ici, par 15 minutes) 
	standardHeaders: true, 
	legacyHeaders: false, 
})

router.post('/signup',[validator.checkMail, validator.checkPassword], validator.Validator, userCtrl.signup);
router.post('/login', limit, [validator.checkMail, validator.checkPassword], validator.Validator, userCtrl.login)


module.exports= router;