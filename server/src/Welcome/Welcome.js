import Welcome_Login_Register from "./Welcome_Login_Register.js";
import Welcome_Password from "./Welcome_Password.js";
import Welcome_User_Name from "./Welcome_User_Name.js";
import { useRef, useState, useEffect } from "react";
import users from '../users/users.js';

function Welcome(props){
    const usernameRef = useRef("");
    const passRef = useRef("");
    const [errorList,setErrosList] = useState("");
    const validate = function(){
        if(usernameRef.current.value === "") {
            setErrosList("Please insert user name");
            return false;
           }
        if(passRef.current.value.length < 8) {
             setErrosList("The password must be at least 8 charecters");
             return false;
        }
        // if(users.some((user) => usernameRef.current.value === user.username && passRef.current.value === user.password)){
        //     return true;
        // }
        // else{
        //     setErrosList("One of the details is invalid, please try again");
        //     return false;
        // }
        return true;
    }

     async function checkLogin (){
            const data = {
            username: usernameRef.current.value,
            password: passRef.current.value
            }
            // Send post request to the server asynchrounously
            // fetch sends the asynchrounous request
            // The request is sent to the server according to the url that was set in: document.forms[0].action
            // The await keyword ensures that 'res' will have the result from the server.
            // even though 'fetch' is asynchrounous
            
            try {
                const res = await fetch('http://localhost:12345/Tokens', {
            'method': 'POST', // send a post request
            'headers': {
            'Content-Type': 'application/json', // the data (username/password) is in the form of a JSON object
            },
            'body': JSON.stringify(data) // The actual data (username/password)
            }
            )
            if (res.status != 200) {
                return false;
            }
            else {
            // Correct username/password
            // Take the token the server sent us
            // and make *another* request to the homepage
            // but attach the token to the request
            const resText = await res.text();
            props.setToken(resText);
            return true;
           
            }
            } catch(error) {
                return false;
            }     
    }

     const handleSubmit = async (event) =>{
        event.preventDefault();
        if(validate()){
            if(await checkLogin()) {
                props.setName(usernameRef.current.value);
                props.onValidSubmit();
                return true;
            } else {
                setErrosList("One of the details is invalid, please try again");
                return false;
            }
        }
    }

    // useEffect(() => {
    //     props.socket.on('connect', function (msg){

    //         props.socket.on("welcome", console.log);

    //         console.log("aaa");
    //         props.socket.emit('i am client','aaa1');
    //     }, [])});


    return(
         <div className="container-fluid container-center">
        <form className="welcome container">
        <div>
          {errorList}
        </div>   
        <br></br>
        <Welcome_User_Name refName={usernameRef}/>
        <br></br>
        <br></br>
        <Welcome_Password refName1={passRef}/>  
        <br></br>
        <br></br>
        <Welcome_Login_Register onLinkClick={props.onRegisterClick} onSubmit={handleSubmit}/>
        <br></br>
        </form>
        </div>
        )
       
}
export default Welcome;
