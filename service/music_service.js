// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов
const pool = require("../helpers/database");

class MusicService {

    async addTrack() {
        const sqlInsertTrack = "INSERT INTO user_friend (user_id, user_friend_id) VALUES (?, ?)";
        const result = await pool.query(sqlInsertFriend, [user["0"].user_id, friendId]);
        return {result: "follow success"}
    }
}

module.exports = new MusicService();