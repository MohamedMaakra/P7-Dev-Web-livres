const { check, validationResult } = require('express-validator');

exports.checkMail = async (req, res, next) => {
  try {
    await check('email')
      .trim()
      .not().isEmpty().withMessage('Saisir une adresse mail')
      .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).withMessage('Adresse mail invalide')
      .escape().withMessage('')
      .isEmail().withMessage('Adresse mail invalide')
      .run(req);
   
    next();
  } catch (error) {
    res.status(401).json({ message: 'Impossible de créer/connecter l\'utilisateur : adresse mail invalide' });
  }
};

exports.checkPassword = async (req, res, next) => {
  try {
    await check('password')
      .not().isEmpty().withMessage('Saisir un mot de passe')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false,
      })
      .run(req);
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Impossible de créer/connecter l\'utilisateur : mot de passe non conforme' });
  }
};

exports.Validator = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(401).json({ message: 'Erreur de validation', errors: errorMessages });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Une erreur est survenue lors de la validation des entrées' });
    }
  };
  
