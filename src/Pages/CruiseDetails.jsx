import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import CruiseDetailsMain from '../Components/Cruise/CruiseDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function CruiseDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Cruise Details"
            />
            <CruiseDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default CruiseDetails
