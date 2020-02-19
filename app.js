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
    console.log("user has connected with socket: ", socket.id);
    socket.on('stream', (data)=>{
        socket.broadcast.emit('stream',{image:data.image, audio: new Int16Array(data.audio)})
    });
    socket.on('call-user', (data)=>{
  
            // socket.to(data.to).emit("call-made", {
            //   offer: data.offer,
            //   socket: socket.id
            // });
        
        socket.broadcast.emit('call-made',{
            offer:data.offer,
            socket:socket.id
        })
    });

    socket.on("make-answer", data => {

        socket.broadcast.emit('answer-made',{
            answer:data.answer,
            socket:socket.id
        })
        // socket.to(data.to).emit("answer-made", {
        //   socket: socket.id,
        //   answer: data.answer
        // });

      });

    socket.on('validate', ()=>{
        socket.broadcast.emit('validate');
    });
});

server.listen(port, ()=>{
    console.log('Servidor escuchando a traves del puerto %s', port);
    log.info('Servidor escuchando a traves del puerto %s', port);
});