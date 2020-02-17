const express = require('express')
  , http = require('http');
//make sure you keep this order
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

const log = require('log'),
      Log = new log('debug');

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.redirect('index.html');
});

io.on('connection', (socket)=> {
    socket.on('stream', (data)=>{
        socket.broadcast.emit('stream',{image:data.image, audio: new Int16Array(data.audio)})
    });
    socket.on('streamPetition', (user)=>{
        socket.broadcast.emit('streamPetition',user)
    });

    socket.on('validate', ()=>{
        socket.broadcast.emit('validate');
    });
});

server.listen(port, ()=>{
    console.log('Servidor escuchando a traves del puerto %s', port);
    log.info('Servidor escuchando a traves del puerto %s', port);
});