import Chat from '../models/chat.js'
import Massage from '../models/massage.js'
import userService from '../services/user.js'




const createChat = async (users, messages) => {
    const chat = new Chat({
      users: users,
      messages: messages
    });
  
    await chat.save();
    return chat;
  };
  
const getChat = async(id) =>{
    return await Chat.findById(id);
};
// const getChatsbyUsername = async(username)=>{
//      const chat = await Chat.find({users:{$elemMatch: {username: username}}});
//      return chat;
// }


const checkIfChatExist = async (username1, username2) => {
    const chat = await Chat.find({
      $and: [
        { users: { $elemMatch: { username: username1 } } },
        { users: { $elemMatch: { username: username2 } } }
      ]
    });
    // const chat = await Chat.find({});
    if(chat.length > 0){
        return false;
    } else {
        return true;
    }
  };


const deleteChat = async(id)=>{
    const chat = await getChat(id);
    if(!chat)
        return false;
    await chat.deleteOne();
    return true;
}

// 'sender': {
//     type:{'username': {
//         type: String,
//         required: true
//     }, 
//     'displayName': {
//         type: String,
//         required: true
//     },
//     'profilePic': {
//         type: String,
//         required: false
//     }}
// },
// 'content':{
//     type: String,
//     default: ""
// }


const createMessage = async(sender,content) => {
    const senderUser = await userService.getUser(sender);
    const currentDate = new Date();
    const message = {'created': currentDate,  'sender': senderUser, 'content': content};
    return message;
}



const addMassage = async(id,message,user) =>{

    const chat = await getChat(id);


    if(chat.length === 0) {
        return null;
    } else {
        const newMessage =  await createMessage(user,message);


        await chat.messages.push(newMessage);
        await chat.save();
        return newMessage;
    }
}

const getMassages = async(id) =>{
    const chat = await getChat(id);
    if(!chat)
        return null;
    return chat.messages;
}


const getChatsbyUsername = async(username)=>{
    const chats = await Chat.find({users:{$elemMatch: {username: username}}});
    const finalChat = [];
    chats.map(async(chat)=> {
       let lastMessage = null;
       let contactName = null;
       let displayName = null;
       let profilePic = null;
       await chat.users.map ((user)=>{
           if(user.username !== username){
               contactName = user.username;
               displayName = user.displayName;
               profilePic = user.profilePic;
               return;
           }
       })
       let size = chat.messages.length;
       if(size > 0) {
        lastMessage = chat.messages[size - 1].content;
       }
    //    await chat.messages.map((message)=>{ 
    //        if(message.sender === username ){
    //            lastMessage == message.content;
    //        }
    //    })
       let result = {"id": chat._id , "user" : { "username": contactName , "displayName": displayName , "profilePic": profilePic} , "lastMessage": lastMessage};
       finalChat.push(result);
       }
   )
   
    return finalChat;
}

export default {createChat,getChat,getChatsbyUsername,checkIfChatExist,deleteChat, addMassage ,getMassages}
// export default module.exports;