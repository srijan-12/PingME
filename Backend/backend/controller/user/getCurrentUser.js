export default function getCurrentuser(req,res){
    console.log("this api is being called")
    const user = req.user
    return res.status(200).json({result: user, error: null})
}