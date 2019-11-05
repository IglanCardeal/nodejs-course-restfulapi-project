import multer from "multer";
import crypto from "crypto";

const fileStorage = multer.diskStorage({
  destination: (res, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // cria uma string alfanumerica aleatoria para nomear um arquivo. ex: 0f41a14a7dcc8494f95b893ababd18351569273703561
    const randomFileName = crypto.randomBytes(16).toString("hex") + Date.now();
    callback(null, randomFileName + ".png");
    // callback(null, Date.now().toString() + "-" + file.originalname);
  }
});
const fileFilter = (req, file, callback) => {
  const validImageFileFormat = Boolean(
    file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
  );
  if (validImageFileFormat) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export default multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single("image");
