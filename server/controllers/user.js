import userService from '../services/user.js';
import jwt from 'jsonwebtoken'

const createUser = async(req, res) => {
    if(await userService.isUsernameExists(req.body.username) === true) {
        return res.status(409).send();  
    }
    await userService.createUser(req.body.username, req.body.password, req.body.email);
    return res.status(200).send();
};


const isUsernameAndPasswordValid = async(req, res) => {
    if(await userService.isUsernameAndPasswordValid(req.body.username, req.body.password)) {
        const token = userService.createToken(req.body.username);
        res.status(200).send(token);
    } else {
        res.status(404).send('Invalid username and/or password');
    }
}

const saveFirebaseToken = async(req, res) => {
    userService.saveFirebaseToken(req.body.username, req.body.token);
};



const getUser = async (req, res) => {
    const user = await userService.getUser(req.params.username);

    if(user) {
        res.status(200).send(user);
    } else {
        res.status(404).send();
    }
}





const isLoggedIn = (req, res, next) => {
    // If the request has an authorization header
    if (req.headers.authorization) {
    // Extract the token from that header
    const token = req.headers.authorization.split(" ")[1];
    try {
    // Verify the token is valid
    const key = "RoiAndYarin";
    const data = jwt.verify(token, key);
        // Token validation was successful. Continue to the actual function (index)
    return next()
    } catch (err) {
    return res.status(401).send("Invalid Token");
    }
    }
    else
    return res.status(403).send('Token required');
    }



export default {createUser, isUsernameAndPasswordValid, getUser, isLoggedIn, saveFirebaseToken};
