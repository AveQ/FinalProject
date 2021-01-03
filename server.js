//Install express server
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

const port = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Request-With,Content-Type,Accept,Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
    return res.status(200).json({});
  }
  next();
});

app.use(express.static(__dirname + '/dist/application'))
app.get('/*', (req, res) => res.sendFile('index.html', {root: __dirname + '/dist/application'}));

http.createServer(app)
  .listen(port, () => {
    console.log(`[Server] Server is running at https://localhost:${port}`);
  });
