var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(process.env.PORT);
var io = require('socket.io')(server);
var session = require('express-session')({
      secret: 'Secret String',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1800000
      }
    });
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session); 
io.use((socket, next) => {
  session(socket.request, {}, next);
});



app.set('io', io);
module.exports = app;

app.use(express.static('./public'));

var api = require('./api/api');
app.use('/user', api);

var chat = require('./chat');
app.use('/', chat);

var fileHandler = require('./api/files');
app.use('/download', fileHandler);


console.log('App is listening on port 3000');
