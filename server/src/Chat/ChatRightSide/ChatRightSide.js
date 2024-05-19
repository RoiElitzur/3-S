import IncomeMsg from "./IncomeMsg.js";
import OutgoingMsg from "./OutgoingMsg.js";
import RightHeader from "./RightHeader.js";
import SendBar from "./SendBar.js";
import { useRef } from "react";
import { useState } from "react";
import { useEffect} from "react";
import users from '../../users/users.js';




function ChatRightSide(props){


  function calculateScrollableAreaHeight() {
    const beforeDiv = document.getElementById('picAndName');
    const afterDiv = document.getElementById('sendAfter');
    const scrollableList = document.getElementById('scrollList');
  
    if (beforeDiv && afterDiv && scrollableList) {
      const beforeRect = beforeDiv.getBoundingClientRect();
      const afterRect = afterDiv.getBoundingClientRect();
      const scrollableHeight = afterRect.top - beforeRect.bottom - 20;
      scrollableList.style.height = scrollableHeight + 'px';
      props.setAreaSize(scrollableHeight);
    }
  } 
  const [chat,setChat] = useState({});

  
  useEffect(() => {
    calculateScrollableAreaHeight();
  }, [props.currentChat, chat]);
  
  

  
  const sendBarRef = useRef("");
  const [errorsList, setErrosList] = useState("");


  const scrollToBottom = () => {
    if (props.scrollableRef.current) {
      props.scrollableRef.current.scrollTop = props.scrollableRef.current.scrollHeight;
    }
  };


  useEffect(() => {
    scrollToBottom();
  }, [chat]);


  
  

  async function getChat() {
  try {
    const res = await fetch('http://localhost:12345/Chats/'+ props.currentChat, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'bearer ' + props.token
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      setChat(data);
    } else {
      setChat([]);
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
    setChat([]);
  }
}
useEffect(()=>{ getChat()},[props.currentChat,props.newMessage]);
if(!chat || !chat.messages){
  return;
}
  
    let len = chat.messages.length;
    if(len === 0){
        return(<div className="col-md-6 col-lg-7 col-xl-8">
        <RightHeader currentChat={chat.users[0]}/>
        <ul className="scrollable" id="scrollList" ref={props.scrollableRef}>
        </ul>
        <SendBar username={props.username} currentChat={props.currentChat} newMessage={props.newMessage} setNewMessage={props.setNewMessage} token={props.token} socket={props.socket}/>
      </div>)
    }

    const proceed = function(message, key){
      if(message.sender.username === props.username) {
          return <OutgoingMsg message={message} key={key}/>
        }
      else{
        return <IncomeMsg message={message} key={key}/>;
      }
    }
    const body = chat.messages.map((message ,key) => {return proceed(message, key)})
    
    
    return(<div className="col-md-6 col-lg-7 col-xl-8">
        <RightHeader currentChat={chat.users[0].username===props.username? chat.users[1] : chat.users[0]}/>
       
        <ul className="scrollable" id="scrollList" ref={props.scrollableRef}>
        {body}
        </ul>
        <SendBar username={props.username} currentChat={props.currentChat} newMessage={props.newMessage}
        setNewMessage={props.setNewMessage} token={props.token} socket={props.socket} currentFriend={props.currentFriend}/>
      </div>);
}
export default ChatRightSide;
