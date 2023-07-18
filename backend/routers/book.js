const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const bookCtrl = require('../controllers/book');
const multer = require('../middleware/multer');
const sharp = require('../middleware/sharp');

router.get('/', bookCtrl.getAllBook);
router.get('/bestrating', bookCtrl.bestRating); 
router.post('/:id/rating', auth, bookCtrl.ratingBook)
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer, sharp, bookCtrl.createBook);
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
