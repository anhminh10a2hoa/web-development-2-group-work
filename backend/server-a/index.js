require('dotenv').config();
const { connectDB } = require("./db/db");
const http = require('http');

connectDB();
const app = require('./app');
const { getTask } = require('./rabbit-utils/receiveTask');
const { socketConnection } = require('./utils/socket-io');

getTask('rapid-runner-rabbit', 'completed-orders');

const server = http.createServer(app);
socketConnection(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App running on port ${port}!`);
});
