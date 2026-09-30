import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getCartItemCount, token, customer, logout, searchQuery, setSearchQuery } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="logo" className="logo" /></Link>

      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
        <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <div className="navbar-search">
          <img src={assets.search_icon} alt="search" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => navigate('/menu')}
            placeholder="Search dishes"
            aria-label="Search dishes"
          />
        </div>

        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="cart" /></Link>
          <div className={getCartItemCount() === 0 ? "" : "dot"}></div>
        </div>

        {!token ? (
          <div className='navbar-auth-links'><Link to='/login'>Sign in</Link><Link to='/register'>Create account</Link></div>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="profile" />
            <ul className='navbar-profile-dropdwn'>
              <li onClick={()=>navigate('/profile')}><img src={assets.profile_icon} alt="profile" /><p>{customer?.name || 'Profile'}</p></li>
              <li onClick={()=>navigate('/myorder')}><img src={assets.bag_icon} alt="orders" /><p>Orders</p></li>
              <hr />
              <li onClick={() => { logout(); navigate('/'); }}><img src={assets.bag_icon} alt="logout" /><p>Logout</p></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
