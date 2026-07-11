import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-badge">AV</span>
          <div>
            <div className="footer-name">Ariel Vernaza</div>
            <div className="footer-role">game designer · RocketRide maintainer</div>
          </div>
        </div>
        <div className="footer-social">
          <a href="https://github.com/dsapandora" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://linkedin.com/in/dsapandora" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="mailto:ariel@lazyracoon.tech" aria-label="Email"><FaEnvelope /></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {year} Ariel Vernaza</span>
        <span className="footer-tag">Made with pixels &amp; agents · press START</span>
      </div>
    </footer>
  );
};

export default Footer;
