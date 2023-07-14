const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  const book = new Book({
    ...bookObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(200).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        if (req.file) {
          const filename = book.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Book.updateOne({ _id: req.params.id }, { ...bookObject })
              .then(() => res.status(200).json({ message: "Livre modifié" }))
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          Book.updateOne({ _id: req.params.id }, { ...bookObject })
            .then(() => res.status(200).json({ message: "Livre modifié" }))
            .catch((error) => res.status(401).json({ error }));
        }
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error: error }));
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books
        .sort((a, b) => a.averageRating - b.averageRating)
        .splice(0, books.length - 3);
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error: error }));
};

exports.rateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      let ratingsTotal = 0;
      for (let i = 0; i < book.ratings.length; i++) {
        ratingsTotal = ratingsTotal + book.ratings[i].grade;
      }
      const average =
        (ratingsTotal + req.body.rating) / (book.ratings.length + 1);
      if (!book.ratings.includes(req.auth.userId)) {
        Book.findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              ratings: [{ userId: req.auth.userId, grade: req.body.rating }],
            },
            $set: { averageRating: average },
          },
          { new: true }
        )
          .then((book) => {
            res.status(200).json(book);
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
