import { useRef, useState } from "react";
import users from '../../users/users.js';

function AddContact(props){
    const inputRef = useRef("");
    const [error,setError] = useState(null);


    // function getUser(username) {
    //   return users.find(user => user.username === username);
    // }
  
    // const user = getUser(props.username);
    const handle = async (event) => {
        setError("");
        const contact = {"username": inputRef.current.value}





        const res = await fetch('http://localhost:12345/Chats', {
          'method': 'post', // send a post request
          'headers': {
          'Content-Type': 'application/json',
          'authorization': 'bearer ' + props.token  // the data (username/password) is in the form of a JSON object
          },
          'body':  JSON.stringify(contact) // The actual data (username/password)
          }
          )
          if (res.status != 200) {
            setError(await res.text());
          }
          else {
          props.setNewContact(inputRef.current.value);
          }
            


        
        // const contact = users.find((user) => user.username === inputRef.current.value)
        // if(contact){
        //   if (user.contacts.find((candid) => candid === contact.username)) {
        //     setError("Contact already in chat list");
        //     return;
        //   }
        //   user.contacts.push(contact.username);
        //   user.messages.push({user:contact.username, chat:[]});
        //   props.setNewContact(inputRef.current.value);
        // }
        // else{
        //   // setError("Contact not found");
        // }
        
    }



    return(  <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">Add new contact</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div className="modal-body">
          <input type="text" className="form-control" id="inputText" placeholder="Contact's identifier" ref={inputRef}></input>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handle}>Add</button>
          {error}
        </div>
      </div>
    </div>
  </div>);

}
export default AddContact;