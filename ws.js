import WebSocket, { WebSocketServer } from "ws";

const WS_PORT = 6969;
const socketServer = new WebSocketServer({
    port: WS_PORT
})

socketServer.on('connection', function(client){
    console.log('Client connects successfully');

    client.send('hello client');
})

export function broadcastAll(message){
    for (let c of socketServer.clients){
        if(c.readyState === WebSocket.OPEN){
            c.send(message);
        }
    }
}

console.log(`WebSocket Server is running at ws://localhost:${WS_PORT}`);

export default socketServer;