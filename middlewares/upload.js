const multer = require("multer");
const path = require("path");

//diskstorage config for Multer
const storage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null,"public/avatars");
  },
  filename:(req, file, cb)=>{
    const ext = path.extname(file.originalname);
    cb(null,`${Date.now()}${ext}` );
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and JPG files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;