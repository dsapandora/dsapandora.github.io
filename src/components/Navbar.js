import React, {useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Navbar.css"
import {FaBars, FaTimes} from "react-icons/fa"
import {IconContext} from "react-icons/lib"
import { Image } from "react-bootstrap";
import Typography from '@mui/material/Typography';

function Navbar() {
    const [click, setClick] = useState(false);
    const [tripleClickCount, setTripleClickCount] = useState(0);
  
    const handleClick = () => {
      setClick(!click);
  
      if (tripleClickCount === 2) {
        document.body.style.backgroundColor = "yellow";
      } else {
        setTripleClickCount(tripleClickCount + 1);
      }
    };
  
    const closeMobileMenu = () => {
      setClick(false);
      setTripleClickCount(0);
    };

    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);

    useEffect(() => {
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 960);
      };
  
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    return(
        <>
        <IconContext.Provider value={{color: "#fff"}}>
        <nav className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo" >
                <div className="logo-container">
                    <Image src="/lazyracoon_logo.png" className="navbarImageLogo"/>
                    <Typography variant={isSmallScreen ? "h5" : "h4"} className="sticky-typography">Lazyracoon</Typography>
                </div>
                </Link>
                {/* Icons open and close navBar */}
                <div className="menu-icon" onClick= {handleClick}>
                    {click ? <FaTimes /> : <FaBars />}
                </div>

                {/* To show active link color */}
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => 
                        "nav-links" + (isActive ? " activated" : "")}
                        onClick={closeMobileMenu}
                        >
                            Home
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink to="/Resume" className={({ isActive }) => 
                        "nav-links" + (isActive ? " activated" : "")}
                        onClick={closeMobileMenu}
                        >
                            Resume
                        </NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink to="/About" className={({ isActive }) => 
                        "nav-links" + (isActive ? " activated" : "")}
                        onClick={closeMobileMenu}
                        >
                            About
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/Contact" className={({ isActive }) => 
                        "nav-links" + (isActive ? " activated" : "")}
                        onClick={closeMobileMenu}
                        >
                            Contact
                        </NavLink>
                    </li>
                   
                </ul>
            </div>
        </nav>
        </IconContext.Provider>
        </>
    )
}

export default Navbar;