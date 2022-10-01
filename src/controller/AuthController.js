class AuthController{

    singup(req,res){
        return res.status(200).json(
            {
                message:"create user success",
            }
        )
    }

    signin(req,res){
        return res.status(200).json(
            {
                message:"user login success",
            }
        )
    }
}

module.exports = new AuthController;