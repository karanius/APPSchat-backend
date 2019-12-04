const app = require('express')();
const socketio = require('socket.io');

// this is the port number where the front end will connect to. Currently, it is set up to use a local port (8080) on your machine or Heroku's chosen port automatically.
const io = socketio(app.listen(process.env.PORT || 8080)); 


const onlineUsers = {};

io.on('connect', (socket)=>{
    socket.emit('userId' , socket.id );


    socket.on('myConnectionInfo',(data)=>{
        onlineUsers[data.id] = data.name;
        io.emit('userOnline', {user: onlineUsers[data.id] , id:data.id })
        io.emit('activeUsers', {data:onlineUsers})
    })



    socket.on('sendingMsgToServer', (data)=>{
        io.emit('msgRecievedFromServer' , {data:data} )
    } )


    socket.on('disconnecting',()=>{
        let rooms = Object.keys(socket.rooms);

        console.log(onlineUsers[rooms],rooms[0],' left')
        io.emit('userLeft', {user: onlineUsers[rooms], id:rooms[0]})
        delete onlineUsers[rooms[0]]
        console.log('online:',onlineUsers)
        io.emit('activeUsers', {data:onlineUsers})
    })


} )









console.log('ready')
