import validator from "validator"
export const satizeLoginDetails = (req,res,next) =>{
    try {
        const {email, password} = req.body
        if(!email || !validator.isEmail(email)){
            throw new Error("in-valid credentials")
        }
        if(!password){
            throw new Error("in-valid credentials")
        }
        next()
    } catch (error) {
        return res.status(401).json({result: "error", error : error.message})
    }
}