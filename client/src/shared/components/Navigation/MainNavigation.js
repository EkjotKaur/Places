import React, { useState } from 'react';

import MainHeader from './MainHeader';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElement/Backdrop';
import './MainNavigation.css';




const MainNavigation = (props) => {
  const [isDraweOpen, setIsDrawerOpen] = useState(false);

  const openDrawerHandler = () =>{
    setIsDrawerOpen(true);
  }
  const closeDrawerHandler = () =>{
    setIsDrawerOpen(false);
  }

  return(
    <React.Fragment>
      {isDraweOpen && <Backdrop onClick={closeDrawerHandler}/>}
      <SideDrawer show={isDraweOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks/>
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
          <span/>
          <span/>
          <span/>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks/>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
 
};

export default MainNavigation;