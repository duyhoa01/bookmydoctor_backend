let users = []

const SocketServer = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', user => {
        users.push({id: user._id, socketId: socket.id})
        socket.emit("getUsers", users);
    })

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id)
    })

    //Notification
    socket.on('createNotify', msg => {
        const clients = users.filter(user => msg.usersId.includes(user.id))
        if(clients.length > 0){
            clients.forEach(client => {
                delete msg.usersId;
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
            })
        }
    })

    //Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id == msg.to_user)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

}

module.exports = SocketServer