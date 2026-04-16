import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import DestinationAdminPanel from '../Components/Destination/DestinationAdminPanel'

function DestinationAdmin() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Admin - Destinations"
            />
            <section className="space">
                <div className="container">
                    <DestinationAdminPanel />
                </div>
            </section>
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default DestinationAdmin
