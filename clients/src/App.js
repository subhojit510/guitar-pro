import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './Auth/AdminLogin';
import Admin from './Pages/Admin';
import ProtectedRoute from './Auth/protectedRoute';
import { ToastContainer } from 'react-toastify';
import styled, { ThemeProvider } from 'styled-components';
import Home from './Pages/Home';
import Player from './Pages/Player';

function App() {
  const [themeMode, setThemeMode] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<Home toggleTheme={toggleTheme} themeMode={themeMode} />} />
           <Route path="/player/:id" element={<Player toggleTheme={toggleTheme} themeMode={themeMode} />} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin toggleTheme={toggleTheme} themeMode={themeMode} />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  overflow: auto;
  width: 100vw;
  background-color: ${({ theme }) => theme.background};
  height: 100vh;
  align-items: center;
  justify-content: center;
`;

// Define themes
const darkTeal = '#37474F';      // New primary color
const accent = '#FFCA28';        // Optional secondary (e.g., for highlights or hover)

const lightTheme = {
  background: '#ffffff',
  text: '#222',
  cardBg: '#f5f5f5',
  cardBorder: darkTeal,
  inputBg: '#f9f9f9',
  placeholder: '#888',
  heading: darkTeal,
  buttonBg: darkTeal,
  buttonText: '#fff',
  buttonHover: '#455A64'
};

const darkTheme = {
  background: '#121212',
  text: '#fff',
  cardBg: '#1e1e1e',
  cardBorder: darkTeal,
  inputBg: '#2a2a2a',
  placeholder: '#aaa',
  heading: '#fff',
  buttonBg: darkTeal,
  buttonText: '#fff',
  buttonHover: '#546E7A'
};
