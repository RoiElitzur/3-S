import users from '../../users/users.js';
import { useRef } from "react";
function SendBar(props){


    const inputRef = useRef("");
  
    async function handle(){
      if(inputRef.current.value === "") {
        return;
      }

      

      const msg = { "msg" : inputRef.current.value };
      const res = await fetch('http://localhost:12345/Chats/'+ props.currentChat + '/Messages', {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
         'authorization': 'bearer ' + props.token, // attach the token
        },
          'body': JSON.stringify(msg),
        });

        //if res.status !== 200 it means that there is a conflict because the username alread exists
        if(res.status !== 200) {
          return false;
        }
        const jas = {'chatId': props.currentChat, 'currentFriend': props.currentFriend, 'sender': props.username};
        props.socket.emit('newMsg', jas);


        // useEffect(() => {
        //   props.socket.on('connect', function (msg){
  
        //       props.socket.on("welcome", console.log);
  
        //       console.log("zain");
        //       props.socket.emit('i am client','zain1');
        //   }, [])});
  


        // const messages = user.messages.find((chat)=> chat.user === props.currentChat);
        // messages.chat.push({type:'input', data:inputRef.current.value, time:getCurrentTime(), date:getCurrentDate()});
        inputRef.current.value = "";
        
        props.setNewMessage(1 - props.newMessage);

    }
    return(  <div className="input-bar" id="sendAfter">
    <input type="text" placeholder="New message here..." className="inputText" ref={inputRef}></input>
    <button type="button" className="btn btn-success" onClick={handle}>Send</button>
 </div>);

}
export default SendBar;