import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './Auth/AdminLogin';
import Admin from './Pages/Admin';
import ProtectedRoute from './Auth/protectedRoute';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Home from './Pages/Home';
import Player from './Pages/Player';

function App() {
  return (
    <Container>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
         <Route path="/player/:id" element={<Player />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </Router>
    </Container>
    
  );
}

export default App;

const Container = styled.div`
display: flex;
width: 100vw;
background-color: #000000fa;
height: 100vh;
align-items: center;
justify-content: center;
`
