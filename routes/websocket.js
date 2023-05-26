const WebSocket = require('ws')

const server = new WebSocket.Server({
    port: 5051
})

server.on('connection', (ws) => {
    ws.on('message', (message) => {
        server.clients.forEach((client) => {
            client.send(`${message}`)
        })
    })
})