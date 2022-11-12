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


    // Notification
    // socket.on('createNotify', msg => {
    //     const client = users.find(user => msg.recipients.includes(user.id))
    //     client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
    // })

    // socket.on('removeNotify', msg => {
    //     const client = users.find(user => msg.recipients.includes(user.id))
    //     client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    // })


    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.to_user)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

}

module.exports = SocketServer