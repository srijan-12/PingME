 import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import argon2 from "argon2";
import jwt from "jsonwebtoken"
 const userSchema = new Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    confirmPassword : {
        type : String,
        required : true,
        trim : true
    },
    gender : {
        type : String,
        enum : ["Male", "Female", "Others"]
    },
    picture : {
        type : String,
        required : true,
        trim : true,
        default : function(){
            if(this.gender == 'Male'){
                return 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/silhouette-male-user-icon.png'
            }else if(this.gender == 'Female'){
                return 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/silhouette-female-icon.png'
            }else{
                return 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/silhouette-female-icon.png'
            }
        }
    }
 },{
    timestamps : true
 })

 userSchema.statics.getHashedPassword = async function(password){
    const hashedPassword = await bcrypt.hash(password,10)
    // const hashedPassword = await argon2.hash(password)
    return hashedPassword
 }

 userSchema.methods.comparePassword = async function(passwordIP){
    const result = await bcrypt.compare(passwordIP, this.password)
    return result
 }

// userSchema.methods.comparePassword = async function(enteredPassword){
//     const result = await argon2.verify(this.password, enteredPassword)
//     return result
// }

 userSchema.methods.getJWT = function() {
    const token = jwt.sign({_id : this._id},process.env.SECRET_KEY, {expiresIn:'7d'})
    return token
 } 

 const Users = mongoose.model("Users", userSchema)
 export default Users