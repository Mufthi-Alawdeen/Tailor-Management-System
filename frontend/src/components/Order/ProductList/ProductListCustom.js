import Header from '../../Inquiry/Contact Us/UserHeader'; // Import your Header component
import { Link } from 'react-router-dom';
import './ProductCustom.css'; // Import CSS for styling
import suitImage from '../../../img/suit1.jpg';
import shirtImage from '../../../img/shirt1.jpg';
import trouserImage from '../../../img/trouser1.jpg';

const ProductListCustom = () => {

    return (
        <div>
            <Header />

            <div className="container mt-4">
            
                {/* Horizontal tiles */}
                <div className="col mt-4" style={{ margin: '30px', marginLeft: '100px', marginRight: '100px' }}>
                    <Link to="/productlistsuit/buyproducts" style={{ textDecoration: 'none' }}>
                    <div className="row-md-4">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-4 order-md-2">
                                    <img src={suitImage} className="card-img" alt="Suit" style={{ height: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8 order-md-1">
                                    <div className="card-body">
                                        <h5 className="card-title">Suits</h5>
                                        <p className="card-text">Elevate your style with a meticulously tailored <br /> custom suit designed to fit you perfectly.</p>
                                        <Link to="/productlistsuit/buyproducts" className="shop-btn">Shop</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                    <Link to="/productlistshirt/buyproducts" style={{ textDecoration: 'none' }}>
                    <div className="row-md-4">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-4">
                                    <img src={shirtImage} className="card-img" alt="Shirt" style={{ height: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body mid">
                                        <h5 className="card-title">Shirts</h5>
                                        <p className="card-text">Experience the epitome of sartorial elegance with our <br /> custom shirts tailored to your exact measurements and preferences.</p>
                                        <Link to="/productlistshirt/buyproducts" className="shop-btn">Shop</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                    <Link to="/productlisttrouser/buyproducts" style={{ textDecoration: 'none' }}>
                    <div className="row-md-4">
                        <div className="card">
                            <div className="row no-gutters">
                                <div className="col-md-4 order-md-2">
                                    <img src={trouserImage} className="card-img" alt="Trouser" style={{ height: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8 order-md-1">
                                    <div className="card-body">
                                        <h5 className="card-title">Trousers</h5>
                                        <p className="card-text">Elevate your wardrobe with our custom trousers <br /> meticulously crafted to fit you flawlessly.</p>
                                        <Link to="/productlisttrouser/buyproducts" className="shop-btn">Shop</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductListCustom;
