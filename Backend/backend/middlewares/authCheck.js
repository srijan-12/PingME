import jwt from "jsonwebtoken"
import Users from "../model/userModel.js"
export default async function authCheck(req,res,next){
    try {
        const {token} = req.cookies
        if(!token){
            throw new Error("un-authorised! login again")
        }
        const decodedValue = jwt.verify(token, process.env.SECRET_KEY)
        const currentUserId = decodedValue._id

        const foundUser = await Users.findById(currentUserId).select('-password -confirmPassword')
        // console.log(foundUser)
        if(!foundUser){
            throw new Error("un-authorised! login again")
        }
        req.user = foundUser
        next()
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
}