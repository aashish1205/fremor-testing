import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // Import navigation styles
import 'swiper/css/pagination'; // Import pagination styles
import { Link } from 'react-router-dom';
import { fetchDestinations, getImageSrc } from '../../services/destinationService';
import DestinationCard from '../Destination/DestinationCard';


function TourOne() {
  const [topDestinations, setTopDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        // Sort by rating descending and pick top 6
        const sortedDestinations = data
          .map(dest => ({ ...dest, numericRating: parseFloat(dest.rating) || 0 }))
          .sort((a, b) => b.numericRating - a.numericRating)
          .slice(0, 6);

        setTopDestinations(sortedDestinations);
      } catch (error) {
        console.error("Failed to load top destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDestinations();
  }, []);

  return (
    <section
      className="tour-area position-relative bg-top-center overflow-hidden space-top bg-no-repeat"
      id="service-sec"
     // style={{ backgroundImage: 'url(/assets/img/tour/tourbackground.jpg)' }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="title-area text-center">
              <span className="sub-title">Best Place For You</span>
              <h2 className="sec-title">Most Popular Tour</h2>
              <p className="sec-text">
                Explore our handpicked selection of highly-rated destinations guaranteed to make your next journey unforgettable.
              </p>
            </div>
          </div>
        </div>
        <div className="slider-area tour-slider">
          <Swiper
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 2 },
              1200: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
            spaceBetween={24}
            grabCursor={true}
            className="swiper th-slider has-shadow slider-drag-wrap"
          >
            {loading ? (
              <div className="text-center py-5 w-100">
                <p>Loading popular destinations...</p>
              </div>
            ) : topDestinations.length > 0 ? (
              topDestinations.map((dest) => {
                const destinationLink = `/destination/${dest.id}`;
                return (
                  <SwiperSlide key={dest.id}>
                    <DestinationCard
                      destinationID={dest.id}
                      destinationImage={dest.image}
                      destinationTitle={dest.title}
                      destinationPrice={dest.price}
                      destinationDuration={dest.duration}
                      destinationPriceUnit={dest.price_unit}
                      destinationNights={dest.nights}
                      destinationDays={dest.days}
                      rating={dest.rating}
                      ratingCount={dest.rating_count}
                      originalPrice={dest.original_price}
                      isRecommended={dest.is_recommended}
                      badgeText={dest.badge_text}
                      loyaltyPoints={dest.loyalty_points}
                      inclusions={dest.inclusions}
                      location={dest.location}
                      itinerarySummary={dest.itinerary_summary}
                    />
                  </SwiperSlide>

                );
              })
            ) : (
              <div className="text-center py-5 w-100">
                <p>No destinations found.</p>
              </div>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default TourOne;
