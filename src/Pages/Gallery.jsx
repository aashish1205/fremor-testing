import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import GalleryInner from '../Components/Gallery/GalleryInner'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'

function Gallery() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Gallery"
            />
            <GalleryInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Gallery
