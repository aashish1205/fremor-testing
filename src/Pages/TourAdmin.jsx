import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import TourAdminPanel from '../Components/Tour/TourAdminPanel'

function TourAdmin() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb title="Admin - Tours" />
            <section className="space">
                <div className="container">
                    <TourAdminPanel />
                </div>
            </section>
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default TourAdmin
