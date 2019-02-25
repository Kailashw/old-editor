import React from 'react'
const style = {
  width: "100%",
  height: "60px",
  marginTop: "5%",
  backgroundColor: "#f5f5f5"
}
const Footer = () => {
  return (
    <footer className="footer" style={style}>
      <p className="col-lg-offset-3" style={{paddingTop: "15px"}}>Created by <a href="http://www.github.com/kailashw">KAILAS WALLDODDI</a> </p>
    </footer>
  )
}

export default Footer;