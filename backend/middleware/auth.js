const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        //console.log(req.headers.authorization); 
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
            const userId = decodedToken.userId;
            req.auth = {
                userId: userId
            };
            next();
        } else {
            throw new Error('Missing authorization token');
        }
    } catch (error) {
        res.status(403).json({ message: 'Unauthorized request' });
    }
};
