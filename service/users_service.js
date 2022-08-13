// в сервисах происходит непосредственная работа с данными запроса, на основе их строятся обращения к БД
// также вызываются функции сторонних сервисов
const pool = require("../helpers/database");

const sqlFindUserByToken = "SELECT user_id FROM user_token WHERE refresh_token=?";

class UsersService {

    async getUsers(refreshToken) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);
        const sqlSelectFriends = "select user_friend_id from user_friend uf where user_id = ?";
        const friends = await pool.query(sqlSelectFriends, user["0"].user_id);
        const sqlSelectAllUsers = "select u.user_id, u.isFriend, u.user_name, u.email, ua.file_name from user u join user_avatar ua on u.user_id = ua.user_id";
        const allUsers = await pool.query(sqlSelectAllUsers);

        for(let i = 0; i < friends.length; i++){
            let friendID = friends[i].user_friend_id;
            for(let i = 0; i < allUsers.length; i++){
                if(friendID == allUsers[i].user_id){
                    allUsers[i].isFriend = 1;
                }
            }
        }
        const payload = {allUsers};
        return payload
    }
    async getUserData(userId) {
        const sqlUserDataProfile = "select u.user_name, u.email, ua.file_name from user u join user_avatar ua on u.user_id = ua.user_id where u.user_id=?";
        const UserDataProfile = await pool.query(sqlUserDataProfile, userId);
        const sqlPostsData = "select post_id, post_text from user_post where user_id=?";
        const postsData = await pool.query(sqlPostsData, userId);
        const payload = {
            posts: postsData,
            ueser_name: UserDataProfile["0"].user_name,
            avaUrl: `http://45.147.178.191:3001/${UserDataProfile["0"].file_name}`
        };
        return payload
    }
    async follow(refreshToken, friendId) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);
        const sqlInsertFriend = "INSERT INTO user_friend (user_id, user_friend_id) VALUES (?, ?)";
        const result = await pool.query(sqlInsertFriend, [user["0"].user_id, friendId]);
        return {result: "follow success"}
    }
    async unfollow(refreshToken, friendId) {
        const user = await pool.query(sqlFindUserByToken, refreshToken);
        const sqlDeleteFriend = "delete from user_friend where user_id=? and user_friend_id=?";
        const result = await pool.query(sqlDeleteFriend, [user["0"].user_id, friendId]);
        return {result: "unFollow success"}
    }
}

module.exports = new UsersService();