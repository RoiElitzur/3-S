import './landing.css'
import { Link , useNavigate} from 'react-router-dom';
function Landing(props) {
    const navigate = useNavigate();
    const handleSignUpClick = (event) =>{
        event.preventDefault(); // prevent form submission
        props.onRegisterClick();
        navigate('/register');
    }
    const handleLoginClick = (event) => {
        event.preventDefault(); // prevent form submission
        props.onLoginClick();
        navigate('/login');
    }

    return (
            <div className="landing">
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
                <div className="hero-content">

                    <h1 className="headline">Because your time<br/>is expensive</h1>
                    <p className="subheadline">
                        <span className="highlight">Sat </span>
                        <span>Solver </span>
                        <span className="highlight">Scheduling</span>
                    </p>
                    <div className="buttons">
                    <Link to="/login">
                        <button type="button" className="primary-button" onClick={handleLoginClick}>Login</button>
                    </Link>

                        <Link to="/register">
                            <button type="button" className="secondary-button" onClick={handleSignUpClick}>Sign Up</button>
                        </Link>
                    </div>
                </div>
            </div>

    );
}

export default Landing;
