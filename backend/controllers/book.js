const book = require('../models/book');
const Book = require('../models/book')
const fs= require('fs')
const path = require('path')


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
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré'})})
  .catch(error => { res.status(400).json( { error })})
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


;
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


exports.modifyBook = (req, res, next) => {
  const newData = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body };

 

  if (req.file) {
    const previousImage = req.body.image;

    if (previousImage) {
      const imagePath = path.join(__dirname, '..', 'images', previousImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  }

  Book.updateOne({ _id: req.params.id }, { ...newData, _id: req.params.id })
    .then(() => {
      res.status(201).json({ message: 'Livre modifié' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};


