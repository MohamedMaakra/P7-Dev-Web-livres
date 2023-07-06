const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const bookCtrl = require('../controllers/book')
const multer = require('../middleware/multer');
const sharp = require('../middleware/sharp')

router.get('/',bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
//router.get('/bestrating',);
router.post('/',auth, multer, sharp, bookCtrl.creatBook);
//router.post('/:id/rating', auth, );
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router