import React, { useState, useEffect, useRef, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AdminProtectedRoute from '../Components/AdminProtectedRoute'
import LoadTop from '../Components/LoadTop'
import ProtectedRoute from '../Components/ProtectedRoute'
import TeamProtectedRoute from '../Components/TeamProtectedRoute'
import FloatingEnquireWidget from '../Components/Forms/FloatingEnquireWidget'
import FremorLoader from '../Components/Loader/loader'

// Lazy loaded page components
const AdminLogin = React.lazy(() => import('./AdminLogin'))
const HomeOne = React.lazy(() => import('./HomeOne'))
const HomeTwo = React.lazy(() => import('./HomeTwo'))
const HomeThree = React.lazy(() => import('./HomeThree'))
const HomeFour = React.lazy(() => import('./HomeFour'))
const About = React.lazy(() => import('./About'))
const Destination = React.lazy(() => import('./Destination'))
const DestinationDetails = React.lazy(() => import('./DestinationDetails'))
const DestinationAdmin = React.lazy(() => import('./DestinationAdmin'))
const TourAdmin = React.lazy(() => import('./TourAdmin'))
const Service = React.lazy(() => import('./Service'))
const ServiceDetails = React.lazy(() => import('./ServiceDetails'))
const Activities = React.lazy(() => import('./Activities'))
const ActivitiesDetails = React.lazy(() => import('./ActivitiesDetails'))
const Shop = React.lazy(() => import('./Shop'))
const ShopDetails = React.lazy(() => import('./ShopDetails'))
const Cart = React.lazy(() => import('./Cart'))
const Checkout = React.lazy(() => import('./Checkout'))
const Wishlist = React.lazy(() => import('./Wishlist'))
const Gallery = React.lazy(() => import('./Gallery'))
const Tour = React.lazy(() => import('./Tour'))
const TourDetails = React.lazy(() => import('./TourDetails'))
const Resort = React.lazy(() => import('./Resort'))
const ResortDetails = React.lazy(() => import('./ResortDetails'))
const TourGuide = React.lazy(() => import('./TourGuide'))
const TourGuiderDetails = React.lazy(() => import('./TourGuiderDetails'))
const Faq = React.lazy(() => import('./Faq'))
const Pricing = React.lazy(() => import('./Pricing'))
const Error = React.lazy(() => import('./Error'))
const Blog = React.lazy(() => import('./Blog'))
const BlogDetails = React.lazy(() => import('./BlogDetails'))
const Contact = React.lazy(() => import('./Contact'))
const Visa = React.lazy(() => import('./Visa'))
const VisaDetail = React.lazy(() => import('./VisaDetail'))
const Cruise = React.lazy(() => import('./Cruise'))
const CruiseDetails = React.lazy(() => import('./CruiseDetails'))
const CruiseAdmin = React.lazy(() => import('./CruiseAdmin'))
const BlogAdmin = React.lazy(() => import('./BlogAdmin'))
const GalleryAdmin = React.lazy(() => import('./GalleryAdmin'))
const CustomerReviewsAdmin = React.lazy(() => import('./CustomerReviewsAdmin'))
const DashboardAdmin = React.lazy(() => import('./DashboardAdmin'))
const MyAccount = React.lazy(() => import('./MyAccount'))
const CoTravellers = React.lazy(() => import('./CoTravellers'))
const LoggedInDevices = React.lazy(() => import('./LoggedInDevices'))
const Terms = React.lazy(() => import('./Terms'))
const TestimonialAdmin = React.lazy(() => import('./TestimonialAdmin'))
const TravellersAdmin = React.lazy(() => import('./TravellersAdmin'))
const TravellerDetailsAdmin = React.lazy(() => import('./TravellerDetailsAdmin'))
const TeamAdmin = React.lazy(() => import('./TeamAdmin'))
const TeamLogin = React.lazy(() => import('./TeamLogin'))
const TeamDashboard = React.lazy(() => import('./TeamDashboard'))
const VisaAdmin = React.lazy(() => import('./VisaAdmin'))
const VisaEnquiriesAdmin = React.lazy(() => import('./VisaEnquiriesAdmin'))
const PackageEnquiriesAdmin = React.lazy(() => import('./PackageEnquiriesAdmin'))
const NavbarAdmin = React.lazy(() => import('./NavbarAdmin'))

function RouterContent() {
  const location = useLocation()

  return (
    <>
      <LoadTop />
      <FloatingEnquireWidget />
      <Suspense fallback={
        <FremorLoader 
          show={true} 
          isPlain={location.pathname.startsWith('/admin') || location.pathname.startsWith('/team')} 
        />
      }>
        <Routes>
          <Route path="/" element={<HomeOne />}></Route>
          <Route path="/home-tour" element={<HomeTwo />}></Route>
          <Route path="/home-agency" element={<HomeThree />}></Route>
          <Route path="/home-yacht" element={<HomeFour />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/destination" element={<Destination />}></Route>
          <Route path="/destination/domestic" element={<Destination category="Domestic" />} />
          <Route path="/destination/inbound" element={<Destination category="Inbound" />} />
          <Route path="/destination/outbound" element={<Destination category="Outbound" />} />
          <Route path="/destination/outbound/:continent" element={<Destination category="Outbound" />} />
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
          <Route path="/tour-guide/:id" element={<TourGuiderDetails />} />
          <Route path="/faq" element={<Faq />}></Route>
          <Route path="/price" element={<Pricing />}></Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/blog" element={<Blog />}></Route>
          <Route path="/blog/:id" element={<BlogDetails />} />
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
          <Route path="/admin/visas" element={<AdminProtectedRoute><VisaAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/visa-enquiries" element={<AdminProtectedRoute><VisaEnquiriesAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/package-enquiries" element={<AdminProtectedRoute><PackageEnquiriesAdmin /></AdminProtectedRoute>} />
          <Route path="/admin/navbar" element={<AdminProtectedRoute><NavbarAdmin /></AdminProtectedRoute>} />
          
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
          <Route path="/team/visas" element={<TeamProtectedRoute><VisaAdmin /></TeamProtectedRoute>} />
          <Route path="/team/visa-enquiries" element={<TeamProtectedRoute><VisaEnquiriesAdmin /></TeamProtectedRoute>} />
          <Route path="/team/package-enquiries" element={<TeamProtectedRoute><PackageEnquiriesAdmin /></TeamProtectedRoute>} />
          
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Suspense>
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