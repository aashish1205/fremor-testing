import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesInner from '../Components/Activities/ActivitiesInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Activities() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Activities"
            />
            <ActivitiesInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Activities
