// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов
const pool = require("../helpers/database");

class UsersService {

    async getUsers() {
        const sqlSelectAllUsers = "select u.user_name, u.email, ua.file_name from user u join user_avatar ua on u.user_id = ua.user_id";
        const users = await pool.query(sqlSelectAllUsers);
        const payload = {users};
        return payload
    }
}

module.exports = new UsersService();