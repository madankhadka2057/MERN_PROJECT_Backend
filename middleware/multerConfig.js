const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //check the if mimetype of file
    const allowedTypes=['image/jpg','image/png','image/jpeg']
    if(!allowedTypes.includes(file.mimetype)){
        cb(new Error("This filetype is not Supported"))
    }
    cb(null, "./uploads"); //cb(error,success)
  },
  filename: function (req, file, cb) {
    cb(null, +Date.now()+'-'+file.originalname);
  },
});
module.exports = {
  multer,
  storage,
};
