import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
      <p>&copy; {currentYear} Ariel Vernaza. All rights reserved.</p>
    </div>
  );
};

export default Footer;