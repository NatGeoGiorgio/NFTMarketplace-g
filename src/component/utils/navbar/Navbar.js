import React, { useState } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import Dropdown from './Dropdown';
import { OnboardingButton } from "../metamaskButton";

function Navbar() {
  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const onMouseEnter = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(true);
    }
  };

  const onMouseLeave = () => {
    if (window.innerWidth < 960) {
      setDropdown(false);
    } else {
      setDropdown(false);
    }
  };

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
          CNSTY
          <i class='fab fa-firstdraft' />
        </Link>
        <div className='menu-icon' onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
            <Link to='/publish' className='nav-links' onClick={closeMobileMenu}>
              Publish
            </Link>
          </li>
          <li
            className='nav-item'
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <Link
              to='/web3info'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              web3info <i className='fas fa-caret-down' />
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/MrktPlace'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              MarketPlace
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='/myCoin'
              className='nav-links'
              onClick={closeMobileMenu}
            >
              My Coins
            </Link>
          </li>
          <li className='nav-item'>
          < OnboardingButton/>
          </li>
        </ul>

      </nav>
    </>
  );
}

export default Navbar;