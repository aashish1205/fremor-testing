import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import TourInner from '../Components/Tour/TourInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Tour() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Popular Tours"
            />
            <TourInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Tour
