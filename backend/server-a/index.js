require('dotenv').config();
const { connectDB } = require("./db/db");
const http = require('http');

connectDB();
const app = require('./app');
const { getTask } = require('./rabbit-utils/receiveTask');
const { socketConnection } = require('./utils/socket-io');

const rabbitReceiver = getTask('rapid-runner-rabbit', 'completed-orders');
// const rabbitReceiver = getTask('localhost', 'completed-orders');

const server = http.createServer(app);
socketConnection(server);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
