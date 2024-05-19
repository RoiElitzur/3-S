import Welcome from './Welcome/Welcome.js';
import Register from './Register/Register.js';
import Chat from './Chat/Chat.js';
import './welcome.css';
import './chat.css'
import './register.css'
import './App.css';
import users from './users/users.js';
import { useState } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import  {io}  from "socket.io-client";
const socket = io('http://127.0.0.1:12345');
function App() {
  const [token,setToken] = useState('');
  const [view,setView] = useState('welcome');
  const [username, setUsername] = useState('');
  const handleViewChange = (newView) => {
    setView(newView);
  };


  const ChatRoute = () => {
    if (view !== 'chat') {
      return <Navigate to="/" replace={true} />;
    }
    return <Chat username={username} setView={setView} token={token} socket={socket}/>;
  };

  let screen = null;
  return(
  <BrowserRouter>
    <Routes>
    <Route
          path="/register" element={<Register onWelcomeClick={() => handleViewChange('welcome')}
        onRegisterSubmit={() => handleViewChange('welcome')} />}>
      </Route>
      <Route path="/chat" element={<ChatRoute />} ></Route>
      <Route path="/" element={<Welcome onRegisterClick={() => handleViewChange('register')}
              onValidSubmit={() => handleViewChange('chat')} setName={setUsername} setToken={setToken} socket={socket}/>}>
      </Route>
    </Routes>
  </BrowserRouter>);



  // if (view === 'welcome') {
  //   screen = <Welcome onRegisterClick={() => handleViewChange('register')} onValidSubmit={() => handleViewChange('chat')} setName={setUsername}/>;
  // } else if (view === 'register') {
  //   screen = <Register onWelcomeClick={() => handleViewChange('welcome')} onRegisterSubmit={() => handleViewChange('welcome')}/>;
  // } else if (view === 'chat' ) {
  //   screen = <Chat username={username}/>;
  // }
  // return <>{screen}</>;
}




export default App;
