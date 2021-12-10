//именно в контроллере мы достаём из запроса данные обрабатываем их описанными "сервисами" и отправляем ответ
//а также некоторая валидация как например валидация данных запроса на регистрацию(формат email + длина пароля)
const musicService = require("../service/music_service");

class MusicController {

    async addTrack(req,res,next){
        try{
            const fileName = req.file.filename;
            const {trackName, artist} = req.body;
            const data = await musicService.addTrack(fileName, trackName, artist);
            return res.status(200).json(data)
        }catch (e) {
            next(e)
        }
    }

    async getTrack(req, res, next){
        try{
            const data = await musicService.getTracks();
            return res.status(200).json(data)
        } catch(e) {
            next(e)
        }
    }

}

module.exports = new MusicController();