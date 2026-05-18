import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const sliderImages = [
    {
        src: "/assets/img/loginslider/slider1.jpg",
        caption: "Discover Incredible Destinations",
        sub: "Your journey begins with us"
    },
    {
        src: "/assets/img/loginslider/slider2.jpg",
        caption: "Sail the World in Luxury",
        sub: "Premium cruise experiences await"
    },
    {
        src: "/assets/img/loginslider/slider3.jpg",
        caption: "Creating Memories That Last Forever",
        sub: "Let Fremor plan your perfect trip"
    }
];

function LoginForm({ isOpen, onClose }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

    // Form states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [regFirstName, setRegFirstName] = useState("");
    const [regLastName, setRegLastName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // OTP Flow states
    const [showOtpFlow, setShowOtpFlow] = useState(false);
    const [otpToken, setOtpToken] = useState("");

    // Auth Actions
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: loginEmail,
                password: loginPassword,
            });
            if (error) throw error;
            onClose();
            navigate("/"); // Redirect to home
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (regPassword !== regConfirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: regEmail,
                password: regPassword,
                options: {
                    data: {
                        first_name: regFirstName,
                        last_name: regLastName,
                        phone: regPhone,
                    }
                }
            });
            if (error) throw error;
            setShowOtpFlow(true);
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                email: regEmail,
                token: otpToken,
                type: 'signup'
            });
            if (error) throw error;
            setShowOtpFlow(false);
            onClose();
            navigate("/"); // Redirect to home
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleAuth = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    // Auto-advance slider
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % sliderImages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [isOpen]);

    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const slide = sliderImages[currentSlide];

    return (
        <div
            id="login-form"
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.65)",
                zIndex: 99999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "16px",
                backdropFilter: "blur(4px)"
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                display: "flex",
                width: "100%",
                maxWidth: "880px",
                maxHeight: "95vh",
                boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                position: "relative"
            }}>
                {/* ── LEFT PANEL: Image Slider ── */}
                <div style={{
                    flex: "0 0 42%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    minHeight: "520px"
                }} className="d-none d-md-flex">
                    {/* Slide image */}
                    <img
                        key={currentSlide}
                        src={slide.src}
                        alt={slide.caption}
                        style={{
                            position: "absolute", inset: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            transition: "opacity 0.6s ease",
                        }}
                    />
                    {/* Dark overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.05) 100%)"
                    }} />

                    {/* Caption */}
                    <div style={{ position: "absolute", bottom: "60px", left: "24px", right: "24px" }}>
                        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "22px", lineHeight: 1.3, marginBottom: "6px" }}>
                            {slide.caption}
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0 }}>{slide.sub}</p>
                    </div>

                    {/* Dot indicators */}
                    <div style={{
                        position: "absolute", bottom: "24px", left: "24px",
                        display: "flex", gap: "8px"
                    }}>
                        {sliderImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                style={{
                                    width: i === currentSlide ? "22px" : "8px",
                                    height: "8px",
                                    borderRadius: "4px",
                                    background: i === currentSlide ? "var(--theme-color, #e74c3c)" : "rgba(255,255,255,0.5)",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    transition: "all 0.3s ease"
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ── RIGHT PANEL: Form ── */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    padding: "40px 36px 32px",
                    overflowY: "auto"
                }}>
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute", top: "16px", right: "16px",
                            background: "rgba(0,0,0,0.08)", border: "none",
                            width: "36px", height: "36px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", fontSize: "16px", color: "#555",
                            transition: "background 0.2s"
                        }}
                        aria-label="Close"
                    >
                        <i className="far fa-times" />
                    </button>

                    {/* Brand Logo */}
                    <div style={{ textAlign: "center", marginBottom: "16px" }}>
                        <img
                            src="/assets/img/logo/FremorLogo.png"
                            alt="Fremor"
                            style={{ maxHeight: "52px", objectFit: "contain" }}
                        />
                    </div>

                    {errorMsg && (
                        <div style={{ background: "#fde8e8", color: "#c53030", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", textAlign: "center", border: "1px solid #f8b4b4" }}>
                            {errorMsg}
                        </div>
                    )}

                    {!showOtpFlow && (
                        <div style={{
                            display: "flex",
                            background: "#f3f4f6",
                            borderRadius: "12px",
                            padding: "4px",
                            marginBottom: "28px"
                        }}>
                            {["login", "register"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setErrorMsg(""); }}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        borderRadius: "9px",
                                        border: "none",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        transition: "all 0.25s ease",
                                        background: activeTab === tab ? "#fff" : "transparent",
                                        color: activeTab === tab ? "var(--theme-color, #e74c3c)" : "#888",
                                        boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
                                    }}
                                >
                                    {tab === "login" ? "Login" : "Create Account"}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── LOGIN FORM ── */}
                    {activeTab === "login" && !showOtpFlow && (
                        <form onSubmit={handleLogin}>
                            <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px", textAlign: "center" }}>
                                Welcome back! Sign in to continue.
                            </p>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="you@example.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px" }}
                                    required
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>
                                    Password
                                </label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter your password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px", paddingRight: "40px" }}
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        style={{
                                            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", color: "#888", cursor: "pointer", padding: 0
                                        }}
                                    >
                                        <i className={`fa-regular ${showLoginPassword ? "fa-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ textAlign: "right", marginBottom: "20px" }}>
                                <a href="#" style={{ fontSize: "13px", color: "var(--theme-color, #e74c3c)", textDecoration: "none" }}>
                                    Forgot password?
                                </a>
                            </div>
                            <button
                                type="submit"
                                className="th-btn btn-fw"
                                disabled={isSubmitting}
                                style={{ borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: 700, width: "100%", marginBottom: "20px" }}
                            >
                                {isSubmitting ? "Signing In..." : "Sign In"} <i className="fa-regular fa-arrow-right ms-2" />
                            </button>

                            <div style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>
                                — Or continue with —
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                                <button type="button" onClick={handleGoogleAuth} style={{
                                    flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #e0e0e0",
                                    background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px", fontWeight: 600, fontSize: "14px", color: "#333", width: "100%"
                                }}>
                                    <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: "18px" }} /> Continue with Google
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ── REGISTER FORM ── */}
                    {activeTab === "register" && !showOtpFlow && (
                        <form onSubmit={handleRegister}>
                            <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px", textAlign: "center" }}>
                                Join Fremor and start exploring the world!
                            </p>
                            <div style={{ display: "flex", gap: "12px", marginBottom: "0px" }}>
                                <div className="form-group mb-3" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>First Name</label>
                                    <input type="text" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} className="form-control" placeholder="John" style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px" }} required />
                                </div>
                                <div className="form-group mb-3" style={{ flex: 1 }}>
                                    <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>Last Name</label>
                                    <input type="text" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} className="form-control" placeholder="Doe" style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px" }} required />
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>Email Address</label>
                                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="form-control" placeholder="you@example.com" style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px" }} required />
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>Phone Number</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "6px",
                                        border: "1px solid #dee2e6", borderRadius: "10px",
                                        padding: "0 12px", background: "#f8f9fa",
                                        flexShrink: 0, fontSize: "14px", color: "#333", fontWeight: 600
                                    }}>
                                        🇮🇳 +91
                                    </div>
                                    <input
                                        type="tel"
                                        value={regPhone}
                                        onChange={(e) => setRegPhone(e.target.value)}
                                        className="form-control"
                                        placeholder="Enter mobile number"
                                        maxLength={10}
                                        style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px" }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>Password</label>
                                <div style={{ position: "relative" }}>
                                    <input 
                                        type={showRegisterPassword ? "text" : "password"} 
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        className="form-control" 
                                        placeholder="Create a strong password" 
                                        style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px", paddingRight: "40px" }} 
                                        required 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                        style={{
                                            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", color: "#888", cursor: "pointer", padding: 0
                                        }}
                                    >
                                        <i className={`fa-regular ${showRegisterPassword ? "fa-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <label style={{ fontWeight: 600, fontSize: "13px", color: "#444", marginBottom: "6px", display: "block" }}>Confirm Password</label>
                                <div style={{ position: "relative" }}>
                                    <input 
                                        type={showRegisterConfirmPassword ? "text" : "password"} 
                                        value={regConfirmPassword}
                                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                                        className="form-control" 
                                        placeholder="Repeat your password" 
                                        style={{ borderRadius: "10px", padding: "12px 14px", fontSize: "14px", paddingRight: "40px" }} 
                                        required 
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                                        style={{
                                            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                            background: "none", border: "none", color: "#888", cursor: "pointer", padding: 0
                                        }}
                                    >
                                        <i className={`fa-regular ${showRegisterConfirmPassword ? "fa-slash" : "fa-eye"}`} />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="th-btn btn-fw"
                                disabled={isSubmitting}
                                style={{ borderRadius: "10px", padding: "13px", fontSize: "15px", fontWeight: 700, width: "100%", marginBottom: "14px", marginTop: "6px" }}
                            >
                                {isSubmitting ? "Creating Account..." : "Create Account"} <i className="fa-solid fa-user-plus ms-2" />
                            </button>

                            <div style={{ textAlign: "center", color: "#aaa", fontSize: "13px", marginBottom: "16px" }}>
                                — Or continue with —
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                                <button type="button" onClick={handleGoogleAuth} style={{
                                    flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #e0e0e0",
                                    background: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: "8px", fontWeight: 600, fontSize: "14px", color: "#333", width: "100%"
                                }}>
                                    <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: "18px" }} /> Continue with Google
                                </button>
                            </div>
                        </form>
                    )}

                    <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "auto", paddingTop: "12px" }}>
                        By continuing, you agree to Fremor's{" "}
                        <a href="#" style={{ color: "var(--theme-color, #e74c3c)" }}>Privacy Policy</a> and{" "}
                        <a href="#" style={{ color: "var(--theme-color, #e74c3c)" }}>Terms of Service</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
