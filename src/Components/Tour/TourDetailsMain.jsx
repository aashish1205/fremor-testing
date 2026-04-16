import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, EffectFade } from "swiper/modules";
import { fetchTourById, getTourImageSrc } from '../../services/tourService';

function TourDetailsMain() {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const [tourPost, setTourPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const loadTour = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchTourById(id);
                setTourPost(data);
                if (data && data.itinerary && data.itinerary.length > 0) {
                    setActiveTab(data.itinerary[0].day);
                }
            } catch (err) {
                console.error('Error fetching tour:', err);
                setError('Tour not found!');
            } finally {
                setLoading(false);
            }
        };

        if (id) loadTour();
    }, [id]);

    if (loading) return <div className="text-center py-5"><h3>Loading tour...</h3></div>;
    if (error || !tourPost) return <div className="text-center py-5"><h3>{error || 'Tour not found'}</h3></div>;

    const FallbackImages = [
        "/assets/img/tour/tour_inner_1.jpg",
        "/assets/img/tour/tour_inner_2.jpg",
        "/assets/img/tour/tour_inner_3.jpg",
        "/assets/img/tour/tour_inner_1.jpg",
    ];

    let images = [getTourImageSrc(tourPost.primary_image)];
    if (tourPost.gallery_images && tourPost.gallery_images.length > 0) {
        images = [images[0], ...tourPost.gallery_images.map(getTourImageSrc)];
    } else {
        images = [...images, ...FallbackImages.slice(1)];
    }

    const itinerary = tourPost.itinerary?.length > 0 ? tourPost.itinerary : [];
    const highlights = tourPost.highlights_list?.length > 0 ? tourPost.highlights_list : ["No highlights available."];
    const included = tourPost.included_list?.length > 0 ? tourPost.included_list : ["N/A"];
    const excluded = tourPost.excluded_list?.length > 0 ? tourPost.excluded_list : ["N/A"];

    return (
        <section className="space">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="tour-page-single">
                            <div className="slider-area tour-slider1">
                                <Swiper
                                    modules={[Navigation, Thumbs, EffectFade]}
                                    effect="fade"
                                    loop={true}
                                    spaceBetween={10}
                                    navigation={{
                                        prevEl: ".slider-prev",
                                        nextEl: ".slider-next",
                                    }}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    className="swiper th-slider mb-4"
                                    id="tourSlider4"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img" style={{ height: '400px' }}>
                                                <img src={img} alt={`Slide ${index + 1}`} style={{ height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <Swiper
                                    modules={[Navigation, Thumbs]}
                                    loop={true}
                                    spaceBetween={25}
                                    slidesPerView={3}
                                    watchSlidesProgress
                                    onSwiper={setThumbsSwiper}
                                    className="swiper th-slider tour-thumb-slider"
                                >
                                    {images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="tour-slider-img" style={{ height: '120px' }}>
                                                <img src={img} alt={`Thumbnail ${index + 1}`} style={{ height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button data-slider-prev="#tourSlider4" className="slider-arrow style3 slider-prev">
                                    <img src="/assets/img/icon/hero-arrow-left.svg" alt="" />
                                </button>
                                <button data-slider-next="#tourSlider4" className="slider-arrow style3 slider-next">
                                    <img src="/assets/img/icon/hero-arrow-right.svg" alt="" />
                                </button>
                            </div>
                            <div className="page-content">
                                <div className="page-meta mb-45">
                                    <Link className="page-tag mr-5" to="/tour">
                                        Featured
                                    </Link>
                                    <span className="ratting">
                                        <i className="fa-sharp fa-solid fa-star" />
                                        <span>{tourPost.rating || 4.8}</span>
                                    </span>
                                </div>
                                <h2 className="box-title">{tourPost.title}</h2>
                                <h4 className="tour-price">
                                    <span className="currency">₹{tourPost.price}</span>/Person
                                </h4>
                                <p className="box-text mb-30">
                                    {tourPost.description_1 || "No description provided."}
                                </p>
                                <p className="box-text mb-50">
                                    {tourPost.description_2 || ""}
                                </p>

                                <h2 className="box-title">Highlights</h2>
                                <p className="box-text mb-30">
                                    {tourPost.highlights_text || ""}
                                </p>
                                <div className="checklist mb-50">
                                    <ul>
                                        {highlights.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <h2 className="box-title">Basic Information</h2>
                                <p className="blog-text mb-35">
                                    {tourPost.basic_info_text || ""}
                                </p>
                                <div className="destination-checklist mb-50">
                                    <div className="checklist style2 d-flex gap-5">
                                        <ul>
                                            <li><span className='fw-bold me-2'>Location:</span> {tourPost.title}</li>
                                            <li><span className='fw-bold me-2'>Rating:</span> {tourPost.rating}</li>
                                        </ul>
                                    </div>
                                </div>

                                <h2 className="box-title">Included and Excluded</h2>
                                <div className="destination-checklist d-flex gap-5">
                                    <div className="checklist style2 style4 w-50">
                                        <ul>
                                            {included.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="checklist style5 w-50">
                                        <ul>
                                            {excluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {itinerary.length > 0 && (
                                    <>
                                        <h3 className="page-title mt-50 mb-0">Tour Plan</h3>
                                        <div>
                                            <ul className="nav nav-tabs tour-tab mt-10" role="tablist">
                                                {itinerary.map((dayObj) => (
                                                    <li className="nav-item" key={dayObj.day} role="presentation">
                                                        <button
                                                            className={`nav-link ${activeTab === dayObj.day ? "active" : ""}`}
                                                            onClick={() => setActiveTab(dayObj.day)}
                                                            type="button"
                                                            role="tab"
                                                        >
                                                            {dayObj.day}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="tab-content">
                                                {itinerary.map((dayObj) => (
                                                    <div
                                                        key={dayObj.day}
                                                        className={`tab-pane fade ${activeTab === dayObj.day ? "show active" : ""}`}
                                                        role="tabpanel"
                                                    >
                                                        <div className="tour-grid-plan">
                                                            <div className="checklist">
                                                                <ul>
                                                                    {dayObj.activities.map((item, index) => (
                                                                        <li key={index}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* SIDEBAR ... */}
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> City Tour</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Beach Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Wildlife Tours</Link></li>
                                    <li><Link to="/blog"><img src="/assets/img/theme-img/map.svg" alt="" /> Adventure Tours</Link></li>
                                </ul>
                            </div>
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TourDetailsMain;