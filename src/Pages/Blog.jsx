import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import BlogInner from '../Components/Blog/BlogInner'
import ScrollToTop from '../Components/ScrollToTop'
import FooterFour from '../Components/Footer/FooterFour'

function Blog() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Blog Lists View"
            />
            <BlogInner />
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Blog
