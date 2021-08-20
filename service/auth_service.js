// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов

const pool = require("../helpers/database");
const bcrypt = require("bcrypt");
const tokenService = require("../service/token_service");
const ApiError = require('../exeptions/apiError');

class AuthService {
    async registration(email, password, user_name) {
        const sqlSearchDuplicateUser = "SELECT email FROM user WHERE email=?";
        const candidate = await pool.query(sqlSearchDuplicateUser, email);
        if(candidate["0"] == undefined){
            const encryptPass = await bcrypt.hash(password, 10);
            const sqlInsertUser = "INSERT INTO user (email, password, user_name) VALUES (?, ?, ?)";
            const result = await pool.query(sqlInsertUser, [email, encryptPass, user_name]);
            const payload = {id: result.insertId, email: email};
            const tokens = tokenService.generateTokens(payload);
            await tokenService.saveToken(payload.id, tokens.refreshToken);

            return {...tokens, user: payload}

        } else if(candidate["0"].email == email){
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже зарегестрирован`)
        }

    }

    async login(email, password){
        const sqlUserIsRegister = "SELECT email, password, user_id FROM user WHERE email=?";
        const user = await pool.query(sqlUserIsRegister, email);
        if(user["0"] == undefined){
            throw ApiError.BadRequest(`Пользователь с почтой ${email} не найден`)
        } else if(user["0"].email == email){
            const isPassEquals = await bcrypt.compare(password,user["0"].password);
            if(!isPassEquals){
                throw ApiError.BadRequest(`Неверный пароль`)
            }
            const payload = {id: user["0"].user_id, email: email};
            const tokens = tokenService.generateTokens(payload);
            await tokenService.saveToken(payload.id, tokens.refreshToken);
            return {...tokens, user: payload}

        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDB["0"]) {
            throw ApiError.UnauthorizedError()
        }
        const sqlUserEmail = "SELECT email, user_id FROM user WHERE user_id=?";
        const userEmail = await pool.query(sqlUserEmail, tokenFromDB["0"].user_id);
        const payload = {id: tokenFromDB["0"].user_id, email: userEmail["0"].email};
        const tokens = tokenService.generateTokens(payload);
        await tokenService.saveToken(payload.id, tokens.refreshToken);
        return {...tokens, user: payload}
    }

}

module.exports = new AuthService();