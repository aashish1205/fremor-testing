import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function FaqInnerTwo() {
    const [activeIndex, setActiveIndex] = useState(0);
    const contentRefs = useRef([]); // Store refs for each accordion item

    const faqs = [
        {
            question: "How do I start the process of buying a home?",
            answer:
                "The open-concept layout seamlessly connects the living room with the fully equipped kitchen, boasting top-of-the-line appliances and all the essentials for preparing delicious meals.",
        },
        {
            question: "What factors should I consider when choosing a neighborhood?",
            answer:
                "The responsibility for paying closing costs can vary depending on the terms negotiated between the buyer and the seller, as well as local customs and regulations.",
        },
        {
            question: "How can I determine the right price for selling my property?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "How can I negotiate the best price when buying a property?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
        {
            question: "What are closing costs and who is responsible for paying them?",
            answer:
                "Research the local real estate market to understand current trends, property values, and comparable sales in the area. Knowing the market will give you leverage during negotiations.",
        },
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    useEffect(() => {
        // Dynamically set max-height for smooth transition
        contentRefs.current.forEach((ref, index) => {
            if (ref) {
                ref.style.maxHeight = activeIndex === index ? `${ref.scrollHeight}px` : "0px";
            }
        });
    }, [activeIndex]);

    return (
        <div className="space-top space-extra-bottom">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-7">
                        <div className="title-area text-center">
                            <span className="sub-title">FAQ</span>
                            <h2 className="sec-title">Frequently Asked Questions</h2>
                            <p>Have questions you want answers to?</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                        <div className="accordion-area mb-30">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`accordion-card style2 ${activeIndex === index ? "active" : ""}`}
                                >
                                    <div className="accordion-header">
                                        <button
                                            className={`accordion-button ${activeIndex === index ? "" : "collapsed"}`}
                                            onClick={() => toggleAccordion(index)}
                                        >
                                            Q{index + 1}. {faq.question}
                                        </button>
                                    </div>
                                    <div
                                        ref={(el) => (contentRefs.current[index] = el)}
                                        className="accordion-collapse"
                                    >
                                        <div className="accordion-body">
                                            <p className="faq-text">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="th-loader btn-group mt-5 d-flex justify-content-center">
                <Link to="" className="th-btn style3 th-icon" id="loadMore">
                    <span>Load More</span>
                </Link>
            </div>

        </div>
    );
}

export default FaqInnerTwo;
