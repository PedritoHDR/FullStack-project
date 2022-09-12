const express = require('express');

const app = express();

const port = 8080;
const serverUrl = `http://localhost:${port}`;

app.listen(port, console.log(`SERVER RUNNING ON ${serverUrl}`));