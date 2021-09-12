// здесь указано по каким эндпоинтам можно обращаться с клиента
// внутри каждого указаны дополнительные прослойки/валидации и соответствующая функция контроллера
const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authController");
const profileController = require("../controller/profileController");
const userController = require("../controller/userController");
const {body} = require('express-validator');
const upload = require("../middlewares/uploadMiddleware");

router.post("/register",
    body("email").isEmail(),
    body("password").isLength({min:6, max: 16}),
    AuthController.registration);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/refresh", AuthController.refresh);

router.post("/avatar", upload.single('profileImg'), profileController.uploadAvatar);
router.get("/profile", profileController.getProfileData);
router.get("/userposts", profileController.getPosts);

router.post("/post", profileController.sendPost);
router.delete("/post", profileController.deletePost);
router.put("/post", profileController.updatePost);

router.get("/users", userController.getUsers);
router.get("/follow", userController.follow);
router.get("/unfollow", userController.unfollow);

module.exports = router;