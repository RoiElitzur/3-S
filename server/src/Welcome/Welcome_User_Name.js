function Welcome_User_Name(props){
    return( <div className="row">
    <div className="col-md-8">
      <div className="form-group row">
        <label htmlFor="inputText" className="col-sm-2 col-form-label">Username: </label>
        <div className="col-sm-10">
          <input type="text" className="form-control" id="inputText" placeholder="Enter username" ref={props.refName}></input>
        </div>
      </div>
    </div>
  </div>);
}
export default Welcome_User_Name;