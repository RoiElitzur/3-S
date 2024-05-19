import {  useState, useEffect } from "react";
function LeftHeader(props){
  const [myPicture,setMyPicture] = useState('');

  async  function getPicture() {
    try {

    

      const res = await fetch('http://localhost:12345/Users/'+ props.username, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'bearer ' + props.token
        },
      });
      if (res.status === 200) {
        const data = await res.json();
        setMyPicture(data.profilePic);
      } else {
        setMyPicture('[]');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMyPicture('[]');
    }
  }
  
  useEffect( ()=>{ getPicture()},[]);
  
  

    return(
    <div className="chat-item plus">
    <div className="chat-profile">
    <img src={myPicture} alt="Profile Image"></img>
    <div className="profile-details">
        <span>
         <b>{props.username}'s Chat List</b>
        </span>
        <span className="modal-button">
        <button type="button"  className="btn btn-success btn-xs" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <img src="emoji.png" style={{width:'25px' , height:'25px'}}></img>
        </button>
         </span>
        </div>
    </div>
</div>);
}
export default LeftHeader;