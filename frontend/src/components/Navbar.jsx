import React from 'react';
import '../styles/Navbar.css';
import { useState } from 'react';
import { Navbar} from 'react-bootstrap';
import { IoHomeSharp } from 'react-icons/io5';
import { BiArrowToRight, BiLogOut } from 'react-icons/bi';
import {TbReportMedical} from 'react-icons/tb';
import {MdAccountCircle} from 'react-icons/md';
import Cookies from 'js-cookie';

function MyNavbar(){

    const [expanded, setExpanded] = useState(false);
    
    function toggleNavbar() {
        setExpanded(expanded ? false : "expanded");
    }

    function removeToken(){
        Cookies.remove('jwtToken');
    }

    return (
        <div>
            <div className="navbar">
                <div className="container" onClick={toggleNavbar}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </div>
                <a href="/"><img src={process.env.PUBLIC_URL + "logo.png"} class="logoNav" alt="logo" /></a>
            </div>
            <div className={`menu ${expanded ? 'expanded' : ''}`}>
                <Navbar.Collapse class = "displayFlex">
                            
                            <a className="nav-link" href={toggleNavbar} ><BiArrowToRight className="arrow" onClick={toggleNavbar} size={30}/></a>
                            <a className="nav-link" href="/"><IoHomeSharp/> Home</a>
                            <a className="nav-link" href="/allocation"><TbReportMedical/> Allocation</a>
                            <a className="nav-link" href="/account"><MdAccountCircle/> Account</a>
                            <a className="nav-link" href="/login" onClick={removeToken}><BiLogOut/> Logout</a>
                            
                           
                </Navbar.Collapse>
                
                <a href="/"><img src={process.env.PUBLIC_URL + "logo.png"} class="logoNav" alt="logo" /></a>
            </div>
          
        </div>

      );
}

export default MyNavbar;