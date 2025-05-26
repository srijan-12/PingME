import Users from "../../model/userModel.js"

export default async function searchForUser(req,res) {
    try {
        const {name} = req.query
        const currentUserId = req.user._id
        if(name){
            const searchUser = await Users.find({
                $and:[
                    {_id : {$ne : currentUserId}},
                    {
                        $or:[
                            {name : {$regex : name, $options : 'i'}},    //regex will match the pattern and i is for case insensitive
                            {email : {$regex : name, $options : 'i'}}
                        ]
                    }
                ]
            })
            if(searchUser.length > 0){
                return res.status(200).json({result : searchUser, error: null})
            }
            return res.status(200).json({result : [], error: null})
        }
    } catch (error) {
        return res.status(400).json({result : null, error: error.message})
    }
}


