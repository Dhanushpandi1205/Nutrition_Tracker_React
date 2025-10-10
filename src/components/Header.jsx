import { Usercontext } from "../contexts/Usercontext";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Header() {
    const loggedData = useContext(Usercontext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function logout() {
        localStorage.removeItem("nutrify-user");
        loggedData.setLoggedUser(null);
        navigate("/login");
    }

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="header">
            <div className="logo">
                <span className="logo-text">Nutrify</span>
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
            </div>

            <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <Link 
                    to="/track" 
                    className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-plus-circle"></i>
                    <span>Track Food</span>
                </Link>
                <Link 
                    to="/diet" 
                    className={`nav-link ${location.pathname === '/diet' ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <i className="fas fa-chart-pie"></i>
                    <span>Diet Summary</span>
                </Link>
                <div className="header-profile" ref={profileRef}>
                    <button 
                        className="header-profile-button"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <i className="fas fa-user-circle"></i>
                        <span>Account</span>
                    </button>

                    {isProfileOpen && (
                        <div className="profile-dropdown">
                            <div className="profile-header">
                                <i className="fas fa-user-circle"></i>
                                <div className="profile-info">
                                    <h3>{loggedData.loggedUser?.name || 'User'}</h3>
                                    <p className="profile-email">{loggedData.loggedUser?.email}</p>
                                </div>
                            </div>
                            <div className="profile-details">
                                <div className="profile-section">
                                    <div className="profile-item">
                                        <i className="fas fa-user"></i>
                                        <div className="item-details">
                                            <span className="item-label">Name</span>
                                            <span className="item-value">{loggedData.loggedUser?.name || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <i className="fas fa-envelope"></i>
                                        <div className="item-details">
                                            <span className="item-label">Email</span>
                                            <span className="item-value">{loggedData.loggedUser?.email || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    <div className="profile-item">
                                        <i className="fas fa-birthday-cake"></i>
                                        <div className="item-details">
                                            <span className="item-label">Age</span>
                                            <span className="item-value">{loggedData.loggedUser?.age ? `${loggedData.loggedUser.age} years` : 'Not provided'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="logout-button" onClick={logout}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}  