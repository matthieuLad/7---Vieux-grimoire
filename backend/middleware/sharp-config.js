const sharp = require("sharp");

exports.imageUpload = async (req, res, next) => {
  if (req.file) {
    const name = `${Date.now()}-${req.file.originalname
      .split(" ")
      .join("_")}.webp`;
    await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toFile("./images/" + name);
    delete req.file.filename;
    req.file.filename = name;
  }
  next();
};
