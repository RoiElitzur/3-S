function OutgoingMsg(props){
    return(  
      <>
      <li>
    <div className="outgo">{props.message.content}
    <br></br>
    <div className="time-outgo">{props.message.created}</div>
  </div>
  </li>
  <br></br><br></br>
  </>
  );

}
export default OutgoingMsg;