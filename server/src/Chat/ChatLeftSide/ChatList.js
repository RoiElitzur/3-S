import Chat_Item from "./Chat_Item.js";
import users from '../../users/users.js';
import { useEffect, useState } from "react";
function ChatList(props){
    const [contacts,setContacts] = useState([]);


async  function getContacts() {
  try {
    const res = await fetch('http://localhost:12345/Chats', {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json',
        'authorization': 'bearer ' + props.token
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      setContacts(data);
    } else {
        setContacts([]);
    }
  } catch (error) {
    setContacts([]);
  }
}

useEffect( ()=>{ getContacts()},[props.newContact,props.newMessage]);

function calculatediffLeftSide() {
      
  const leftSide = document.getElementById("LeftSideParent");
  const diffToEnd = document.getElementById("chatListLeftSide");

  if (leftSide && diffToEnd) {
    const height = leftSide.offsetHeight - diffToEnd.offsetTop - diffToEnd.offsetHeight;
    diffToEnd.style.height = height + 'px';
  }
}    

// useEffect(() => {
//   calculatediffLeftSide();
// }, [contacts]);


  let usersList = "";
  if(contacts && contacts.length != 0){
   usersList = contacts.map((chat,key) => {
                if(chat.lastMessage !== null){
                  let user = users.find(user =>user.username === chat.user.username);
                    if (!user) {
                      users.push({'username' : chat.user.username, 'toRead' : 0});
                  }
                  return <Chat_Item nickname={chat.user.displayName} lastMsg={chat.lastMessage} picture={chat.user.profilePic} key={key} username={chat.user.username}
                  onClick={()=> {props.setCurrentChat(chat.id);props.setCurrentFriend(chat.user.username);
                    users.find(user => user.username === chat.user.username).toRead = 0;
                  }}/>
                }
                else{
                  let user = users.find(user =>user.username === chat.user.username);
                  if (!user) {
                    users.push({'username' : chat.user.username, 'toRead' : 0});
                  }
                  return <Chat_Item nickname={chat.user.displayName} lastMsg="" picture={chat.user.profilePic} key={key} username={chat.user.username}
                  onClick={()=>{props.setCurrentChat(chat.id);props.setCurrentFriend(chat.user.username);
                    users.find(user => user.username === chat.user.username).toRead = 0;}}/>
                }      
        }); 
  }

    
        return(<ul className="chat-list" id="chatListLeftSide">
            {usersList}
        </ul>);
  
}
export default ChatList;