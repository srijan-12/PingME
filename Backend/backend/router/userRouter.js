import { Router } from "express";
import signup from "../controller/user/signup.js";
import login from "../controller/user/login.js";
import { satizeRegisterDetails } from "../middlewares/sanatizeRegisterDetails.js";
import { satizeLoginDetails } from "../middlewares/satizeLoginDetails.js";
import upload from "../middlewares/cloudinaryUpload.js";
import authCheck from "../middlewares/authCheck.js";
import getCurrentuser from "../controller/user/getCurrentUser.js";
import searchForUser from "../controller/user/searchForUser.js";

const userRouter = Router()

userRouter.post('/signup',upload.single('picture'), satizeRegisterDetails,signup)
userRouter.post('/login', satizeLoginDetails,login)
userRouter.get('/chat', authCheck)
userRouter.get("/auth", authCheck,getCurrentuser)
userRouter.get("/search", authCheck, searchForUser)

export default userRouter