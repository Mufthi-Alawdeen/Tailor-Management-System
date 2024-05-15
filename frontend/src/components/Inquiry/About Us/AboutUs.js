import React from 'react';
import Image from '../Img/suits2.jpg'; // Assuming this is the correct path to your image file
import Image1 from '../Img/blazer.jpg'; 
import Image2 from '../Img/user.png'; 
import Header from '../Contact Us/UserHeader';
import Footer from '../Contact Us/UserFooter';


const AboutUsPage = () => {
  return (
<div> 

  <Header/>
    <div style={styles.container}>
        <h1 style={{ textAlign:'center' , fontSize:'44px', fontWeight:'600', marginTop:'20px', marginBottom:'60px'}}>About Us</h1>

      <h1 style={styles.heading}>Who We Are</h1>
      <p style={{fontSize: '16px',
                 lineHeight: '1',
                 color: 'black',
                 marginTop: '-50px',
                 marginLeft: '410px',
                 marginBottom:'50px'}}>

      We are MSR Tailors. Specializing in Elegant Wedding Suits, Exquisite Kurthas for Sale & Rent, Precision Tailoring of Office Attires, Sophisticated Party Wears, and Premium School Uniforms. Experience the Height of Style and Comfort with Our Tailored Creations.
      </p>
      <img src={Image} alt="Suits" style={{ width: '100%', marginTop: '55px', display: 'block', margin: '0 auto' , marginBottom:'60px'}} />

     
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '40px' }}>
        <hr style={{ border: '1px solid #000000', width: '60%' }} />
      </div>



      <img src={Image1} alt="Suits" style={{ width: '30%', marginTop: '40px', marginLeft:'590px' }} />

      <p style={{fontSize: '16px',
                 lineHeight: '1',
                 color: 'black',
                 marginLeft: '10px',
                 marginTop:'-300px',
                 width:'50%'}}>

        
At MSR Tailors, we stand out for three key reasons: personalization, quality assurance, and expert guidance. Each garment is tailored to fit your unique style and body shape, ensuring you look and feel your best. Our meticulous attention to detail and use of premium materials guarantee exceptional and long-lasting pieces. 
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '300px' }}>
        <hr style={{ border: '1px solid #000000', width: '60%' }} />
      </div>
      <h2 style={{marginTop:'100px' , textAlign:'center' }}>Meet Our Team</h2>

    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={styles.imageBox}>
            <img src={Image2} alt="Suits" style={styles.image} />
            <p style={styles.imageName}>MR.Rilwan</p>
         </div>
        <div style={styles.imageBox}>
            <img src={Image2} alt="Suits" style={styles.image} />
            <p style={styles.imageName}>Mr.Aathif</p>
        </div>
        <div style={styles.imageBox}>
            <img src={Image2} alt="Suits" style={styles.image} />
            <p style={styles.imageName}>Mr.Iroshan</p>
        </div> </div>
    </div>
    <Footer/>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    marginBottom:'80px'
  },
  
  heading: {
    fontSize: '35px',
    color: 'black',
    marginBottom: '20px',
  },

  imageBox: {
    textAlign: 'center',
    marginRight: '10px',
    display: 'inline-block', // Set display to inline-block
    justifyContent:'center',
  },

  image: {
    width: '80%',
    marginTop: '40px',
  },
  
  imageName: {
    marginTop: '8px',
    fontSize: '16px',
    color: 'white',
    backgroundColor:'#000000',
    width:'211px',
    height:'31px',
    marginLeft:'26px',
    margin: '20px auto'
    
  },
};

export default AboutUsPage;
