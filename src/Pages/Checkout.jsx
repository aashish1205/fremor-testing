import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import CheckoutInner from '../Components/Shop/CheckoutInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Checkout() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title='Checkout'
            />
            <CheckoutInner />
            <FooterFour/>
            <ScrollToTop />
        </>
    )
}

export default Checkout
