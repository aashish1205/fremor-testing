import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import MobileMenu from './MobileMenu';
import NiceSelect from './NiceSelect';
import NavbarMenu from './NavbarMenu';

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

      const handleOpenLogin = () => {
         setIsLoginFormOpen(true);
      };

      window.addEventListener("scroll", handleScroll);
      window.addEventListener('open-login-modal', handleOpenLogin);
      return () => {
         window.removeEventListener("scroll", handleScroll);
         window.removeEventListener('open-login-modal', handleOpenLogin);
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
                              <NavbarMenu />
                           </nav>
                           <button
                              type="button"
                              className="th-menu-toggle d-block d-xl-none"
                              onClick={() => setIsMobileMenuOpen(true)}
                           >
                              <i className="far fa-bars" />
                           </button>
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
         <MobileMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            onLoginClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoginFormOpen(true);
            }}
         />
         <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
      </>
   )
}

export default HeaderFour;
