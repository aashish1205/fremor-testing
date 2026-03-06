import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TourDetailsMain from '../Components/Tour/TourDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function TourDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Tour Details"
            />
            <TourDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default TourDetails
