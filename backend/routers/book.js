const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const bookCtrl = require('../controllers/book')



router.get('/',bookCtrl.getAllBook);
router.get('/:id',bookCtrl.getOneBook);
router.get('/bestrating',);
router.post('/', bookCtrl.creatBook);
router.post('/:id/rating', auth,);
router.put('/:id', auth,);
router.delete('/:id',bookCtrl.deleteBook);

module.exports = router