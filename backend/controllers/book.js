const Book = require('../models/book')


exports.getAllBook = (req, res, next) => {
    Book.find().then(
        (Book) => {
            res.status(200).json(Book);
        }
    ).catch(
        (error) => {
          res.status(400).json({ error });
        }
      );
};


exports.creatBook = (req, res, next) => {
  console.log("Requête reçue :", req.body);
  delete req.body._id;
  const book = new Book({
  ...req.body
  });

  book.save()
    .then(() => {
      res.status(201).json({
        message: 'Livre enregistré'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error
      });
    });
};

exports.getOneBook= (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (Book) => {
      res.status(200).json(Book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

const mongoose = require('mongoose');

// ...

exports.deleteBook = (req, res, next) => {
  const bookId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({
      error: 'Invalid book ID'
    });
  }

  Book.deleteOne({ _id: bookId })
    .then(() => {
      res.status(200).json({
        message: 'Deleted!'
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error
      });
    });
};
