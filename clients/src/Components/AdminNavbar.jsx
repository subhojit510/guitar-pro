import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoLogOut, IoMoon, IoSunny, IoClose, IoMenu } from "react-icons/io5";
import { CiViewList } from "react-icons/ci";
import { PiStudentFill } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";

const Navbar = styled.nav`
  width: 98%;
  background: ${({ theme }) => theme.cardBg};
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
    @media (max-width: 700px) {
    padding: 12px 0px;
  }
`;

const Logo = styled.h3`
   font-weight: 600;
  color: ${({ theme }) => theme.heading};
  display: flex;
  align-items: center;
  height: 40px;
   img {
    height: 115px; 
    width: auto; 
    display: block;
  }
`;

const NavButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap; /* This is key to prevent overflow */

  @media (max-width: 700px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    position: absolute;
    top: 81px;
    left: 0;
    width: 100%;
    background: ${({ theme }) => theme.cardBg};
    padding: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    box-shadow: 0 5px 10px rgba(0,0,0,0.08);
    z-index: 999;
  }
`;


const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.buttonText};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 700px) {
    display: block;
  }
`;

export default function UserNavbar({ toggleTheme, themeMode }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('guitar-app-admin');
    navigate('/admin-login');
  };

  return (
    <Navbar>
      <Logo>
        <video src="/logo.mp4" autoPlay loop muted playsInline width="250" height="250" />
      </Logo>

      <MenuButton onClick={toggleMenu}>
        {menuOpen ? <IoClose /> : <IoMenu />}
      </MenuButton>

      <NavButtons isOpen={menuOpen}>
        <NavButton onClick={() => navigate('/')}>
          <PiStudentFill /> Students Page
        </NavButton>
        <NavButton onClick={() => navigate('/admin')}>
          <CiViewList /> View Pages
        </NavButton>
        <NavButton onClick={() => navigate('/admin/view-links')}>
          <FaPlus /> Add Page
        </NavButton>
        <NavButton onClick={toggleTheme}>
          {themeMode === 'dark' ? <><IoSunny /> Light</> : <><IoMoon /> Dark</>}
        </NavButton>
        <NavButton onClick={handleLogout}>
          <IoLogOut /> Logout
        </NavButton>
      </NavButtons>
    </Navbar>
  );
}
