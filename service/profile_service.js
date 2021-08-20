// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов

const pool = require("../helpers/database");
const ApiError = require('../exeptions/apiError');

const sqlFindUserByToken = "SELECT user_id FROM user_token WHERE refresh_token=?";

class ProfileService {

    async uploadAvatar(refreshToken, imgName){
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if(user["0"] == undefined){
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        } else if(user["0"].user_id){
            //проверяем есть ли у пользователя аватарка
            const sqlCheckAvaThisUser = "SELECT user_id FROM user_avatar WHERE user_id=?";
            const checkRes = await pool.query(sqlCheckAvaThisUser, user["0"].user_id);
            if(checkRes["0"] == undefined) {
                //если нету - добавляем
                const sqlInsertImg = "INSERT INTO user_avatar (file_name, user_id) VALUES (?, ?)";
                const result = await pool.query(sqlInsertImg, [imgName, user["0"].user_id]);
                return result
            } else {
                //если есть, то обновляем
                const sqlUpdateAvatar = "UPDATE user_avatar SET file_name=? WHERE user_id=?";
                const updAvatar = await pool.query(sqlUpdateAvatar, [imgName, user["0"].user_id]);
                return updAvatar
            }
        }
    }

    async sendPost(refreshToken, textPost){
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if(user["0"] == undefined){
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        }
        const sqlInsertPost = "INSERT INTO user_post (user_id, post_text) VALUES (?, ?)";
        const result = await pool.query(sqlInsertPost, [user["0"].user_id, textPost]);
        return result
    }
    async getProfileData(refreshToken){
        const user = await pool.query(sqlFindUserByToken, refreshToken);
        console.log("allo chert" + user["0"]);
        if(user["0"] == undefined){
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
    async getPosts(refreshToken){
        const user = await pool.query(sqlFindUserByToken, refreshToken);

        if(user["0"] == undefined){
            throw ApiError.BadRequest(`Пользователь не авторизован`)
        }

        const sqlPostsData = "select post_id, post_text from user_post where user_id=?";
        const postsData = await pool.query(sqlPostsData, user["0"].user_id);
        const payload = {
            posts: postsData
        };
        return payload;
    }
}

module.exports = new ProfileService();