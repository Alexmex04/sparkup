import React from "react";
import { Link } from "react-router-dom";



function Header(){
    return (
        <nav className="footerClass">   
          <h2><Link to="/">Sparkup</Link></h2>
      <ul className="footer-links">
        <li><Link to="/contact">Contacto</Link></li>
        <li><Link to="/FAQ">FAQ</Link></li>

      </ul>
        </nav>
    );
}

export default Header;