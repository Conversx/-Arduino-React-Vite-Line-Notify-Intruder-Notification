import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Developer';
import About from './pages/About';
import { BiChevronsDown, BiChevronsUp } from 'react-icons/bi';
import { MdFlashOn, MdFlashOff } from "react-icons/md";
import axios from 'axios';

export default function App() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(true);
  const [ledStatus, setLedStatus] = useState(0);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleFlash = () => {
    const newFlashState = !isFlashOn;
    setIsFlashOn(newFlashState);
    switchClicked(newFlashState ? 0 : 1); // 0 for 'CLOSE', 1 for 'OPEN'
  };

  const switchClicked = (paramValue) => {
    let _payload = '';
    if (paramValue === 0) {
      _payload = 'CLOSE';
      setLedStatus(1);
    } else {
      _payload = 'OPEN';
      setLedStatus(0);
    }
    publishToNetpie(_payload);
  };

  const publishToNetpie = (payload) => {
    let target = "topic=lab_ict_kps%2Fcommand";
    let apiurl = "http://api.netpie.io/v2/device/message" + "?" + target;
    let headers = {
      "Content-Type": "text/plain",
      "Authorization": "Device c1b40ba4-ffcd-4c20-aea0-56bb155144f8:KNj5zck4h8WASo8xaJuF56mrgqmDXWMf"
    };
    let data = payload;

    axios.put(apiurl, data, { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Router>
      <div className="container mx-auto px-4">
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
                onClick={toggleDropdown}
              >
                {isDropdownOpen ? <BiChevronsUp size={24} /> : <BiChevronsDown size={24} />}
              </div>
              {isDropdownOpen && (
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li><Link to="/">Dashboard</Link></li>
                  <li><Link to="/portfolio">Portfolio</Link></li>
                </ul>
              )}
            </div>
          </div>
          <div className="navbar-center">
            <Link to="/" className="btn btn-ghost text-xl">Intruder Notification</Link>
          </div>
          <div className="navbar-end">
            <button className="btn btn-ghost btn-circle" onClick={toggleFlash}>
              {isFlashOn ? <MdFlashOff size={24} /> : <MdFlashOn size={24} />}
            </button>
          </div>
        </div>
      </div>
  
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}
