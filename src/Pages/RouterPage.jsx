import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminProtectedRoute from '../Components/AdminProtectedRoute'
import HomeOne from './HomeOne'
import HomeTwo from './HomeTwo'
import HomeThree from './HomeThree'
import HomeFour from './HomeFour'
import About from './About'
import LoadTop from '../Components/LoadTop'
import Destination from './Destination'
import DestinationDetails from './DestinationDetails'
import DestinationAdmin from './DestinationAdmin'
import TourAdmin from './TourAdmin'
import Service from './Service'
import ServiceDetails from './ServiceDetails';
import Activities from './Activities'
import ActivitiesDetails from './ActivitiesDetails'
import Shop from './Shop'
import ShopDetails from './ShopDetails'
import Cart from './Cart'
import Checkout from './Checkout'
import Wishlist from './Wishlist'
import Gallery from './Gallery'
import Tour from './Tour'
import TourDetails from './TourDetails'
import Resort from './Resort'
import ResortDetails from './ResortDetails'
import TourGuide from './TourGuide'
import TourGuiderDetails from './TourGuiderDetails'
import Faq from './Faq'
import Pricing from './Pricing'
import Error from './Error'
import Blog from './Blog'
import BlogDetails from './BlogDetails'
import Contact from './Contact'
import Visa from './Visa'
import VisaDetail from './VisaDetail'
import Cruise from './Cruise'
import CruiseDetails from './CruiseDetails'
import CruiseAdmin from './CruiseAdmin'
import BlogAdmin from './BlogAdmin'
import GalleryAdmin from './GalleryAdmin'
import CustomerReviewsAdmin from './CustomerReviewsAdmin'
import DashboardAdmin from './DashboardAdmin'
import MyAccount from './MyAccount'
import CoTravellers from './CoTravellers'
import LoggedInDevices from './LoggedInDevices'
import ProtectedRoute from '../Components/ProtectedRoute'
import Terms from './Terms'
import TestimonialAdmin from './TestimonialAdmin'
import TravellersAdmin from './TravellersAdmin'
import TravellerDetailsAdmin from './TravellerDetailsAdmin'
import TeamAdmin from './TeamAdmin'
import TeamLogin from './TeamLogin'
import TeamDashboard from './TeamDashboard'
import TeamProtectedRoute from '../Components/TeamProtectedRoute'
import FloatingEnquireWidget from '../Components/Forms/FloatingEnquireWidget'
import FremorLoader from '../Components/Loader/loader'

function RouterContent() {
  const location = useLocation()
  const [showLoader, setShowLoader] = useState(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    setShowLoader(true)
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <FremorLoader show={showLoader} />
      <div style={{ opacity: showLoader ? 0 : 1, transition: 'opacity 0.3s ease' }}>
        <LoadTop />
        <FloatingEnquireWidget />
        <Routes>
          <Route path="/" element={<HomeOne />}></Route>
          <Route path="/home-tour" element={<HomeTwo />}></Route>
          <Route path="/home-agency" element={<HomeThree />}></Route>
          <Route path="/home-yacht" element={<HomeFour />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/destination" element={<Destination />}></Route>
          <Route path="/destination/inbound" element={<Destination category="Inbound" />} />
          <Route path="/destination/outbound" element={<Destination category="Outbound" />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><DashboardAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/travellers" element={<AdminProtectedRoute><TravellersAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/travellers/:id" element={<AdminProtectedRoute><TravellerDetailsAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/destinations" element={<AdminProtectedRoute><DestinationAdmin /></AdminProtectedRoute>} />
          <Route path="/service" element={<Service />}></Route>
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/activities" element={<Activities />}></Route>
          <Route path="/activities-details" element={<ActivitiesDetails />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/shop/:id" element={<ShopDetails />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/wishlist" element={<Wishlist />}></Route>
          <Route path="/gallery" element={<Gallery />}></Route>
          <Route path="/tour" element={<Tour />}></Route>
          <Route path="/tour-details/:id" element={<TourDetails />} />
          <Route path="/admin/tours" element={<AdminProtectedRoute><TourAdmin /></AdminProtectedRoute>} />
          <Route path="/resort" element={<Resort />}></Route>
          <Route path="/resort/:id" element={<ResortDetails />}></Route>
          <Route path="/tour-guide" element={<TourGuide />}></Route>
          <Route path="/tour-guide/:id" element={<TourGuiderDetails />}></Route>
          <Route path="/faq" element={<Faq />}></Route>
          <Route path="/price" element={<Pricing />}></Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogDetails />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
          <Route path="/co-travellers" element={<ProtectedRoute><CoTravellers /></ProtectedRoute>} />
          <Route path="/logged-in-devices" element={<ProtectedRoute><LoggedInDevices /></ProtectedRoute>} />
          <Route path="/visa" element={<Visa />}></Route> 
          <Route path="/visa/detail" element={<VisaDetail />}></Route>
          <Route path="/cruise" element={<Cruise />}></Route> 
          <Route path="/cruise-details/:id" element={<CruiseDetails />} />
          <Route path="/admin/cruises" element={<AdminProtectedRoute><CruiseAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/blogs" element={<AdminProtectedRoute><BlogAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/testimonials" element={<AdminProtectedRoute><TestimonialAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/instagram-gallery" element={<AdminProtectedRoute><GalleryAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/customer-video-reviews" element={<AdminProtectedRoute><CustomerReviewsAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/team" element={<AdminProtectedRoute><TeamAdmin /></AdminProtectedRoute>} />
          
          <Route path="/team/login" element={<TeamLogin />} />
          <Route path="/team/dashboard" element={<TeamProtectedRoute><TeamDashboard /></TeamProtectedRoute>} />
          <Route path="/team/travellers" element={<TeamProtectedRoute><TravellersAdmin /></TeamProtectedRoute>} />
          <Route path="/team/travellers/:id" element={<TeamProtectedRoute><TravellerDetailsAdmin /></TeamProtectedRoute>} />
          <Route path="/team/destinations" element={<TeamProtectedRoute><DestinationAdmin /></TeamProtectedRoute>} />
          <Route path="/team/cruises" element={<TeamProtectedRoute><CruiseAdmin /></TeamProtectedRoute>} />
          <Route path="/team/blogs" element={<TeamProtectedRoute><BlogAdmin /></TeamProtectedRoute>} />
          <Route path="/team/testimonials" element={<TeamProtectedRoute><TestimonialAdmin /></TeamProtectedRoute>} />
          <Route path="/team/instagram-gallery" element={<TeamProtectedRoute><GalleryAdmin /></TeamProtectedRoute>} />
          <Route path="/team/customer-video-reviews" element={<TeamProtectedRoute><CustomerReviewsAdmin /></TeamProtectedRoute>} />
          
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </div>
    </>
  )
}

function RouterPage() {
  return (
    <div>
      <Router>
        <RouterContent />
      </Router>
    </div>
  )
}

export default RouterPage