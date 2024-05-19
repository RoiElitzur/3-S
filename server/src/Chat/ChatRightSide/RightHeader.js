import users from '../../users/users.js';
function RightHeader(props){
 
  return(<div className="chat-item plus" id="picAndName">
  <div className="chat-profile">
  <img src={props.currentChat.profilePic} alt="Profile Image"></img>
  <div className="profile-details">
      <span>
       <b>{props.currentChat.displayName}</b>
      </span>
      </div>
  </div>
</div>);
  }

export default RightHeader;