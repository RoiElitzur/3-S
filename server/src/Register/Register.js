import {useState} from 'react';
import {useRef} from 'react';
import users from '../users/users.js';
import ReactDOM from 'react-dom/client';
import NameInput from './RegisterInputs/NameInput.js'
import PasswordInput from './RegisterInputs/PasswordInput.js'
import PictureInput from './RegisterInputs/PictureInput.js';
import { Link , useNavigate} from 'react-router-dom';

function Register(props){
    const navigate = useNavigate();
    const inputUserName = useRef("");
    const inputPassword = useRef("");
    const inputPasswordValidation = useRef("");
    const inputPicture = useRef("");
    const inputNickname = useRef("");
    const [errorsList, setErrosList] = useState("");
    const [valid, setValid] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    
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
        if(inputNickname.current.value === "") {
          setErrosList("Please insert display name");
          return false;
         }
        if(inputPicture.current.value === "") {
          setErrosList("Please choose a picture");
          return false;
        }




        
         

        // const temp = {username:inputUserName.current.value, password:inputPassword.current.value, 
        //               nickname:inputNickname.current.value, picture:{selectedImage}, contacts:[], messages:[]};
        
        const temp = {"username": inputUserName.current.value, "password": inputPassword.current.value, 
          "displayName": inputNickname.current.value, "profilePic": selectedImage}; 
        
        

        const res = await fetch('http://localhost:12345/Users', {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
          'body': JSON.stringify(temp),
        });
        //if res.status !== 200 it means that there is a conflict because the username alread exists
        if(res.status !== 200) {
          setErrosList("Username already exist");
          return false;
        }
            

        // if(users.length !== 0){
        //     const usernameExists = users.some(user => user.username === inputUserName.current.value);
        //         if(usernameExists) {
        //         setErrosList("Username already exist");
        //         return false;
        //         }
        // }
        setValid("Registeration completed successfully");
        // users.push(temp);
        props.onRegisterSubmit();
        return true;
      }

      const handleWelcome = (event) => {
        event.preventDefault(); // prevent form submission
        props.onWelcomeClick();
        navigate('/');
      }

      const handleSubmit = async (event) => {
        event.preventDefault(); // prevent form submission
        if(await validate() === true) {
          navigate('/');
        } // call the validation function
        
      }
    return( 
        <div className="container-fluid container-center">
        <form className='register container' onSubmit={handleSubmit}>
        <br></br>
        <div>
          {errorsList}
        </div>
        <NameInput name="Username" inputName={inputUserName} id="username"/>
        <PasswordInput name="Password" inputPassword={inputPassword} id="password"/>
        <PasswordInput name="Confirm password" inputPassword={inputPasswordValidation} id="ver_password"/>
        <NameInput name="Display name" inputName={inputNickname} id="display_name"/>
        <PictureInput inputPicture={inputPicture} setImage={setSelectedImage} image={selectedImage} />
        <br></br>
        <div>
            <span>
                <button className ="btn btn-success" type="submit" id="x">Register</button>
            </span>
            <span >
                Already registerd? <Link to="/" onClick={handleWelcome}>Click here</Link> to login
            </span>
        </div>
        <br></br>
        <br></br>
        <br></br>
    </form>
</div>);
}
export default Register;
