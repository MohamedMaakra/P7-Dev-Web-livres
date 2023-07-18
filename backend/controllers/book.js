const Book = require('../models/book')
const fs= require('fs')
const path = require('path')
const mongoose = require('mongoose');



exports.getAllBook = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};



exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    bookObject.averageRating = 0;
    bookObject.ratings = [];

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    console.log(book);

    await book.save();
    res.status(201).json({ message: 'Livre enregistré' });
  } catch (error) {
    res.status(400).json({ error });
  }
};



exports.getOneBook = async (req, res) => {
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
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book.userId != req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }

    const filename = book.imageUrl.split('/images/')[1];
    await fs.unlink(`images/${filename}`);

    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Objet supprimé !' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifyBook = async (req, res) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
      : { ...req.body };

    // Vérifier si la note est entre 1 et 5
    const  note  = bookObject;
    if (note && (note < 1 || note > 5)) {
      return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5' });
    }

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
  if (!req.auth.userId) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    const book = await Book.findOne({ _id: req.params.id });
    const voterId = req.auth.userId;

    const propio =  book.userId;

    if (book.ratings.length === 0 && voterId === propio) {
      return res.status(401).json({
        message: "Vous ne pouvez pas voter pour votre propre livre.",
      });
    }

    const found = book.ratings.find((r) => r.userId === voterId);

    if (found) {
      return res.status(401).json({
        message: "Vous ne pouvez pas modifier la note déjà saisie.",
      });
    }

    book.ratings.push({
      userId: voterId,
      grade: req.body.rating,
    });

    let total = 0;
    book.ratings.forEach((element) => {
      total += element.grade;
    });

    const average = (total / book.ratings.length).toFixed(1);
    book.averageRating = parseFloat(average);

    console.log('Moyenne:', average); // Afficher la moyenne dans la console

    await book.save(); // Sauvegarder les modifications dans la base de données

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



