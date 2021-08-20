//именно в контроллере мы достаём из запроса данные обрабатываем их описанными "сервисами" и отправляем ответ
//а также некоторая валидация как например валидация данных запроса на регистрацию(формат email + длина пароля)
const authService = require("../service/auth_service");
const {validationResult} = require('express-validator');
const ApiError = require('../exeptions/apiError');

class AuthController {
    async registration(req,res,next){
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
            }
            const {email, password, user_name} = req.body;
            const userData = await authService.registration(email, password, user_name);
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true})
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req,res,next){
        try{
            const {email, password} = req.body;
            const userData = await authService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true});
            return res.status(200).json(userData)

        }catch (e) {
            next(e)
        }
    }

    async logout(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)

        }catch (e) {
            next(e)
        }
    }

    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true});
            return res.status(200).json(userData)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new AuthController();