import React from 'react';
import { NavLink } from 'react-router-dom';
import "./CartMenu.css";

const CartMenu = () => {
  return (
    <div className="container" id="cartmenucont">
      <nav className="navbar navbar-expand-lg navbar-light">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse d-flex justify-content-center" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink exact to="/order/cart" className="nav-item nav-link" activeClassName="selected-link">Buy</NavLink>
            <NavLink exact to="/rentCart" className="nav-item nav-link" activeClassName="selected-link">Rent</NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CartMenu;
