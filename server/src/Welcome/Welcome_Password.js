function Welcome_Password(props){
    return( <div className="row">
    <div className="col-md-8">
      <div className="form-group row">
        <label htmlFor="inputText1" className="col-sm-2 col-form-label">Password: </label>
        <div className="col-sm-10">
          <input type="password" className="form-control" id="inputText1" placeholder="Enter password" ref={props.refName1}></input>
        </div>
      </div>
    </div>
  </div>);
}
export default Welcome_Password;