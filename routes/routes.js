// здесь указано по каким эндпоинтам можно обращаться с клиента
// внутри каждого указаны дополнительные прослойки/валидации и соответствующая функция контроллера
const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authController");
const profileController = require("../controller/profileController");
const userController = require("../controller/userController");
const musicController = require("../controller/musicController");
const {body} = require('express-validator');
const uploadAva = require("../middlewares/uploadAvaMiddleware");
const uploadMus = require("../middlewares/uploadMusMiddleware");

router.post("/register",
    body("email").isEmail(),
    body("password").isLength({min:6, max: 16}),
    AuthController.registration);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/refresh", AuthController.refresh);

router.post("/avatar", uploadAva.single('profileImg'), profileController.uploadAvatar);
router.get("/profile", profileController.getProfileData);
router.get("/userposts", profileController.getPosts);

router.post("/post", profileController.sendPost);
router.delete("/post", profileController.deletePost);
router.put("/post", profileController.updatePost);

router.get("/users", userController.getUsers);
router.get("/follow", userController.follow);
router.get("/unfollow", userController.unfollow);

router.post("/music", uploadMus.single('track'), musicController.addTrack);
router.get("/music", musicController.getTrack);

module.exports = router;