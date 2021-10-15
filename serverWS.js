const ws = require("ws");

const wss = new ws.Server({
        port: 5000
    }, () => console.log("Server started on port 5000")
);

let n = 0;

wss.on("connection", function connection (ws) {
    ws.on("message", function (message) {
        message = JSON.parse(message);
        message.id = n++;
        switch (message.event) {
            case "message":
                broadcastMessage(message)
                break;
            case "connection":
                broadcastMessage(message)
                break;
        }
    })
});


function broadcastMessage(message) {
    wss.clients.forEach( client => {
        client.send(JSON.stringify(message))
    })
}