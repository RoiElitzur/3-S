import User from '../models/user.js';



const createUser = async (username, password, email) => {
    const user = new User({username, password, email});
    return await user.save();
};


const isUsernameExists = async (username) => {
    const username1 = await User.find({username : username});
    if(username1.length === 0) {
        return false;
    }
    return true;
}

const isUsernameAndPasswordValid = async(username, password) => {
    const user = await User.findOne({username : username, password : password});
    if(user===null) {
        return false;
    }
    return true;
}





export default {createUser, isUsernameExists, isUsernameAndPasswordValid};
