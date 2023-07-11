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
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé'});
            } else {
                if (req.file) {
                    const filename = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Book.updateOne({ _id: req.params.id}, {...bookObject})
                            .then(() => res.status(200).json({ message: 'Livre modifié'}))
                            .catch(error => res.status(401).json({ error }));
                        });
                } else {
                    Book.updateOne({ _id: req.params.id}, {...bookObject})
                        .then(() => res.status(200).json({ message: 'Livre modifié'}))
                        .catch(error => res.status(401).json({ error }));
                }
            }
        })
        .catch(error => {res.status(400).json({ error });
    });
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({_id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({ message: 'Livre supprimé'});})
                        .catch(error => res.status(401).json({ error }));
                });
            };
        })
        .catch( error => {res.status(500).json({ error });
    });
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