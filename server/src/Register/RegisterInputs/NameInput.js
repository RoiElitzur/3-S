function NameInput(props) {
    return(
        <div className = "row">
                <div className="col-md-8">
                    <div className="form-group row">
                        <label htmlFor="username" className="col-sm-2 col-form-label">{props.name}:</label>
                        <div className="col-sm-10">
                        <input type="text" className="form-control" id={props.id} name="username" placeholder={`Enter ${props.name}`} ref={props.inputName}></input>
                        <br></br>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default NameInput;