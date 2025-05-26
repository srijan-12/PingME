import Users from "../../model/userModel.js"
export default async function searchUser(req,res){
    try {
        const {keyword} = req.body;
        if(!keyword || !keyword.trim()){
            throw new Error('Enter name to search');
        }
        const result = await Users.find({
            $or:[{
                name : {$regex : keyword, Option : "i"}
            },{}]
        })

    } catch (error) {
        
    }
}