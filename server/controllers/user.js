import userService from '../services/user.js';

const createUser = async(req, res) => {
    if(await userService.isUsernameExists(req.body.username) === true) {
        return res.status(409).send();  
    }
    await userService.createUser(req.body.username, req.body.password, req.body.email);
    return res.status(200).send();
};


const isUsernameAndPasswordValid = async(req, res) => {
    if(await userService.isUsernameAndPasswordValid(req.body.username, req.body.password)) {
        res.status(200).send('Success');
    } else {
        res.status(404).send('Invalid username and/or password');
    }
}



export default {createUser, isUsernameAndPasswordValid};
