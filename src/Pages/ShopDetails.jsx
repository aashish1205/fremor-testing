import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import ShopDetailsMain from '../Components/Shop/ShopDetailsMain'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function ShopDetails() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Shop Details'
            />
            <ShopDetailsMain />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default ShopDetails
