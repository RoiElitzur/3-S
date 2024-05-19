import { useRef, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

function Welcome_Login_Register(props){
  const navigate = useNavigate();

  const handleSubmit = async(event) => {
      event.preventDefault();
      if(await props.onSubmit(event) === true) {
        navigate('/chat');
      }
  };  
  
  const handleClick = (event) => {
    event.preventDefault();
   
    props.onLinkClick();
    navigate('/register');
  }

  
    return( <div className="row">
    <div className="col-md-12">
      <div className="form-group row">
        <div className="col-sm-12">
            <span>
                <button className="btn btn-success w_l" type="submit" onClick={handleSubmit}>Login</button>
            </span>
            <span>
                Not registered?
                <Link to="/register" onClick={handleClick}>Click here </Link>
                to register
            </span>
        </div>
      </div>
    </div>
  </div>);
}
export default Welcome_Login_Register;