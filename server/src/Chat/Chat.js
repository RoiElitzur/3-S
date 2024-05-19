import AddContact from "./ChatLeftSide/AddContact.js";
import ChatLeftSide from "./ChatLeftSide/ChatLeftSide.js";
import ChatRightSide from "./ChatRightSide/ChatRightSide.js";
import { useRef, useState , useEffect} from "react";
import Logout from "./ChatLeftSide/Logout.js";
import users from "../users/users.js";


// 'authorization': 'bearer ' + props.token // attach the token

function Chat(props){
    const [newContact,setNewContact] = useState(null);
    const [currentChat,setCurrentChat] = useState("");
    const [currentFriend,setCurrentFriend] = useState("");
    const [areaSize,setAreaSize] = useState("");
    const [newMessage,setNewMessage] = useState(0);
    const scrollableRef = useRef(null);
    const [msgToRead,setMsgToRead] = useState(0);


    useEffect(() => {
      props.socket.on('check', function (msg){
        console.log(msg);

        if(msg.currentFriend === props.username) {
          setNewMessage(1 - newMessage);
          if(msg.chatId !== currentChat) {
            let user = users.find(user =>user.username === msg.sender);
            if (user) {
              user.toRead = user.toRead + 1;
              setMsgToRead(1 - msgToRead);
          }
        }
      }}, [])});


     function calculateScrollableAreaHeight() {
      const beforeDiv = document.getElementById('picAndName');
      const afterDiv = document.getElementById('sendAfter');
      const scrollableList = document.getElementById('scrollList');
    
      if (beforeDiv && afterDiv && scrollableList) {
        const beforeRect = beforeDiv.getBoundingClientRect();
        const afterRect = afterDiv.getBoundingClientRect();
        const scrollableHeight = afterRect.top - beforeRect.bottom - 20;
        scrollableList.style.height = scrollableHeight + 'px';
        setAreaSize(scrollableHeight);
      }
    }

    useEffect(() => {
      window.addEventListener('resize', calculateScrollableAreaHeight);
      calculateScrollableAreaHeight();
  
      return () => {
        window.removeEventListener('resize', calculateScrollableAreaHeight);
      };
    }, []);

    
    useEffect(() => {
      calculateScrollableAreaHeight();
    }, [currentChat, areaSize]);

    useEffect(() => {
      calculateScrollableAreaHeight();
    }, []);




    const scrollToBottom = () => {
      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      }
    };


    useEffect(() => {
      scrollToBottom();
    }, [newMessage, currentFriend]);
  

    function calculatediffLeftSide() {
      
      const leftSide = document.getElementById("LeftSideParent");
      const diffToEnd = document.getElementById("chatListLeftSide");
    
      if (leftSide && diffToEnd) {
        const height = leftSide.offsetHeight - diffToEnd.offsetTop - diffToEnd.offsetHeight;
        diffToEnd.style.height = height + 'px';
      }
    }    
  
    return(
        <> 
        <Logout setView={props.setView} />
        <div className="c1">
          <div className="c2">
            <ChatLeftSide username={props.username} setCurrentChat={setCurrentChat} setAreaSize={setAreaSize} currentChat={currentChat} token={props.token}
            newContact={newContact} newMessage={newMessage} currentFriend={currentFriend} setCurrentFriend={setCurrentFriend}
              msgToRead={msgToRead} setMsgToRead={setMsgToRead}/>
              <ChatRightSide username={props.username} currentChat={currentChat} setAreaSize={setAreaSize} setNewMessage={setNewMessage}
                              newMessage={newMessage} scrollableRef={scrollableRef} token={props.token} socket={props.socket}
                              currentFriend={currentFriend} setMsgToRead={setMsgToRead}/>
              </div>
         </div>
        <AddContact username={props.username} setNewContact={setNewContact} token={props.token}/>
        </>)
}
export default Chat;