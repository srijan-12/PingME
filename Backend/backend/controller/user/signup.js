import Users from "../../model/userModel.js"

export default async function signup(req,res){
    try {
        const{name, email, password, confirmPassword, gender} = req.body
        const picture = req.file?.path
        const hashedPass = await Users.getHashedPassword(password)
        const confirmHashedPass = await Users.getHashedPassword(confirmPassword)
        const newUser = new Users({name, email, password : hashedPass, confirmPassword : confirmHashedPass, gender, picture})
        const createdUser = await newUser.save()
        const token = createdUser.getJWT()
        res.cookie('token', token, {maxAge : 1000*60*60*24*7})
        res.status(200).json({result: "success user registered", error : null})
    } catch (error) {
        res.status(400).json({result: "error", error : error.message})
    }
}