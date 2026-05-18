import React from 'react';
import { Link } from 'react-router-dom';

function VideoBanner({ title, videoSrc, category }) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '50vh', overflow: 'hidden' }}>
            {/* Background Video */}
            <video 
                key={videoSrc}
                autoPlay 
                muted 
                loop 
                playsInline
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'cover',
                    zIndex: -2
                }}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Dark Overlay for text readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                zIndex: -1
            }}></div>

            {/* Content */}
            <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <div className="breadcumb-content" style={{ zIndex: 1, padding: '0 15px' }}>
                    <h1 className="breadcumb-title text-white" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '700', marginBottom: '15px' }}>
                        {title}
                    </h1>
                    <ul className="breadcumb-menu text-white d-flex flex-wrap gap-2 m-0 p-0" style={{ listStyle: 'none' }}>
                        <li>
                            <Link to="/" className="text-white text-decoration-none">Home</Link>
                        </li>
                        <li className="text-white">/</li>
                        <li className="text-white">Destination</li>
                        {category && (
                            <>
                                <li className="text-white">/</li>
                                <li className="text-white">{category}</li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default VideoBanner;
