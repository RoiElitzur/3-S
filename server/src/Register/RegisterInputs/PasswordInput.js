function PasswordInput(props) {
    return(
        <div className = "row">
                <div className="col-md-8">
                    <div className="form-group row">
                        <label htmlFor="password" className="col-sm-2 col-form-label">{props.name}:</label>
                        <div className="col-sm-10">
                        <input type="password" className="form-control" id={props.id} name="password" placeholder={`Enter ${props.name}`} ref={props.inputPassword}></input>
                        <br></br>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default PasswordInput;