import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'
import Breadcrumb from '../Components/BreadCrumb/Breadcrumb'
import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import BlogAdminPanel from '../Components/Blog/BlogAdminPanel'

function BlogAdmin() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb
                title="Admin - Blogs"
            />
            <section className="space">
                <div className="container">
                    <BlogAdminPanel />
                </div>
            </section>
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default BlogAdmin
