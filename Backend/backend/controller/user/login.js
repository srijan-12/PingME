import Users from "../../model/userModel.js"
export default async function login(req,res){
    try {
        const {email, password} = req.body

        //finding user 
        const foundUser = await Users.findOne({email})

        if(foundUser){
            const passResult = await foundUser.comparePassword(password)
            if(passResult){
                const token = await foundUser.getJWT()
                res.cookie('token', token, {httpOnly: true,secure: true,sameSite: 'None',maxAge: 7 * 24 * 60 * 60 * 1000});
                return res.status(200).json({result: "user logged in",tkn : token, error : null})
            }else{
                throw new Error("in-valid credentials")
            }
        }else{
            throw new Error("in-valid credentials")
        }
    } catch (error) {
        return res.status(401).json({result: "failed to login ", error : error.message})
    }
}
