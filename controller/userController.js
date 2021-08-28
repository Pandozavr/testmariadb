//именно в контроллере мы достаём из запроса данные обрабатываем их описанными "сервисами" и отправляем ответ
//а также некоторая валидация как например валидация данных запроса на регистрацию(формат email + длина пароля)
const userService = require("../service/users_service");

class UserController {

    async getUsers(req,res,next){
        try{
            const data = await userService.getUsers();
            return res.status(200).json(data)
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();