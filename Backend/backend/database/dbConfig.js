import mongoose from "mongoose"
import {configDotenv} from "dotenv"
configDotenv()
const uri = process.env.MONGO_URI
console.log(uri)
export const connectToDB = async() =>{
    await mongoose.connect(uri)
}