import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import CruiseAdminPanel from '../Components/Cruise/CruiseAdminPanel'

function CruiseAdmin() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Admin - Cruises"
            />
            <section className="space">
                <div className="container">
                    <CruiseAdminPanel />
                </div>
            </section>
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default CruiseAdmin
