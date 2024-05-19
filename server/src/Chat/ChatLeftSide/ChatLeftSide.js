import ChatList from "./ChatList.js";
import LeftHeader from "./LeftHeader.js";
import users from '../../users/users.js';
function ChatLeftSide(props){
   
    
    return(<div className="col-md-6 col-lg-5 col-xl-4" id="LeftSideParent">
    <LeftHeader username={props.username} token={props.token}/>
    <ChatList username={props.username} setCurrentChat={props.setCurrentChat} setAreaSize={props.setAreaSize} currentChat={props.currentChat} token={props.token} newContact={props.newContact}
    newMessage={props.newMessage} currentFriend={props.currentFriend} setCurrentFriend={props.setCurrentFriend}/>
</div>);
}
export default ChatLeftSide;