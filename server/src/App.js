import Welcome from './Welcome/Welcome.js';
import Register from './Register/Register.js';
import SolutionTable from "./SolutionTable/SolutionTable.js";
import Solutions from "./Solutions/Solutions.js";
import './SolutionTable/SolutionTable.css'
import './App.css';
import Landing from './Landing/Landing.js'
import Preferences from './Preferences/Preferences.js'
import { useState } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
function App() {
  const [view,setView] = useState('welcome');
  const handleViewChange = (newView) => {
    setView(newView);
  };

  return(
  <BrowserRouter>
    <Routes>
      <Route path="/solution" element={<SolutionTable />}></Route>
      <Route path="/solutions" element={<Solutions />}></Route>
      <Route path="/preferences" element={<Preferences />}></Route>
    <Route
          path="/register" element={<Register onWelcomeClick={() => handleViewChange('welcome')}
        onRegisterSubmit={() => handleViewChange('login')} />}>
      </Route>
      <Route path="/login" element={<Welcome onRegisterClick={() => handleViewChange('register')}
                                        onValidSubmit={() => handleViewChange('preferences')} />}>
      </Route>
      <Route path="/" element={<Landing onRegisterClick={() => handleViewChange('register')}
                                                          onLoginClick={() => handleViewChange('login')} />} >

      </Route>
    </Routes>
  </BrowserRouter>);
}




export default App;
