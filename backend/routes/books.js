const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, multer, booksCtrl.createBook);
router.get('/:id', booksCtrl.getOneBook);
router.put('/:id', auth, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/bestrating', booksCtrl.getBestBooks);
router.post('/:id/rating', auth, booksCtrl.rateBook);

module.exports = router;