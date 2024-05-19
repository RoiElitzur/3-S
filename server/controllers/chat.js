import chatService from '../services/chat.js'
import chatUserService from '../services/chatUser.js'
// import {createChat,getChat,getChatsbyUsername,checkIfChatExist,deleteChat,addMassage,getMassages} from '../services/chat.js'
import User from '../services/user.js'
import appHelp from '../app.js'

const getChatsbyUsername = async(req,res) =>{
    const username = User.usernameFromToken(req.headers.authorization.split(" ")[1]);
    const chat = await chatService.getChatsbyUsername(username);

    res.status(200).send(chat);
}

const createChat = async(req,res) =>{
    const loginUser = User.usernameFromToken(req.headers.authorization.split(" ")[1]);
    const currentUser = await User.getUser(loginUser);
    const newContact = await User.getUser(req.body.username);
    if(!newContact){
        res.status(409).send('Contact not registerd');
        return;
    }
    const result = await chatService.checkIfChatExist(currentUser.username,newContact.username);
    if(!result){
        res.status(409).send('Chat already exist');
        return;
    }

    // const currentUser1 =await chatUserService.createUser(currentUser.username,currentUser.displayName,currentUser.profilePic);
    // const newContact1 = await chatUserService.createUser(newContact.username,newContact.displayName,newContact.profilePic);
    const currentUser1 =await { 'username' : currentUser.username,'displayName':currentUser.displayName,'profilePic' : currentUser.profilePic}
    const newContact1 = await { 'username' : newContact.username,'displayName':newContact.displayName,'profilePic' : newContact.profilePic}
    // const users = [newContact, currentUser];
    const users = [newContact1, currentUser1];
    const messages = [];
    const chat  = await chatService.createChat(users,messages);

    const forSend = {'id': chat._id, 'user' : newContact1};

    

    res.status(200).send(forSend);
}


const getChat = async(req,res) =>{
    const chat = await chatService.getChat(req.params.id)
    if(!chat){
        res.status(404).send('Chat is not exist');
    }
    res.status(200).send(chat);
}

const deleteChat = async(req,res) =>{
    const chat = await chatService.deleteChat(req.body.id);
    if(!chat){
        res.status(404).send('Chat is not exist');
    }
    res.status(200).send();
}
const addMassage = async(req,res) =>{
    const loginUser = User.usernameFromToken(req.headers.authorization.split(" ")[1]);

    const message = await chatService.addMassage(req.params.id,req.body.msg,loginUser);
    if(!message){
        res.status(404).send('Chat is not exist');
    }

    const chat = await chatService.getChat(req.params.id);
    const usersArr = chat.users;
    const otherUser = usersArr[0].username === loginUser ? usersArr[1].username : usersArr[0].username;
    const picture = usersArr[0].username === loginUser ? usersArr[1].profilePic : usersArr[0].profilePic;
    


    // console.log(message.content);
    // const token = req.headers.authorization.split(" ")[1];
    const token = User.createToken(otherUser);
    const chatId = req.params.id;
    User.sendNotification(otherUser, loginUser, message.content, token, chatId, picture, otherUser);
    appHelp.help(chatId, otherUser, loginUser);


    res.status(200).send(message);
}


const getMassages = async(req,res) =>{
    const messages = await chatService.getMassages(req.params.id);
    if(!messages){
        res.status(404).send('Chat is not exist');
    }
    res.status(200).send(messages);
}


export default {getChatsbyUsername, createChat, getChat, deleteChat, addMassage, getMassages};