import React from 'react'
import '../calculatorCss/Header.css'
import headerImage from '../calculatorImage/header.jpg';
import { IoIosContact } from "react-icons/io";
import { Brain, Lightbulb, MessageSquare } from 'lucide-react';
export default function Header() {
 return (
    <header className="startup-header" role="banner">
      <div className="header-container">
        {/* Left Image */}
        <div className="header-image-wrapper">
          <img
            src={headerImage}
            alt="Professional startup support banner"
            className="header-image"
          />
          <div className="header-overlay"></div>
        </div>

        {/* Right Content */}
        <div className="header-content">
          <h1 className="header-title">Launch Smarter, Grow Faster</h1>
          <p className="header-subtitle">
            Get expert help to set up your startup — fast, compliant, and ready to scale.
          </p>
          <div className="header-cta" aria-label="Get started with startup setup services">
          <MessageSquare size={25} />
            Talk to an Expert
          </div>
        </div>
      </div>
    </header>
  );
}
