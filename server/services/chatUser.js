import chatUser from "../models/chatUser.js";

const createUser = async (username,displayName, profilePic) => {
    
    const user = await new chatUser({username,displayName, profilePic});
    await user.save();
    return user;
};
export default {createUser};