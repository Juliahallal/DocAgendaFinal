const multer = require("multer");

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes("png ou jpg")) {
    return res.status(400).json({ errors: [err.message] });
  }

  next(err); 
};

module.exports = handleMulterError;
