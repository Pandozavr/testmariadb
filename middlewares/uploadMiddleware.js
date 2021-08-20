const multer = require("multer");
const uuid = require("uuid")

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public")
    },
    filename(req, file, cb) {
        cb(null, `ava-${uuid.v4()}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

const upload = multer({storage, fileFilter});

module.exports = upload;