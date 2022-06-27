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

wss.on("connection", function connection (ws) {

    const id = uuid.v4();

    ws.on("message", function (message) {
        message = JSON.parse(message);
        clientsArr.push({id: id, user: message.userName})
        console.log(clientsArr);
        message.id = n++;
        switch (message.event) {
            case "message":
                broadcastMessage(message)
                break;
            case "connection":
                broadcastMessage(message)
                broadcastUserList(clientsArr)
                break;
        }
    })
    ws.on("close", (event) => {
        exitUser(id)
        broadcastUserList(clientsArr)
        console.log(clientsArr);
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