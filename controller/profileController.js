//именно в контроллере мы достаём из запроса данные обрабатываем их описанными "сервисами" и отправляем ответ
//а также некоторая валидация как например валидация данных запроса на регистрацию(формат email + длина пароля)
const profileService = require("../service/profile_service");

class ProfileController {

    async uploadAvatar(req,res,next){
        try{
            const imgName = req.file.filename;
            const {refreshToken} = req.cookies;
            const img = await profileService.uploadAvatar(refreshToken, imgName);
            return res.status(200).json(img)
        }catch (e) {
            next(e)
        }
    }
    async sendPost(req,res,next){
        try{
            const {textPost} = req.body;
            const {refreshToken} = req.cookies;
            const post = await profileService.sendPost(refreshToken, textPost);
            return res.status(200).json(post);
        }catch (e) {
            next(e)
        }
    }
    async getProfileData(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const data = await profileService.getProfileData(refreshToken);
            return res.status(200).json(data)
        } catch(e) {
            next(e)
        }
    }
    async getPosts(req,res,next){
        try{
            const {refreshToken} = req.cookies;
            const data = await profileService.getPosts(refreshToken);
            return res.status(200).json(data)
        } catch(e) {
            next(e)
        }
    }

}

module.exports = new ProfileController();