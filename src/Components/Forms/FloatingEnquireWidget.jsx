import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FloatingEnquireWidget.css';
import GlobalEnquirePopupForm from './GlobalEnquirePopupForm';

export default function FloatingEnquireWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Hide on cruise pages
  if (location.pathname.includes('/cruise')) return null;

  // Don't render if user explicitly closed it
  if (!isVisible) return null;

  return (
    <>
      <div className="floating-widget-wrapper">
        <div className="floating-widget-content">
          <button className="floating-widget-close" onClick={() => setIsVisible(false)} aria-label="Close widget">
            <i className="fa-solid fa-times"></i>
          </button>
          <div className="floating-widget-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 5.91 2 10.74C2 13.4 3.39 15.78 5.56 17.33C5.52 18.06 5.16 19.8 3.5 21.5C3.5 21.5 6.79 21.5 9.46 19.64C10.28 19.81 11.13 19.9 12 19.9C17.52 19.9 22 15.99 22 11.16C22 6.33 17.52 2 12 2ZM11 16H13V14H11V16ZM12 5C13.66 5 15 6.34 15 8C15 10 13 10.25 13 12H11C11 9.25 13 9 13 8C13 7.45 12.55 7 12 7C11.45 7 11 7.45 11 8H9C9 6.34 10.34 5 12 5Z"/>
            </svg>
          </div>
          <div className="floating-widget-text">
            <h5 className="floating-widget-title">Planning your destination?</h5>
            <p className="floating-widget-desc">Our destination experts will help you explore the best options</p>
            <button className="floating-widget-btn" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-phone-volume"></i> REQUEST A CALLBACK
            </button>
          </div>
        </div>
      </div>

      <GlobalEnquirePopupForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
