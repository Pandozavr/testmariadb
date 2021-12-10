// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов
const pool = require("../helpers/database");

class MusicService {

    async addTrack(fileName, trackName, artist) {
        const sqlInsertTrack = "INSERT INTO music (track_name, artist, file_name) VALUES (?,?,?)";
        const result = await pool.query(sqlInsertTrack, [trackName, artist, fileName]);
        const payload = {
            result: "track download success",
            trackName: trackName
        };
        return payload
    }

    async getTracks() {
        const sqlSelectTracks = "SELECT * FROM music";
        const result = await pool.query(sqlSelectTracks);
        const payload = {
            result: "get tracks success",
            data: result
        }
        return payload
    }
}

module.exports = new MusicService();