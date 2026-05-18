import React, { useState } from 'react';
import TourguideCard from './TourguideCard';
import posts from '../data/data-guide.json';

function TourGuideInner() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <section className="space" id="team-sec">
            <div className="container">
                <div className="row gy-4 gx-30">
                    {currentPosts.map((data, index) => (
                        <div key={data.id} className="col-xl-4 col-md-6">
                            <TourguideCard
                                guideID={data.id}
                                guideThumb={`${data.thumb}`}
                                guideImage={`${data.image}`}
                                guideTitle={data.title}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TourGuideInner;
