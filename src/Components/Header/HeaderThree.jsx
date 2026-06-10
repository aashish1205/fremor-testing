import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SideMenu from './SideMenu';
import MobileMenu from './MobileMenu';
import LoginForm from './LoginForm';
import NavbarMenu from './NavbarMenu';

function HeaderThree() {
    const [isSticky, setIsSticky] = useState(false);
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
            <header className="th-header header-layout3 header-absolute">
                <div className={`sticky-wrapper ${isSticky ? "sticky" : ""}`}>
                    {/* Main Menu Area */}
                    <div className="menu-area">
                        <div className="container">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto">
                                    <nav className="main-menu d-none d-xl-block">
                                        <NavbarMenu split="left" />
                                    </nav>
                                </div>
                                <div className="col-auto">
                                    <div className="header-logo">
                                        <Link to="/">
                                            <img src="/assets/img/logo-white2.svg" alt="Tourm" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <nav className="main-menu d-none d-xl-block">
                                        <NavbarMenu split="right" />
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
                        <div className="header-right-button">
                            <button
                                type="button"
                                className="simple-btn sideMenuToggler"
                                onClick={() => setIsSideMenuOpen(true)}
                            >
                                <img src="/assets/img/icon/menu.svg" alt="" />
                            </button>
                        </div>
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
             <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
             <LoginForm isOpen={isLoginFormOpen} onClose={() => setIsLoginFormOpen(false)} />
        </>
    )
}

export default HeaderThree
