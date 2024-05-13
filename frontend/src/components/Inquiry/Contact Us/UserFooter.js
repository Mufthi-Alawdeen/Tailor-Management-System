import React from 'react';
import logo from '../Img/MSR.png';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

function Footer() {
  const footerStyle = {
    backgroundColor: '#f8f9fa',
    color: '#000000',
    padding: '45px 0',
  };

  const sectionStyle = {
    margin: '0',
    padding: '0',
    listStyle: 'none',
  };

  const linkStyle = {
    color: '#c40404',
    textDecoration: 'none',
  };

  const flexContainer = {
    display: 'flex',
    gap: '20px', // Added gap property here
    marginBottom:'-15px'
  };

  const listItemStyle = {
    marginBottom: '10px', // Added margin bottom here
    fontWeight:'490'
  };

  return (
    <footer style={footerStyle}>
        <div style={{ maxWidth: '1170px', margin: '0 auto' }}>
            <div style={flexContainer}>
                    <div style={{ display: 'grid', fontSize: '15px' }}> 
                <img src={logo} alt="Logo" style={{ width: '68px', height: '50px', marginLeft: '10px', marginBottom:'10px' }} />
                <span style={{ maxWidth: '400px', display: 'block', margin: '0 auto',fontWeight:'500' }}>Specializing in Elegant Wedding Suits, Exquisite Kurthas for Sale & Rent, Precision Tailoring of Office Attires, Sophisticated Party Wears, and Premium School Uniforms. Experience the Height of Style and Comfort with Our Tailored Creations.</span>
        </div>

          {/* Products Section */}
          <div style={{ flex: '1', marginLeft: '80px' }}>
            <h5 style={{marginBottom:'15px'}}>Products</h5>
            <ul style={sectionStyle}>
              <li style={listItemStyle}><a style={linkStyle} href="#">Customize</a></li>
              <li style={listItemStyle}><a style={linkStyle} href="#">Rental</a></li>
              <li style={listItemStyle}><a style={linkStyle} href="#">Accessories</a></li>
            </ul>
          </div>
          {/* Company Section */}
          <div style={{ flex: '1', marginLeft: '50px' }}>
            <h5 style={{marginBottom:'15px'}}>Company</h5>
            <ul style={sectionStyle}>
              <li style={listItemStyle}><a style={linkStyle} href="/contactus">Contact Us</a></li>
              <li style={listItemStyle}><a style={linkStyle} href="/aboutus">About Us</a></li> 
            </ul>
          </div>
          {/* Follow Us Section */}
          <div style={{ flex: '1', marginLeft: '50px' }}>
            <h5 style={{marginBottom:'10px'}}>Follow Us</h5>
            <ul style={{ ...sectionStyle, display: 'flex', gap: '15px', fontSize: '25px' }}>
              <li><a style={{color:'black', marginLeft:'8px'}} href="https://www.facebook.com/msrtailors/"><FaFacebook /></a></li>
              <li><a style={{color:'black'}} href="https://www.instagram.com/msr_tailors/"><FaInstagram /></a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
