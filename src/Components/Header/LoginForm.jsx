import React, { useState } from "react";

function LoginForm({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("register"); // State to track active tab

    return (
        <div
            id="login-form"
            className={`popup-login-register ${isOpen ? "show" : ""}`}
            style={{ visibility: isOpen ? "visible" : "hidden" }}
        >
            <div className="form-inner">
                <button className="closeButton sideMenuCls" onClick={onClose} aria-label="Close">
                    <i className="far fa-times" />
                </button>

                {/* Tab Navigation */}
                <ul className="nav" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-menu ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "login"}
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-menu ${activeTab === "register" ? "active" : ""}`}
                            onClick={() => setActiveTab("register")}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "register"}
                        >
                            Register
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Login Tab */}
                    {activeTab === "login" && (
                        <div className="tab-pane fade active show">
                            <h3 className="box-title mb-30">Sign in to your account</h3>
                            <div className="th-login-form">
                                <form className="login-form ajax-contact">
                                    <div className="row">
                                        <div className="form-group col-12">
                                            <label>Username or email</label>
                                            <input type="text" className="form-control" name="email" required />
                                        </div>
                                        <div className="form-group col-12">
                                            <label>Password</label>
                                            <input type="password" className="form-control" name="password" required />
                                        </div>
                                        <div className="form-btn mb-20 col-12">
                                            <button className="th-btn btn-fw th-radius2">Send Message</button>
                                        </div>
                                    </div>
                                    <div id="forgot_url">
                                        <a href="#">Forgot password?</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Register Tab */}
                    {activeTab === "register" && (
                        <div className="tab-pane fade active show">
                            <h3 className="th-form-title mb-30">Create a new account</h3>
                            <form className="login-form ajax-contact">
                                <div className="row">
                                    <div className="form-group col-12">
                                        <label>Username*</label>
                                        <input type="text" className="form-control" name="username" required />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>First name*</label>
                                        <input type="text" className="form-control" name="firstname" required />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Last name*</label>
                                        <input type="text" className="form-control" name="lastname" required />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Your email*</label>
                                        <input type="email" className="form-control" name="new_email" required />
                                    </div>
                                    <div className="form-group col-12">
                                        <label>Confirm email*</label>
                                        <input type="email" className="form-control" name="new_email_confirm" required />
                                    </div>
                                    <div className="statement">
                                        <span className="register-notes">A password will be emailed to you.</span>
                                    </div>
                                    <div className="form-btn mt-20 col-12">
                                        <button type="submit" className="th-btn btn-fw th-radius2">Sign up</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
