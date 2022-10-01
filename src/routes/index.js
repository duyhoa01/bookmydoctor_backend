const authRouter= require('./auth')

function route(app){
    app.use('/api/auth',authRouter);
}

module.exports = route;