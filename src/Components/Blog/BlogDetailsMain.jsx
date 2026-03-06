import React from 'react'
import { Link, useParams } from 'react-router-dom';
import Posts from '../data/data-post.json';

function BlogDetailsMain() {
    const { id } = useParams();
    const blogPost = Posts.find(post => post.id === parseInt(id));

    if (!blogPost) {
        return <div>Post not found!</div>;
    }
    return (
        <section className="th-blog-wrapper blog-details space-top space-extra-bottom">
            <div className="container shape-mockup-wrap">
                <div className="row">
                    <div className="col-xxl-8 col-lg-7">
                        <div className="th-blog blog-single">
                            <div className="blog-img">
                                <img src={`/assets/img/blog/${blogPost.bannerImg}`} alt="Blog Image" />
                            </div>
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <Link className="author" to="/blog">
                                        <i className="fa-light fa-user" />
                                        by David Smith
                                    </Link>
                                    <Link to="/blog">
                                        <i className="fa-regular fa-calendar" />
                                        05 May, 2025
                                    </Link>
                                    <Link to="#">
                                        <img src="/assets/img/icon/map.svg" alt="" />
                                        Sea Beach
                                    </Link>
                                </div>
                                <h2 className="blog-title">
                                    Relar Residence promotes sustainable transportation options, with
                                    dedicated spaces.
                                </h2>
                                <p className="blog-text mb-30">
                                    Welcome to Realar Residence, where sustainability meets comfort in
                                    every corner. In this blog post, we'll explore the green
                                    innovations seamlessly integrated into the fabric of EcoLand,
                                    creating a unique and eco-friendly living experience for its
                                    residents.
                                </p>
                                <p className="blog-text mb-30">
                                    A platform dedicated to exploring the transformative power of
                                    education. We believe that education is not only a means to
                                    acquire knowledge but also a catalyst for personal growth,
                                    societal progress, and global development. In this blog, we aim to
                                    inspire, inform, and engage readers in conversations about the
                                    latest trends, insights, and innovations in the field of
                                    education.
                                </p>
                                <blockquote>
                                    <p>
                                        Join your neighbors for an eco-friendly social gathering as the
                                        day comes to a conclusion. Savor refreshments made with
                                        sustainable ingredients and have discussions on sustainable
                                        life. By fostering a sense of community.
                                    </p>
                                    <cite>Michel Clarck</cite>
                                </blockquote>
                                <p className="blog-text mt-5 mb-4">
                                    Dinning Prepare a dinner using fresh ingredients from your own
                                    garden or the local CSA program. The energy-efficient appliances
                                    in your kitchen make cooking a breeze while minimizing your
                                    overall energy consumption. Share a meal with neighbors, The quiet
                                    night offers a peaceful ambiance, reinforcing the community's
                                    commitment to a sustainable, low-impact lifestyle.{" "}
                                </p>
                                <p className="blog-text mt-5 mb-4">
                                    {" "}
                                    Living sustainably at Realar Residence is more than a choice; it's
                                    an immersive experience that shapes every moment of your day. From
                                    the moment you wake up in your solar-powered home to the evening
                                    gatherings with like-minded neighbors{" "}
                                </p>
                                <h3 className="mt-4">
                                    The sustainable traveller These 6 hotels epitomise ethical luxury
                                </h3>
                                <p className="">
                                    ‍Whether you work from home or commute to a nearby office, the
                                    energy-efficient features of your home contribute to a productive
                                    and eco-conscious workday. Smart home systems allow you to monitor
                                    and control energy usage, ensuring that your environmental impact
                                    remains minimal.
                                </p>
                                <div className="row gy-4">
                                    <div className="col-12">
                                        <div className="blog-img">
                                            <img
                                                className="w-100"
                                                src="/assets/img/blog/blog_inner_1.jpg"
                                                alt="Blog Image"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <p className=" mb-0">
                                    1.Neighborhood: Choosing the ideal neighborhood is an important
                                    choice that extends beyond a property's physical characteristics.
                                    We'll go over the things to take into account while selecting a
                                    neighborhood in this piece, including future growth plans, school
                                    districts, and amenities. To make sure that the community you
                                    choose fits both your present requirements and your long-term
                                    goals, learn how to balance your lifestyle choices and property
                                    prices.
                                </p>
                                <p>
                                    2.Buying a first home may be an exciting and daunting experience
                                    for those who have never done it before. This blog article serves
                                    as a thorough guide to help you through the process of buying your
                                    first house. We're here to provide you with useful advice and
                                    insights to help you navigate every step of the home-buying
                                    process, from comprehending the financial elements to luxury about
                                    its all realar properties nuances.
                                </p>
                                <div className="share-links clearfix ">
                                    <div className="row justify-content-between">
                                        <div className="col-md-auto">
                                            <span className="share-links-title">Tags:</span>
                                            <div className="tagcloud">
                                                <Link to="/blog">Apartment</Link>
                                                <Link to="/blog">Buyer</Link>
                                                <Link to="/blog">Modern</Link>
                                                <Link to="/blog">Luxury</Link>
                                            </div>
                                        </div>
                                        <div className="col-md-auto text-xl-end">
                                            <div className="share-links_wrapp">
                                                <span className="share-links-title">Share:</span>
                                                <div className="social-links">
                                                    <Link to="https://www.facebook.com/">
                                                        <i className="fab fa-facebook-f" />
                                                    </Link>
                                                    <Link to="https://www.twitter.com/">
                                                        <i className="fab fa-twitter" />
                                                    </Link>
                                                    <Link to="https://www.instagram.com/">
                                                        <i className="fab fa-instagram" />
                                                    </Link>
                                                    <Link to="https://www.linkedin.com/">
                                                        <i className="fab fa-linkedin-in" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Share Links Area end */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="th-comments-wrap ">
                            <h2 className="blog-inner-title h4"> Comments (03)</h2>
                            <ul className="comment-list">
                                <li className="th-comment-item">
                                    <div className="th-post-comment">
                                        <div className="comment-avater">
                                            <img
                                                src="/assets/img/blog/comment-author-1.jpg"
                                                alt="Comment Author"
                                            />
                                        </div>
                                        <div className="comment-content">
                                            <h3 className="name">Adam Jhon</h3>
                                            <span className="commented-on">20Jun, 2024 08:56pm</span>
                                            <p className="text">
                                                Credibly pontificate transparent quality vectors with
                                                quality mindshare. Efficiently architect worldwide strategic
                                                theme areas after user.
                                            </p>
                                            <div className="reply_and_edit">
                                                <Link to="#" className="reply-btn">
                                                    <i className="fas fa-reply" />
                                                    Reply
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="children">
                                        <li className="th-comment-item">
                                            <div className="th-post-comment">
                                                <div className="comment-avater">
                                                    <img
                                                        src="/assets/img/blog/comment-author-2.jpg"
                                                        alt="Comment Author"
                                                    />
                                                </div>
                                                <div className="comment-content">
                                                    <div className="">
                                                        <h3 className="name">Jhon Abraham</h3>
                                                        <span className="commented-on">
                                                            25Jun, 2024 08:56pm
                                                        </span>
                                                    </div>
                                                    <p className="text">
                                                        It is different from airport transfer or port transfer,
                                                        which are services that pick you up
                                                    </p>
                                                    <div className="reply_and_edit">
                                                        <Link to="#" className="reply-btn">
                                                            <i className="fas fa-reply" />
                                                            Reply
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li className="th-comment-item">
                                    <div className="th-post-comment">
                                        <div className="comment-avater">
                                            <img
                                                src="/assets/img/blog/comment-author-3.jpg"
                                                alt="Comment Author"
                                            />
                                        </div>
                                        <div className="comment-content">
                                            <div className="">
                                                <h3 className="name">Anadi Juila</h3>
                                                <span className="commented-on">27Jun, 2024 08:56pm</span>
                                            </div>
                                            <p className="text">
                                                Credibly pontificate transparent quality vectors with
                                                quality mindshare. Efficiently architect worldwide strategic
                                                theme areas after user.
                                            </p>
                                            <div className="reply_and_edit">
                                                <Link to="#" className="reply-btn">
                                                    <i className="fas fa-reply" />
                                                    Reply
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>{" "}
                        {/* Comment end */} {/* Comment Form */}
                        <div className="th-comment-form ">
                            <div className="row">
                                <h3 className="blog-inner-title h4 mb-2">Leave a Reply</h3>
                                <p className="mb-25">
                                    Your email address will not be published. Required fields are
                                    marked
                                </p>
                                <form action="#">
                                    <div className="row">
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="text"
                                                placeholder="Full Name*"
                                                className="form-control"
                                                required
                                            />
                                            <i className="far fa-user" />
                                        </div>
                                        <div className="col-md-6 form-group">
                                            <input
                                                type="text"
                                                placeholder="Your Email*"
                                                className="form-control"
                                                required
                                            />
                                            <i className="far fa-envelope" />
                                        </div>
                                        <div className="col-12 form-group">
                                            <input
                                                type="text"
                                                placeholder="Website"
                                                className="form-control"
                                                required
                                            />
                                            <i className="far fa-globe" />
                                        </div>
                                        <div className="col-12 form-group">
                                            <textarea
                                                placeholder="Comment*"
                                                className="form-control"
                                                defaultValue={""}
                                            />
                                            <i className="far fa-pencil" />
                                        </div>
                                        <div className="col-12 form-group">
                                            <input type="checkbox" id="html" />
                                            <label htmlFor="html">
                                                Save my name, email, and website in this browser for the next
                                                time I comment.
                                            </label>
                                        </div>
                                        <div className="col-12 form-group mb-0">
                                            <button className="th-btn" type="submit">
                                                Send Message
                                                <img src="/assets/img/icon/plane2.svg" alt="" />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-4 col-lg-5">
                        <aside className="sidebar-area">
                            <div className="widget widget_search  ">
                                <form className="search-form">
                                    <input type="text" placeholder="Search" required />
                                    <button type="submit">
                                        <i className="far fa-search" />
                                    </button>
                                </form>
                            </div>
                            <div className="widget widget_categories  ">
                                <h3 className="widget_title">Categories</h3>
                                <ul>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            City Tour
                                        </Link>
                                        <span>(8)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Beach Tours
                                        </Link>
                                        <span>(6)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Wildlife Tours
                                        </Link>
                                        <span>(2)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            News &amp; Tips
                                        </Link>
                                        <span>(7)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Adventure Tours
                                        </Link>
                                        <span>(9)</span>
                                    </li>
                                    <li>
                                        <Link to="/blog">
                                            <img src="/assets/img/theme-img/map.svg" alt="" />
                                            Mountain Tours
                                        </Link>
                                        <span>(10)</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="widget  ">
                                <h3 className="widget_title">Recent Posts</h3>
                                <div className="recent-post-wrap">
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="#">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-1.jpg"
                                                    alt="Blog Image"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="#">
                                                    Exploring The Green Spaces Of the island maldives
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    22/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="#">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-2.jpg"
                                                    alt="Blog Image"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="#">
                                                    Harmony With Nature Of Belgium Tour and travle
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    25/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="recent-post">
                                        <div className="media-img">
                                            <Link to="#">
                                                <img
                                                    src="/assets/img/blog/recent-post-1-3.jpg"
                                                    alt="Blog Image"
                                                />
                                            </Link>
                                        </div>
                                        <div className="media-body">
                                            <h4 className="post-title">
                                                <Link className="text-inherit" to="#">
                                                    Exploring The Green Spaces Of Realar Residence
                                                </Link>
                                            </h4>
                                            <div className="recent-post-meta">
                                                <Link to="/blog">
                                                    <i className="fa-regular fa-calendar" />
                                                    27/6/ 2025
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widget widget_tag_cloud  ">
                                <h3 className="widget_title">Popular Tags</h3>
                                <div className="tagcloud">
                                    <Link to="/blog">Tour</Link>
                                    <Link to="/blog">Adventure</Link>
                                    <Link to="/blog">Rent</Link>
                                    <Link to="/blog">Innovate</Link>
                                    <Link to="/blog">Hotel</Link>
                                    <Link to="/blog">Modern</Link>
                                    <Link to="/blog">Luxury</Link>
                                    <Link to="/blog">Travel</Link>
                                </div>
                            </div>
                            <div
                                className="widget widget_offer"
                                style={{ background: "url(/assets/img/bg/widget_bg_1.jpg)" }}
                            >
                                <div className="offer-banner">
                                    <div className="offer">
                                        <h6 className="box-title">
                                            Need Help? We Are Here To Help You
                                        </h6>
                                        <div className="banner-logo">
                                            <img src="/assets/img/logo2.svg" alt="Tourm" />
                                        </div>
                                        <div className="offer">
                                            <h6 className="offer-title">You Get Online support</h6>
                                            <Link className="offter-num" to={+256214203215}>
                                                +256 214 203 215
                                            </Link>
                                        </div>
                                        <Link to="/contact" className="th-btn style2 th-icon">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
                <div
                    className="shape-mockup shape1 d-none d-xxl-block"
                    style={{ bottom: "5%", right: "-8%" }}
                >
                    <img src="/assets/img/shape/shape_1.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape2 d-none d-xl-block"
                    style={{ bottom: "1%", right: "-7%" }}
                >
                    <img src="/assets/img/shape/shape_2.png" alt="shape" />
                </div>
                <div
                    className="shape-mockup shape3 d-none d-xxl-block"
                    style={{ bottom: "2%", right: "0%" }}
                >
                    <img src="/assets/img/shape/shape_3.png" alt="shape" />
                </div>
            </div>
        </section>

    )
}

export default BlogDetailsMain
