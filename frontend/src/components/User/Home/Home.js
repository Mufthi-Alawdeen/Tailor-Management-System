import React, { useEffect } from "react";
import styles from './Home.module.css'; // Importing CSS module
import bgImage from './img/bg.png'; // Importing background image
import Header from "../../Inquiry/Contact Us/UserHeader";
import img1 from './img/image1.jpg'
import img2 from './img/image2.jpg'
import img3 from './img/image3.jpg'
import UserFooter from "../../Inquiry/Contact Us/UserFooter";

const HomePage = () => {
  useEffect(() => {
    const valueDisplays = document.querySelectorAll(".num");
    const interval = 4000;

    valueDisplays.forEach((valueDisplay) => {
      let startValue = 0;
      let endValue = parseInt(valueDisplay.getAttribute("data-val"));
      let duration = Math.floor(interval / endValue);
      let counter = setInterval(() => {
        startValue += 1;
        if (startValue <= endValue) {
          valueDisplay.textContent = startValue;
        }
        if (startValue >= endValue) {
          clearInterval(counter);
          valueDisplay.textContent = endValue + "+";
        }
      }, duration);
    });

    const words = ['Your Style', 'Your Fit', 'Your Way'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const word = words[wordIndex];
      const typingEffect = document.getElementById('typing-effect');

      if (isDeleting) {
        typingEffect.textContent = word.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEffect.textContent = word.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === word.length) {
        isDeleting = true;
        setTimeout(type, 3000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        if (wordIndex === words.length) {
          wordIndex = 0;
        }
        setTimeout(type, 500);
      } else {
        setTimeout(type, 100);
      }
    }

    type();
  }, []);

  return (
    <div> 
      <Header/>
      <div className={styles.all} style={{backgroundImage: `url(${bgImage})`}}>
        <button className={styles.contact} href="#con">Customize Now</button>

        <div className={styles.elements}>
          <p className={styles.welcome}>Tailored to<br /><b><span style={{color: '#bf1e2d'}}>Perfection</span></b><br /></p>
          
          <div id="typing-container" className={styles.typingContainer}>
            <span id="typing-effect" className={styles.typingEffect}></span>
            <p id="typing-placeholder" className={styles.typingPlaceholder}>&nbsp;</p>
          </div>
        </div>    

        <div className={styles.wrapper}>
          <div className={styles.container}>
            {/* <i className="fas fa-utensils"></i> */}
            <span className="num" style={{fontWeight:'bold', fontSize:'3vw'}} data-val="500">00</span>
            <span className="text">Users</span>
          </div>
          <div className={styles.container}>
            {/* <i className="fas fa-smile-beam"></i> */}
            <span className="num" style={{fontWeight:'bold', fontSize:'3vw'}} data-val="35">000</span>
            <span className="text">Collections</span>
          </div>
          <div className={styles.container}>
            {/* <i className="fas fa-list"></i> */}
            <span className="num" style={{fontWeight:'bold', fontSize:'3vw'}} data-val="100">000</span>
            <span className="text">Designs</span>
          </div>
        </div>
      </div>

      
      <div className="container col-md-9">
      <h2 style={{textAlign: 'center', marginTop: '80px', marginBottom: '60px', fontWeight: 'bold'}}>What Makes Us <span style={{color: '#bf1e2d'}}>Unique</span> ?</h2>

        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.imageContainer}>
              <img src={img1} className={styles.image} alt="Image 1" />
              <div className={styles.imageText}>Persanization</div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.imageContainer}>
              <img src={img2} className={styles.image} alt="Image 2" />
              <div className={styles.imageText}>Expert Guidence</div>
            </div>
          </div>
          <div className={styles.column}>
            <div className={styles.imageContainer}>
              <img src={img3} className={styles.image} alt="Image 3" />
              <div className={styles.imageText}>Quality Asurance</div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{textAlign: 'center', marginTop: '80px', marginBottom: '60px', fontWeight: 'bold'}}>Location</h2>
      <div className="container col-md-9">
        <iframe src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d126639.26652820158!2d80.55401136250686!3d7.300174031682485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3ae367dfa9c4d517%3A0xdfe8811e6aaa6599!2s271%20A9%2C%20Kandy%2020000!3m2!1d7.3001815!2d80.6364133!5e0!3m2!1sen!2slk!4v1715620024463!5m2!1sen!2slk" width="100%" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>

      <br/><br/>
    <UserFooter/>

    </div>
  );
};

export default HomePage;
