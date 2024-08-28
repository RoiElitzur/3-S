import { useRef, useState, useEffect } from "react";
import './welcome.css';
import { Link , useNavigate} from 'react-router-dom';
function Welcome(props){
    const usernameRef = useRef("");
    const passRef = useRef("");
    const [errorList,setErrorsList] = useState("");
    const navigate = useNavigate();




     async function checkLogin (){
            const data = {
            username: usernameRef.current.value,
            password: passRef.current.value
            }
            // Send post request to the server asynchronously
            // fetch sends the asynchronous request
            // The request is sent to the server according to the url that was set in: document.forms[0].action
            // The await keyword ensures that 'res' will have the result from the server.
            // even though 'fetch' is asynchronous
            
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

    const validate = function(){
         setErrorsList("");
        if(usernameRef.current.value === "") {
            setErrorsList("Please insert user name");
            return false;
        }
        if(passRef.current.value.length < 8) {
            setErrorsList("The password must be at least 8 characters");
            return false;
        }
        return true;
    }


     const handleSubmit = async (event) =>{
        event.preventDefault();
        if(validate()){
            if(await checkLogin()) {
                props.setName(usernameRef.current.value);
                props.onValidSubmit();
                navigate('/preferences');
                return true;
            } else {
                setErrorsList("One of the details is invalid, please try again");
                return false;
            }
        }
    }


    const handleSignUpClick = (event) =>{
        event.preventDefault(); // prevent form submission
        props.onRegisterClick();
        navigate('/register');
    }
    return (
        <div className="login">
            <div className="navbar">
                <div className="brand">3-S</div>
                <div className="nav-links">
                    <a href="#" className="nav-button">About</a>
                    <a href="#" className="nav-button">Preferences</a>
                    <a href="#" className="nav-button">Solutions List</a>
                    <a href="#" className="nav-button">Solution Preview</a>
                    <a href="#" className="nav-button">Contact us</a>
                </div>
            </div>
            <div className="form-container">
                <h1 className="headline">Login</h1>
                <div>
                    {errorList}
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" className="input-field" placeholder="Username" ref={usernameRef}/>
                    <input type="password" className="input-field" placeholder="Password" ref={passRef}/>
                    <br></br>
                    <button type="submit" className="primary-button">Login</button>
                </form>
                <p className="redirect">
                    Don't have an account? <Link to="/login" onClick={handleSignUpClick} className="redirect-link">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default Welcome;
