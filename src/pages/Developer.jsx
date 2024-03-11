// src/pages/NotificationData.jsx
import React from 'react';
import './Developer.css';
import { FaGithub,FaFacebook,FaInstagram   } from "react-icons/fa";

const Portfolio = () => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="card w-96 bg-white shadow-xl">
          <figure>
            <img className="object-cover h-40 w-full" src="./src/assets/J.jpg" alt="Developer" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-black">
              Kritsanagun C.
              <div className="badge badge-secondary">Developer</div>
            </h2>
            <p>If a dog chews Developer whose Developer does he choose?</p>
            <div className="card-actions justify-end">
              <div className="badge badge-info gap-2 text-black">React</div>
              <div className="badge badge-success gap-2 text-black">Vue</div>
              <div className="badge badge-error gap-2 text-black">Full Stack</div>
            </div>
            <a href="https://github.com/Conversx" className="btn btn-github" target="_blank" rel="noopener noreferrer">
        <FaGithub className="h-6 w-6" />
        My Github
      </a>

      <a href="https://www.facebook.com/profile.php?id=100058305200247&mibextid=ZbWKwL" className="btn btn-facebook" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="h-6 w-6" />
        My Facebook
      </a>

      <a href="https://www.instagram.com/jdxisuki/" className="btn btn-instagram" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="h-6 w-6" />
        My Instagram
      </a>
          </div>
        </div>
        <div className="divider divider-horizontal">AND</div>
        <div className="card w-96 bg-white shadow-xl">
          <figure>
            <img className="object-cover h-40 w-full" src="./src/assets/meen.jpg" alt="Developer" />
          </figure>
          <div className="card-body">
            <h2 className="card-title text-black">
              Punyawee T.
              <div className="badge badge-secondary">UX-UI</div>
            </h2>
            <p>If a dog chews Developer whose Developer does he choose?</p>
            <div className="card-actions justify-end">
              <div className="badge badge-info gap-2 text-black">React</div>
              <div className="badge badge-success gap-2 text-black">Vue</div>
              <div className="badge bg-cyan-600   gap-2 text-black">UX-UI</div>
            </div>
            <a href="https://github.com/your-github" className="btn btn-github" target="_blank" rel="noopener noreferrer">
        <FaGithub className="h-6 w-6" />
        My Github
      </a>

      <a href="https://www.facebook.com/meen.meenmeen.10" className="btn btn-facebook" target="_blank" rel="noopener noreferrer">
        <FaFacebook className="h-6 w-6" />
        My Facebook
      </a>

      <a href="https://www.instagram.com/me_en_06/" className="btn btn-instagram" target="_blank" rel="noopener noreferrer">
        <FaInstagram className="h-6 w-6" />
        My Instagram
      </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
