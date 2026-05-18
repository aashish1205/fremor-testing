import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ActivitiesDetailsMain from '../Components/Activities/ActivitiesDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ActivitiesDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Activities Details"
            />
            <ActivitiesDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default ActivitiesDetails
