const jwt = require('jsonwebtoken');
const pool = require("../helpers/database");

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '60m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '120m'});
        return {
            accessToken,
            refreshToken
        }
    }
    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            return userData
        }catch (e) {
            return null;
        }
    }
    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY);
            return userData
        }catch (e) {
            return null;
        }
    }
    async saveToken(user_id, refreshToken){
        const sqlSearchDuplicateToken = "SELECT user_id FROM user_token WHERE user_id=?";
        const tokenData = await pool.query(sqlSearchDuplicateToken, user_id);
        if(tokenData["0"] == undefined){
            const sqlInsertToken = "INSERT INTO user_token (user_id, refresh_token) VALUES (?, ?)";
            const token = await pool.query(sqlInsertToken, [user_id, refreshToken]);
            return token
        } else if (tokenData["0"].user_id == user_id) {
            const sqlUpdateToken = "UPDATE user_token SET refresh_token=? WHERE user_id=?";
            const tokenData = await pool.query(sqlUpdateToken, [refreshToken, user_id]);
            return tokenData
        }
    }

    async removeToken(refreshToken){
        const sqlDeleteToken = "DELETE FROM user_token WHERE refresh_token=?";
        const tokenData = await pool.query(sqlDeleteToken, refreshToken);
        return tokenData
    }

    async findToken(refreshToken) {
        const sqlSearchToken = "SELECT user_id, refresh_token FROM user_token WHERE refresh_token=?";
        const tokenData = await pool.query(sqlSearchToken, refreshToken);
        return tokenData;
    }

}

module.exports = new TokenService();