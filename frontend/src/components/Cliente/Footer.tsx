import React from 'react';
import "../../styles/Cliente/Footer.css";
import logo from "../../assets/ebentos-white-logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="e-Bentos logo" className="header-logo" />
          <span className="logo-text">e-Bentos</span>
        </div>
        <div className="footer-copyright">
          <p>© 2025 E-bentos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;