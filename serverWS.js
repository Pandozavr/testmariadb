const ws = require("ws");
const uuid = require("uuid");

const wss = new ws.Server({
        port: 5000
    }, () => console.log("Server started on port 5000")
);

let n = 0;
const clientsArr = [];

function exitUser(id) {
    for(i=0; i < clientsArr.length; i++){
        if(id === clientsArr[i].id){
            clientsArr.splice(i,1)
        }
    }
}

function getExitUser(id){
    for(i=0; i < clientsArr.length; i++){
        if(id === clientsArr[i].id){
            return clientsArr[i].user
        }
    }
}

wss.on("connection", function connection (ws) {

    const id = uuid.v4();

    ws.on("message", function (message) {
        message = JSON.parse(message);
        if(message.event === "connection"){
            clientsArr.push({id: id, user: message.userName })
        }
        const usersForSend = {
            event: "users",
            users: clientsArr
        }
        message.id = n++;
        switch (message.event) {
            case "message":
                broadcastMessage(message)
                break;
            case "connection":
                broadcastMessage(message)
                broadcastUserList(usersForSend)
                break;
        }
    })
    ws.on("close", () => {
        const name = getExitUser(id)
        exitUser(id)
        const usersForSend = {
            event: "users",
            users: clientsArr
        }
        const userExit = {
            event: "exit",
            userName: name
        }
        broadcastUserList(usersForSend)
        broadcastMessage(userExit)
    }) 
});


function broadcastMessage(message) {
    wss.clients.forEach( client => {
        client.send(JSON.stringify(message))
    })
}
function broadcastUserList(users) {
    wss.clients.forEach( client => {
        client.send(JSON.stringify(users))
    })
}