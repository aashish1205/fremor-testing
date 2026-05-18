import React from 'react'
import HeaderOne from '../Components/Header/HeaderOne'

import FooterFour from '../Components/Footer/FooterFour'
import ScrollToTop from '../Components/ScrollToTop'
import Breadcrumb1 from '../Components/BreadCrumb/Breadcrumb1'
import VisaSearch from "../Components/Visa/VisaSearch";
import VisaPageSections from '../Components/Visa/VisaPageSections'




function Visa() {
    return (
        <>
            <HeaderOne />
            <Breadcrumb1
                title='Visa'
            />
           <VisaSearch />
            <VisaPageSections />
            
            <FooterFour />
            <ScrollToTop />
        </>
    )
}

export default Visa
