import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import WishlistInner from '../Components/Shop/WishlistInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Wishlist() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Wishlist"
            />
            <WishlistInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Wishlist
