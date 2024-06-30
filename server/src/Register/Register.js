import {useState} from 'react';
import {useRef} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './register.css'


function Register(props) {


    const inputUserName = useRef("");
    const inputPassword = useRef("");
    const inputPasswordValidation = useRef("");
    const inputEmail = useRef("");
    const [errorsList, setErrosList] = useState("");
    const [valid, setValid] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // prevent form submission
        if(await validate() === true) {
          navigate('/');
        } // call the validation function
    }

    const handleWelcome = (event) => {
        event.preventDefault(); // prevent form submission
        props.onWelcomeClick();
        navigate('/login');
    }

    const validate = async function() {
        setErrosList("");
        setValid("");
        if(inputUserName.current.value === "") {
         setErrosList("Please insert user name");
         return false;
        }
        if(inputPassword.current.value.length < 8) {
          setErrosList("The password must be at least 8 charecters");
          return false;
        }
        if(inputPassword.current.value !== inputPasswordValidation.current.value) {
          setErrosList("Please confirm the password again");
          return false;
        }
          const res = await fetch('http://localhost:12345/Users', {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
          // 'body': JSON.stringify(temp),
        });
        //if res.status !== 200 it means that there is a conflict because the username alread exists
        if(res.status !== 200) {
          setErrosList("Username already exist");
          return false;
        }
        setValid("Registeration completed successfully");
        props.onRegisterSubmit();
        return true;

    }
    return (
        <div className="register">
            <div className="navbar">
                <div className="brand">3-S</div>
                {/*<div className="nav-links">*/}
                {/*    <a href="#" className="nav-button">About</a>*/}
                {/*    <a href="#" className="nav-button">Preferences</a>*/}
                {/*    <a href="#" className="nav-button">Solutions List</a>*/}
                {/*    <a href="#" className="nav-button">Solution Preview</a>*/}
                {/*    <a href="#" className="nav-button">Contact us</a>*/}
                {/*</div>*/}
            </div>
            <div className="form-container">
                <h1 className="headline">Create account</h1>
                <form onSubmit={handleSubmit}>
                    <div className="error-list">
                    {errorsList}
                    </div>
                    <input type="text" className="input-field" placeholder="Username" ref={inputUserName}/>
                    <input type="email" className="input-field" placeholder="Email" ref={inputEmail}/>
                    <input type="password" className="input-field" placeholder="Confirm password" ref={inputPassword}/>
                    <input type="password" className="input-field" placeholder="Renter password" ref={inputPasswordValidation}/>
                    <br></br>
                    <button type="submit" className="primary-button">Sign Up</button>
                </form>
                <p className="redirect">
                    Already have an account? <Link to="/" onClick={handleWelcome}>Click here</Link> to login
                </p>
            </div>
        </div>
    );
}

export default Register;

