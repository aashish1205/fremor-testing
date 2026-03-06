import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ResortInner from '../Components/Resort/ResortInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Resort() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Resort"
            />
            <ResortInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Resort
