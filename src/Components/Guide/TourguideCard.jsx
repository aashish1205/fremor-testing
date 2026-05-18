import React from 'react'
import { Link } from 'react-router-dom'

function TourguideCard(props) {
    const { guideID, guideThumb, guideImage, guideTitle } = props;
    return (
        <div className="th-team team-grid">
            <div className="team-img">
                <img src={`/assets/img/team/${guideThumb}`} alt="Team" />
            </div>
            <div className="team-img2">
                <img src= {`/assets/img/team/${guideImage}`} alt="Team" />
            </div>
            <div className="team-content">
                <div className="media-body">
                    <h3 className="box-title">
                        <Link to={`/tour-guide/${guideID}`}>{guideTitle ? guideTitle : 'Michel Smith'}</Link>
                    </h3>
                    <span className="team-desig">Tourist Guide</span>
                    <div className="th-social">
                        <Link target="_blank" to="https://facebook.com/">
                            <i className="fab fa-facebook-f" />
                        </Link>
                        <Link target="_blank" to="https://twitter.com/">
                            <i className="fab fa-twitter" />
                        </Link>
                        <Link target="_blank" to="https://linkedin.com/">
                            <i className="fab fa-linkedin-in" />
                        </Link>
                        <Link target="_blank" to="https://youtube.com/">
                            <i className="fab fa-youtube" />
                        </Link>
                        <Link target="_blank" to="https://instagram.com/">
                            <i className="fab fa-instagram" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TourguideCard
