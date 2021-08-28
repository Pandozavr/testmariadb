// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов

const pool = require("../helpers/database");
const ApiError = require('../exeptions/apiError');

const sqlFindUserByToken = "SELECT user_id FROM user_token WHERE refresh_token=?";

class ProfileService {

    async uploadAvatar(refreshToken, imgName) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if (user["0"] == undefined) {
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        } else if (user["0"].user_id) {
            const sqlUpdateAvatar = "UPDATE user_avatar SET file_name=? WHERE user_id=?";
            const updAvatar = await pool.query(sqlUpdateAvatar, [imgName, user["0"].user_id]);
            const payload = {
                avaUrl: `http://localhost:3001/${imgName}`
            };
            return payload

        }
    }

    async sendPost(refreshToken, textPost) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if (user["0"] == undefined) {
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        }
        const sqlInsertPost = "INSERT INTO user_post (user_id, post_text) VALUES (?, ?)";
        const result = await pool.query(sqlInsertPost, [user["0"].user_id, textPost]);
        return {result: "post was added"}
    }

    async getProfileData(refreshToken) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);
        if (user["0"] == undefined) {
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        }
        const sqlUserData = "select u.user_name, u.email, ua.file_name from user u join user_avatar ua on u.user_id = ua.user_id where u.user_id=?";
        const userData = await pool.query(sqlUserData, user["0"].user_id);
        const payload = {
            userName: userData["0"].user_name,
            email: userData["0"].email,
            avaUrl: `http://localhost:3001/${userData["0"].file_name}`
        };
        return payload;
    }

    async getPosts(refreshToken) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if (user["0"] == undefined) {
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        }

        const sqlPostsData = "select post_id, post_text from user_post where user_id=?";
        const postsData = await pool.query(sqlPostsData, user["0"].user_id);
        const payload = {
            posts: postsData
        };
        return payload;
    }

    async deletePost(postId) {
        const sqlDeletePost = "delete from user_post where post_id=?";
        const data = await pool.query(sqlDeletePost, postId);
        return {result: "post was delete"}
    }

    async updatePost(postId, postText) {
        const sqlUpdatePost = "UPDATE user_post SET post_text=? WHERE post_id=?";
        const data = await pool.query(sqlUpdatePost, [postText, postId]);
        return {result: "post was update"}
    }
}

module.exports = new ProfileService();