import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={"navbar" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <a href="#top" className="brand" onClick={close}>
          <span className="brand-badge">AV</span>
          <span className="brand-name">Ariel Vernaza<span className="blink">_</span></span>
        </a>

        <button className="nav-toggle" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={"nav-menu" + (open ? " open" : "")}>
          <a href="#play" className="nav-link" onClick={close}>Play</a>
          <a href="#work" className="nav-link" onClick={close}>Work</a>
          <a href="#experience" className="nav-link" onClick={close}>Experience</a>
          <a href="#about" className="nav-link" onClick={close}>About</a>
          <a className="nav-cta" href="#work" onClick={close}>See the magic ✦</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
