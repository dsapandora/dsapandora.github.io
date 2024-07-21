import React from 'react'


function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer">
        <h3>&copy; {currentYear} LazyRacoon LLC. All rights reserved.</h3>
    </div>
  )
}

export default Footer