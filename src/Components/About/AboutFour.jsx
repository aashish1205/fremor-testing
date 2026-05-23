import { Link } from 'react-router-dom'

function AboutFour() {
   return (
      <div className="about-area position-relative overflow-hidden overflow-hidden space" id="about-sec">
         <div className="container shape-mockup-wrap">
            <div className="row">
               <div className="col-xl-7">
                  <div className="img-box3">
                     <div className="img1">
                        <img src="/assets/img/about/about1.jpg" alt="About" />
                     </div>
                     <div className="img2">
                        <img src="/assets/img/about/about2.jpg" alt="About" />
                     </div>
                     <div className="img3 movingX">
                        <img src="/assets/img/about/about3.jpg" alt="About" />
                     </div>
                  </div>
               </div>
               <div className="col-xl-5">
                  <div className="ps-xl-4">
                     <div className="title-area mb-20">
                        <span className="sub-title style1 ">Welcome to Fremor Global</span>
                        <h2 className="sec-title mb-20 pe-xl-5 me-xl-5 heading">
                           Your Trusted Worldwide Travel Partner
                        </h2>
                     </div>
                     <p className="pe-xl-5">
                       Welcome to Fremor Global Travel, your trusted partner for unforgettable journeys across the world. We specialize in creating seamless travel experiences for individuals, families, corporate clients, FIT, and GIT travelers with carefully designed domestic and international tour packages.
                     </p>
                     <p className="mb-30 pe-xl-5">
                        {" "}
                       At Fremor Global Travel, we believe travel is more than just visiting destinations — it is about discovering cultures, creating memories, and experiencing the world with comfort and confidence. Our team is committed to delivering personalized travel solutions with professional service, competitive pricing, and reliable global partnerships.
                     </p>
                     <div className="about-item-wrap">
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_1.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">Exclusive Trip</h5>
                              <p className="about-item_text">
                                 There are many variations of passages of available but the
                                 majority.
                              </p>
                           </div>
                        </div>
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_2.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">Safety First Always</h5>
                              <p className="about-item_text">
                                 There are many variations of passages of available but the
                                 majority.
                              </p>
                           </div>
                        </div>
                        <div className="about-item style2">
                           <div className="about-item_img">
                              <img src="/assets/img/icon/about_1_3.svg" alt="" />
                           </div>
                           <div className="about-item_centent">
                              <h5 className="box-title">Professional Guide</h5>
                              <p className="about-item_text">
                                 There are many variations of passages of available but the
                                 majority.
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="mt-35">
                        <Link to="/contact" className="th-btn style3 th-icon">
                           Contact With Us
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
            <div
               className="shape-mockup movingX d-none d-xxl-block"
               style={{ top: '0%', left: '-18%' }}
            >
               <img src="/assets/img/shape/shape_2_1.png" alt="shape" />
            </div>
            <div
               className="shape-mockup jump d-none d-xxl-block"
               style={{ top: '28%', right: '-15%' }}
            >
               <img src="/assets/img/shape/shape_2_2.png" alt="shape" />
            </div>
            <div
               className="shape-mockup spin d-none d-xxl-block"
               style={{ top: '18%', left: '-112%' }}
            >
               <img src="/assets/img/shape/shape_2_3.png" alt="shape" />
            </div>
            <div
               className="shape-mockup movixgX d-none d-xxl-block"
               style={{ bottom: '18%', right: '-12%' }}
            >
               <img src="/assets/img/shape/shape_2_4.png" alt="shape" />
            </div>
         </div>
      </div>
   )
}

export default AboutFour
