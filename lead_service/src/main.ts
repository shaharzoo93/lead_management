import app from './app.js';
const PORT = process.env.PORT || 4000;

const REQUEST_TIMEOUT = process.env.REQUEST_TIMEOUT || 120000;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}${new Date()}`));
server.requestTimeout = <number>REQUEST_TIMEOUT;
