import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ResortDetailsMain from '../Components/Resort/ResortDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ResortDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Resort Details"
            />
            <ResortDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default ResortDetails
