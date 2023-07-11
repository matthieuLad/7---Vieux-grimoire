const Book = require('../models/Book');
const fs = require('fs');


exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    const book = new Book({
        ...bookObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
        .then(() => {res.status(200).json({ message: 'Livre enregistré !'});
    })
        .catch((error) => {res.status(400).json({ error });
    });
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({
        _id: req.params.id
    })
        .then(
            (book) => {res.status(200).json(book)}
        )
        .catch((error) => {res.status(404).json({ error });
    });
}

exports.modifyBook = (req, res, next) => {

}

exports.deleteBook = (req, res, next) => {

}

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(
            (books) => {
                res.status(200).json(books);
            }
        )
        .catch((error) => res.status(400).json({ error: error }))
}

exports.getBestBooks = (req, res, next) => {

}

exports.rateBook = (req, res, next) => {

}