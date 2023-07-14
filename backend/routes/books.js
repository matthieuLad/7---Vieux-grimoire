const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");

router.get("/", booksCtrl.getAllBooks);
router.get("/bestrating", booksCtrl.getBestBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/", auth, multer, sharp.imageUpload, booksCtrl.createBook);
router.put("/:id", auth, multer, sharp.imageUpload, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.post("/:id/rating", auth, booksCtrl.rateBook);

module.exports = router;
