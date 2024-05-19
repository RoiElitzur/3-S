
function Logout(props){
    
    const handle = (event) => {
       props.setView('welcome');
    }

    return(
        <button type="button" className="btn btn-danger Logout" onClick={handle}>Logout</button>);
}
export default Logout;