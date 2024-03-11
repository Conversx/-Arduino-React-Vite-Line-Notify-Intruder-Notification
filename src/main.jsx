import React from 'react';
import ReactDOM from 'react-dom/client'; // เปลี่ยนที่นี่

import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <>
    <video autoPlay muted loop id="background-video">
      <source src="./src/bbg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </>,
);
