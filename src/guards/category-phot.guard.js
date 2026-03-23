const { globalError, ClientError } = require("shokhijakhon-error-handler")
const path = require("path");
const app = require("converter-mb");
const { v4 } = require("uuid");
module.exports = (req,res, next) => {
    const allowedFormats = ['.jpg', '.png', '.jpeg'];
    const allowedSize = 5;
    try {
        if(!req.files) return next();
        let categoryImage = req.files?.category_image;
        let currentFileExt = path.extname(categoryImage.name);
        if(!allowedFormats.includes(currentFileExt)) throw new ClientError("Invalid image format", 415)
        const currentFileSize = app.bits(categoryImage.size);
    if(allowedSize < currentFileSize) throw new ClientError("Image is too large maximum (5mb)",413 );
    req.filename =  v4() + categoryImage.name
    return next()
    } catch (err) {
        return globalError(err, res)
        
    }
}