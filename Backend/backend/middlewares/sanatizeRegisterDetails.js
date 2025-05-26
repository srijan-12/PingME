import validator from "validator"
export const satizeRegisterDetails = (req,res,next) =>{
    const{name, email, password, confirmPassword, gender} = req.body
    const picture = req.file?.path
    try {
        if(!name || name.length <= 2){
            throw new Error('Name must contain atleast 3-characters')
        }
        if(!email || !validator.isEmail(email)){
            throw new Error('Please enter valid email')
        }
        if(!password || !validator.isStrongPassword(password)){
            throw new Error('Please enter a strong password')
        }
        if(!confirmPassword){
            throw new Error('Please enter confirm password feild')
        }
        if(password !== confirmPassword){
            throw new Error('Make sure password and confirm password matches correctly')
        }
        if(!gender || !["Male", "Female", "Others"].includes(gender)){
            throw new Error('Enter gender correctly')
        }

        if(picture && !validator.isURL(picture)){
            throw new Error('Unable to process image')
        }
        //sanatize photo type
        next()

    } catch (error) {
        console.log("error thrown")
        res.status(400).json({result: "error", error : error.message})
    }
}