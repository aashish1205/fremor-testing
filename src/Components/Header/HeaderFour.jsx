import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import MobileMenu from './MobileMenu';
import NiceSelect from './NiceSelect';

function HeaderFour() {
   const languageOptions = [
      { value: "language", label: "Language" },
      { value: "CNY", label: "CNY" },
      { value: "EUR", label: "EUR" },
      { value: "AUD", label: "AUD" },
   ];
   const [isSticky, setIsSticky] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 500) {
            setIsSticky(true);
         } else {
            setIsSticky(false);
         }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);
   return (
      <>
         <header className="th-header header-layout1 header-layout4">
            <div className="header-top">
               <div className="container th-container">
                  <div className="row justify-content-center justify-content-xl-between align-items-center">
                     <div className="col-auto d-none d-md-block">
                        <div className="header-links">
                           <ul>
                              <li className="d-none d-xl-inline-block">
                                 <i className="fa-sharp fa-regular  fa-location-dot" />
                                 <span>45 New Eskaton Road, Austria</span>
                              </li>
                              <li className="d-none d-xl-inline-block">
                                 <i className="fa-regular fa-clock" />
                                 <span>Sun to Friday: 8.00 am - 7.00 pm</span>
                              </li>
                           </ul>
                        </div>
                     </div>
                     <div className="col-auto">
                        <div className="header-right">
                           <div className="currency-menu">
                              <NiceSelect options={languageOptions} defaultValue="Language" />
                           </div>
                           <div className="header-links">
                              <ul>
                                 <li className="d-none d-md-inline-block">
                                    <Link to="/faq">FAQ</Link>
                                 </li>
                                 <li className="d-none d-md-inline-block">
                                    <Link to="/contact">Support</Link>
                                 </li>
                                 <li>
                                    <button
                                       type="button"
                                       onClick={() => setIsLoginFormOpen(true)}
                                    >
                                       Sign In / Register
                                       <i className="fa-regular fa-user" />
                                    </button>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
               {/* Main Menu Area */}
               <div className="menu-area">
                  <div className="container th-container">
                     <div className="row align-items-center justify-content-between">
                        <div className="col-auto">
                           <div className="header-logo">
                              <Link to="/">
                                 <img src="/assets/img/logo4.svg" alt="Tourm" />
                              </Link>
                           </div>
                        </div>
                        <div className="col-auto">
                           <nav className="main-menu d-none d-xl-inline-block">
                              <ul>
                                 <li className="menu-item-has-children mega-menu-wrap">
                                    <Link className="active" to="/">
                                       Home
                                    </Link>
                                    <ul className="mega-menu mega-menu-content">
                                       <li>
                                          <div className="container">
                                             <div className="row gy-4">
                                                <div className="col-lg-3">
                                                   <div className="mega-menu-box">
                                                      <div className="mega-menu-img">
                                                         <img
                                                            src="/assets/img/pages/home-travel.jpg"
                                                            alt="Home One"
                                                         />
                                                         <div className="btn-wrap">
                                                            <Link

                                                               to="/"
                                                               className="th-btn"
                                                            >
                                                               View Demo
                                                            </Link>
                                                         </div>
                                                      </div>
                                                      <h3 className="mega-menu-title">
                                                         <Link to="/">
                                                            <span>01.</span>Home Travel
                                                         </Link>
                                                      </h3>
                                                   </div>
                                                </div>
                                                <div className="col-lg-3">
                                                   <div className="mega-menu-box">
                                                      <div className="mega-menu-img">
                                                         <img
                                                            src="/assets/img/pages/home-tour.jpg"
                                                            alt="Home Two"
                                                         />
                                                         <div className="btn-wrap">
                                                            <Link

                                                               to="/home-tour"
                                                               className="th-btn "
                                                            >
                                                               View Demo
                                                            </Link>
                                                         </div>
                                                      </div>
                                                      <h3 className="mega-menu-title">
                                                         <Link to="/home-tour">
                                                            <span>02.</span>Home Tour
                                                         </Link>
                                                      </h3>
                                                   </div>
                                                </div>
                                                <div className="col-lg-3">
                                                   <div className="mega-menu-box">
                                                      <div className="mega-menu-img">
                                                         <img
                                                            src="/assets/img/pages/home-agency.jpg"
                                                            alt="Home Three"
                                                         />
                                                         <div className="btn-wrap">
                                                            <Link

                                                               to="/home-agency"
                                                               className="th-btn "
                                                            >
                                                               View Demo
                                                            </Link>
                                                         </div>
                                                      </div>
                                                      <h3 className="mega-menu-title">
                                                         <Link to="/home-agency">
                                                            <span>03.</span>Home Agency
                                                         </Link>
                                                      </h3>
                                                   </div>
                                                </div>
                                                <div className="col-lg-3">
                                                   <div className="mega-menu-box">
                                                      <div className="mega-menu-img">
                                                         <img
                                                            src="/assets/img/pages/home-yacht.jpg"
                                                            alt="Home Four"
                                                         />
                                                         <div className="btn-wrap">
                                                            <Link

                                                               to="/home-yacht"
                                                               className="th-btn "
                                                            >
                                                               View Demo
                                                            </Link>
                                                         </div>
                                                      </div>
                                                      <h3 className="mega-menu-title">
                                                         <Link to="/home-yacht">
                                                            <span>04.</span>Home Yacht
                                                         </Link>
                                                      </h3>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="/about">About Us</Link>
                                 </li>
                                 <li className="menu-item-has-children">
                                    <Link to="#">Destination</Link>
                                    <ul className="sub-menu">
                                       <li>
                                          <Link to="/destination">Destination</Link>
                                       </li>
                                       <li>
                                          <Link to="/destination/1">Destination Details</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li className="menu-item-has-children">
                                    <Link to="#">Service</Link>
                                    <ul className="sub-menu">
                                       <li>
                                          <Link to="/service">Services</Link>
                                       </li>
                                       <li>
                                          <Link to="/service/1">Service Details</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li className="menu-item-has-children">
                                    <Link to="#">Activities</Link>
                                    <ul className="sub-menu">
                                       <li>
                                          <Link to="/activities">activities</Link>
                                       </li>
                                       <li>
                                          <Link to="/activities-details">activities Details</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li className="menu-item-has-children">
                                    <Link to="#">Pages</Link>
                                    <ul className="sub-menu">
                                       <li className="menu-item-has-children">
                                          <Link to="#">Shop</Link>
                                          <ul className="sub-menu">
                                             <li>
                                                <Link to="/shop">Shop</Link>
                                             </li>
                                             <li>
                                                <Link to="/shop/1">Shop Details</Link>
                                             </li>
                                             <li>
                                                <Link to="/cart">Cart Page</Link>
                                             </li>
                                             <li>
                                                <Link to="/checkout">Checkout</Link>
                                             </li>
                                             <li>
                                                <Link to="/wishlist">Wishlist</Link>
                                             </li>
                                          </ul>
                                       </li>
                                       <li>
                                          <Link to="/gallery">Gallery</Link>
                                       </li>
                                       <li>
                                          <Link to="/tour">Our Tour</Link>
                                       </li>
                                       <li>
                                          <Link to="/tour-details">Tour Details</Link>
                                       </li>
                                       <li>
                                          <Link to="/resort">Resort page</Link>
                                       </li>
                                       <li>
                                          <Link to="/resort/1">Resort Details</Link>
                                       </li>
                                       <li>
                                          <Link to="/tour-details">Tour Details</Link>
                                       </li>
                                       <li>
                                          <Link to="/tour-guide">Tour Guider</Link>
                                       </li>
                                       <li>
                                          <Link to="/tour-guide/1">Tour Guider Details</Link>
                                       </li>
                                       <li>
                                          <Link to="/faq">Faq Page</Link>
                                       </li>
                                       <li>
                                          <Link to="/price">Price Package</Link>
                                       </li>
                                       <li>
                                          <Link to="/error">Error Page</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li className="menu-item-has-children">
                                    <Link to="#">Blog</Link>
                                    <ul className="sub-menu">
                                       <li>
                                          <Link to="/blog">Blog</Link>
                                       </li>
                                       <li>
                                          <Link to="/blog/1">Blog Details</Link>
                                       </li>
                                    </ul>
                                 </li>
                                 <li>
                                    <Link to="/contact">Contact us</Link>
                                 </li>
                              </ul>
                           </nav>
                           <button
                              type="button"
                              className="th-menu-toggle d-block d-xl-none"
                              onClick={() => setIsMobileMenuOpen(true)}
                           >
                              <i className="far fa-bars" />
                           </button>
                        </div>
                        <div className="col-auto d-none d-xl-block">
                           <div className="header-button">
                              <Link to="/contact" className="th-btn style1 th-icon">
                                 Book Now
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="logo-bg bg-mask"
                     style={{
                        WebkitMaskImage: "url(/assets/img/logo_bg_mask.png)",
                        maskImage: "url(/assets/img/logo_bg_mask.png)"
                     }} />
                  <div
                     className="menu-right-bg "
                     style={{
                        WebkitMaskImage: "url(/assets/img/menu_bg_mask.png)",
                        maskImage: "url(/assets/img/menu_bg_mask.png)",
                        WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat'
                     }}
                  />
               </div>
            </div>
         </header>
         <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
         <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
      </>
   )
}

export default HeaderFour
