import React from "react";
import { Link } from "react-router-dom";
import { getBlogImageSrc } from "../../services/blogService";

function BlogPost({ blog }) {
    // Format date nicely
    const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="th-blog blog-single has-post-thumbnail">
            <div className="blog-img">
                <Link to={`/blog/${blog.id}`}>
                    <img src={getBlogImageSrc(blog.main_image)} alt={blog.title} className="w-100 object-fit-cover" style={{ maxHeight: '450px' }} />
                </Link>
            </div>
            <div className="blog-content">
                <div className="blog-meta">
                    <Link className="author" to={`/blog/${blog.id}`}>
                        <i className="fa-light fa-user" />
                        by {blog.author || 'David Smith'}
                    </Link>
                    <Link to={`/blog/${blog.id}`}>
                        <i className="fa-solid fa-calendar-days" />
                        {formattedDate}
                    </Link>
                    <Link to={`/blog/${blog.id}`}>
                        <img src="/assets/img/icon/map.svg" alt="" />
                        {blog.category || 'Travel'}
                    </Link>
                </div>
                <h2 className="blog-title">
                    <Link to={`/blog/${blog.id}`}>
                        {blog.title}
                    </Link>
                </h2>
                <p className="blog-text">
                    {blog.short_description}
                </p>
                <div className="mt-4">
                    <Link to={`/blog/${blog.id}`} className="th-btn style4 th-icon">
                        Read More
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BlogPost;
