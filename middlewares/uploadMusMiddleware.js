const multer = require("multer");
const uuid = require("uuid")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/mus")
    },
    filename(req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        cb(null, `track-${uuid.v4()}.${fileExtension}`)
    }
});

const fileFilter = (req, file, cb) => {
    console.log(file)
    if(file.mimetype === 'audio/mpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const uploadMus = multer({storage, fileFilter});

module.exports = uploadMus;