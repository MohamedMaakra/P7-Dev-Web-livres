const book = require('../models/book');
const Book = require('../models/book')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose');



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


exports.getOneBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'ID de livre invalide' });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

exports.modifyBook = async (req, res, next) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
      : { ...req.body };

    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    if (book.userId !== req.auth.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (req.file) {
      const imageName = path.basename(book.imageUrl);
      const imagePath = path.join(__dirname, '..', 'images', imageName);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await Book.updateOne({ _id: req.params.id }, { ...bookObject });

    res.status(200).json({ message: 'Livre modifié' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



exports.bestRating = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ averageRating: -1 })
      .limit(3);

    //console.log("Books:", books);

    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.ratingBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    const found = book.ratings.find((r) => r.userId === req.auth.userId);

    //console.log(req.auth.userId);

    if (found) {
      return res.status(401).json({
        message: "Vous ne pouvez pas modifier la note déjà saisie",
      });
    }

    book.ratings.push({
      userId: req.auth.userId,
      grade: req.body.rating,
    });

    let total = 0;
    book.ratings.forEach((element) => {
      total += element.grade;
    });

    const average = total / book.ratings.length;
    book.averageRating = average; // Mettre à jour la moyenne des notes du livre

    await book.save();

    res.status(200).json({
      message: "Note ajoutée avec succès",
      averageRating: average,
      id: book._id, 
    });
    
  } catch (error) {
    res.status(400).json({ error });
  }
};

