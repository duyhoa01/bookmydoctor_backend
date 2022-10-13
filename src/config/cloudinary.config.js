const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'drotiisfy',
  api_key: '473216843688577',
  api_secret: '2RaoEKTrTLFkVXeBEDKSFBaaMqg'
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profiles",
  },
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloud = multer({
    storage: storage,
    limits: { fileSize: '1000000' }, });

module.exports = uploadCloud;
