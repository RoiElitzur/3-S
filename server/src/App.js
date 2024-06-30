import Welcome from './Welcome/Welcome.js';
import Register from './Register/Register.js';
import Chat from './Chat/Chat.js';
import SolutionTable from "./SolutionTable/SolutionTable.js";
import './SolutionTable/SolutionTable.css'
import './App.css';
import Landing from './Landing/Landing.js'
import Preferences from './Preferences/Preferences.js'
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
      <Route path="/solution" element={<SolutionTable/>}></Route>
      <Route path="/preferences" element={<Preferences />}></Route>
    <Route
          path="/register" element={<Register onWelcomeClick={() => handleViewChange('welcome')}
        onRegisterSubmit={() => handleViewChange('login')} />}>
      </Route>
      <Route path="/chat" element={<ChatRoute />} ></Route>
      <Route path="/login" element={<Welcome onRegisterClick={() => handleViewChange('register')}
                                        onValidSubmit={() => handleViewChange('solution')} setName={setUsername} setToken={setToken} socket={socket}/>}>
      </Route>
      <Route path="/" element={<Landing onRegisterClick={() => handleViewChange('register')}
                                                          onLoginClick={() => handleViewChange('login')} />} >

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
