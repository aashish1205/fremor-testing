import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const blogPosts = [
  {
    id: 1,
    date: "July 05 2024",
    readTime: "6 min read",
    title: "10 Reasons why you should visit New Jersey",
    image: "/assets/img/blog/blog_1_1.jpg",
    detailsLink: "/blog/1",
  },
  {
    id: 2,
    date: "July 06 2024",
    readTime: "7 min read",
    title: "The best time to visit Japan & enjoy the cherry blossoms",
    image: "/assets/img/blog/blog_1_2.jpg",
    detailsLink: "/blog/1",
  },
  {
    id: 3,
    date: "July 07 2024",
    readTime: "8 min read",
    title: "The 7 amazing destinations for adventure seekers",
    image: "/assets/img/blog/blog_1_3.jpg",
    detailsLink: "/blog/1",
  },
  {
    id: 4,
    date: "July 09 2024",
    readTime: "9 min read",
    title: "10 Reasons why you should visit New Jersey",
    image: "/assets/img/blog/blog_1_1.jpg",
    detailsLink: "/blog/1",
  },
  {
    id: 5,
    date: "July 10 2024",
    readTime: "10 min read",
    title: "The best time to visit Japan & enjoy the cherry blossoms",
    image: "/assets/img/blog/blog_1_2.jpg",
    detailsLink: "/blog/1",
  },
  {
    id: 6,
    date: "July 12 2024",
    readTime: "11 min read",
    title: "The 7 amazing destinations for adventure seekers",
    image: "/assets/img/blog/blog_1_3.jpg",
    detailsLink: "/blog/1",
  },
];

function BlogOne() {
  return (
    <section className="bg-smoke overflow-hidden space overflow-hidden" id="blog-sec">
      <div className="container shape-mockup-wrap">
        <div className="mb-30 text-center text-md-start">
          <div className="row align-items-center justify-content-between">
            <div className="col-md-7">
              <div className="title-area mb-md-0">
                <span className="sub-title">About Us Restaurant</span>
                <h2 className="sec-title">News & Articles From Tourm</h2>
              </div>
            </div>
            <div className="col-md-auto">
              <Link to="/blog" className="th-btn style4 th-icon">
                See More Articles
              </Link>
            </div>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          className="swiper th-slider has-shadow"
        >
          {blogPosts.map((post) => (
            <SwiperSlide key={post.id}>
              <div className="blog-box th-ani">
                <div className="blog-img global-img">
                  <img src={post.image} alt="blog" />
                </div>
                <div className="blog-box_content">
                  <div className="blog-meta">
                    <Link className="author" to="/blog">
                      {post.date}
                    </Link>
                    <Link to="/blog">{post.readTime}</Link>
                  </div>
                  <h3 className="box-title">
                    <Link to={post.detailsLink}>{post.title}</Link>
                  </h3>
                  <Link to={post.detailsLink} className="th-btn style4 th-icon">
                    Read More
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Decorative Shapes */}
        <div className="shape-mockup shape1 d-none d-xxl-block" style={{bottom:"20%", left:"-17%"}}>
          <img src="/assets/img/shape/shape_1.png" alt="shape" />
        </div>
        <div className="shape-mockup shape2 d-none d-xl-block" style={{bottom:"5%", left:"-17%"}}>
          <img src="/assets/img/shape/shape_2.png" alt="shape" />
        </div>
        <div className="shape-mockup shape3 d-none d-xxl-block" style={{bottom:"12%", left:"-10%"}}>
          <img src="/assets/img/shape/shape_3.png" alt="shape" />
        </div>
      </div>
    </section>
  );
}

export default BlogOne;
