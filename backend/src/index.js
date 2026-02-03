require("dotenv").config();
const http = require("http");
const app = require("./app");
const setUpWebSocket = require("./websocket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
setUpWebSocket(server);

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});