import { Usercontext } from "../contexts/Usercontext";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const BASE_URL = "https://api-backend-ool6.onrender.com";

export default function Header() {
    const loggedData = useContext(Usercontext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Fetch user details when component mounts
    useEffect(() => {
        console.log('Current logged user data:', loggedData.loggedUser);
        async function fetchUserDetails() {
            if (loggedData.loggedUser?.userid || loggedData.loggedUser?._id) {
                try {
                    const userId = loggedData.loggedUser.userid || loggedData.loggedUser._id;
                    console.log('Fetching user details for ID:', userId);
                    
                    const response = await fetch(`${BASE_URL}/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${loggedData.loggedUser.token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log('Response status:', response.status);
                    const userData = await response.json();
                    console.log('Fetched user data:', userData);
                    
                    if (response.ok && userData) {
                        // Update the user data in context and localStorage
                        const updatedUserData = {
                            ...loggedData.loggedUser,
                            name: userData.name || userData.username,
                            email: userData.email,
                            age: userData.age
                        };
                        console.log('Updating with:', updatedUserData);
                        localStorage.setItem('nutrify-user', JSON.stringify(updatedUserData));
                        loggedData.setLoggedUser(updatedUserData);
                    } else {
                        console.error('Failed to fetch user details:', userData);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                console.log('No user ID found in logged data:', loggedData.loggedUser);
            }
        }

        if (loggedData.loggedUser?.token) {
            console.log('Starting user details fetch...');
            fetchUserDetails();
        }
    }, [loggedData.loggedUser?.userid, loggedData.loggedUser?._id]);

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