const  sharp  =  require ( 'sharp' ) ;
const path = require ('path');
const fs = require('fs');


module.exports = async(req, res, next) => {
    if(req.file) {
        const newName = req.file.filename.split('.')[0];
        req.file.filename= newName + '.webp';

        await sharp(req.file.path)
            .resize(400)
            .toFile(path.resolve(req.file.destination, newName+'.webp'))
        fs.unlinkSync(req.file.path)  
    }

    next()
}