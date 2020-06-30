const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.send('hello!'));

io.on('connection', (socket) => {

    console.log(`New connection ${socket.id}`);
    io.sockets.emit('just connected', socket.id);
    
    socket.on('join', function(data) {
        console.log('data on join : ', data)
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('new user joined', { pseudo: data.pseudo, message:'has joined this room.' });
    });
    
    socket.on('message', function(data) {
        console.log(data);
        socket.broadcast.to(data.room).emit('new message', { pseudo: data.pseudo, message: data.message, room: data.room });
    });

    socket.on('leave', function(data) {
        socket.broadcast.to(data.room).emit('left room', { pseudo: data.pseudo, message:'has left this room.' });
    });



    socket.on('chat', function(data) {
        io.sockets.emit('chat', data);
    })

    // socket.on('typing', function(data) {
    //     io.sockets.emit('typing text', data);
    //     socket.broadcast.to(data.room).emit('typing text', data);
    // })

    // socket.on('typing', ({room}) => {
    //     socket.to(room).emit
    // });
});

http.listen(3000, () => {
    console.log('listening on: 3000');
});