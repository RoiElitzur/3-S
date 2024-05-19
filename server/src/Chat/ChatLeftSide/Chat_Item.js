import { useRef, useState } from "react";
import users from '../../users/users.js';
function Chat_Item(props){
  // const [isInput,setIsInput] = useState("");
  // if(props.lastMsg.type === "input"){
  //   setIsInput("✓✓");
  // }
  // {isInput}
  let time = "";
  const user = users.find(user => user.username === props.username);
  if(props.lastMsg) {
    time = props.lastMsg.created;
  }
    return(
        <li className="chat-item" tabIndex="0" onClick={props.onClick}>
        <div className="chat-profile">
          <img src={props.picture} alt="Profile Image"></img>
          <div className="profile-details">
            <h3 className="nickname">{props.nickname}</h3>
            <p className="last-message">{props.lastMsg}</p>
            <span className="time"></span>
          </div>
          <div className="msgToRead">{user.toRead > 0 ? <b>NEW</b> : ""}</div> 
        </div>
      </li>
      
    );
}
export default Chat_Item;