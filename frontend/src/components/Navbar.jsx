import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, MessageSquare, Award, Plus, ChevronDown, Bell, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationsAPI } from '../services/api';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, logout, isAuthenticated, isFreelancer, isEmployer } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const [notifResponse, countResponse] = await Promise.all([
                notificationsAPI.getAll(),
                notificationsAPI.getUnreadCount()
            ]);
            setNotifications(notifResponse.data.data.notifications.slice(0, 5));
            setUnreadCount(countResponse.data.data.count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'application': return '📝';
            case 'skill_match': return '✨';
            case 'contact': return '💼';
            case 'message': return '💬';
            default: return '🔔';
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <span className="gradient-text">Bharat Lancer</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="navbar-menu desktop">
                        {isAuthenticated ? (
                            <>
                                <div className="nav-links">
                                    <Link to="/jobs" className="nav-link">
                                        <Briefcase size={18} />
                                        Jobs
                                    </Link>

                                    {isFreelancer && (
                                        <Link to="/skill-passport" className="nav-link">
                                            <Award size={18} />
                                            Skill Passport
                                        </Link>
                                    )}

                                    {isEmployer && (
                                        <Link to="/create-job" className="nav-link">
                                            <Plus size={18} />
                                            Post Job
                                        </Link>
                                    )}

                                    <Link to="/chat" className="nav-link">
                                        <MessageSquare size={18} />
                                        Chat
                                    </Link>
                                </div>

                                <div className="nav-user">
                                    {/* Notification Bell */}
                                    <div className="notification-wrapper">
                                        <button
                                            className="notification-bell"
                                            onClick={() => setShowNotifications(!showNotifications)}
                                        >
                                            <Bell size={20} />
                                            {unreadCount > 0 && (
                                                <span className="notification-badge">{unreadCount}</span>
                                            )}
                                        </button>

                                        {showNotifications && (
                                            <div className="notification-dropdown">
                                                <div className="notification-header">
                                                    <h4>Notifications</h4>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            className="mark-all-read"
                                                            onClick={handleMarkAllAsRead}
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="notification-list">
                                                    {notifications.length === 0 ? (
                                                        <div className="no-notifications">
                                                            <Bell size={32} />
                                                            <p>No notifications yet</p>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div
                                                                key={notif._id}
                                                                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                                                onClick={() => {
                                                                    if (!notif.read) handleMarkAsRead(notif._id);
                                                                    if (notif.relatedJob) navigate(`/jobs/${notif.relatedJob._id}`);
                                                                    setShowNotifications(false);
                                                                }}
                                                            >
                                                                <span className="notif-icon">{getNotificationIcon(notif.type)}</span>
                                                                <div className="notif-content">
                                                                    <p className="notif-title">{notif.title}</p>
                                                                    <p className="notif-message">{notif.message}</p>
                                                                    <span className="notif-time">{getTimeAgo(notif.createdAt)}</span>
                                                                </div>
                                                                {!notif.read && <span className="unread-dot"></span>}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Theme Toggle */}
                                    <button
                                        className="theme-toggle"
                                        onClick={toggleTheme}
                                        aria-label="Toggle theme"
                                    >
                                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                                    </button>

                                    {/* User Dropdown */}
                                    <button
                                        className="user-button"
                                        onClick={() => setShowDropdown(!showDropdown)}
                                    >
                                        <User size={18} />
                                        <span>{user?.name}</span>
                                        <ChevronDown size={14} className={`chevron ${showDropdown ? 'open' : ''}`} />
                                    </button>

                                    {showDropdown && (
                                        <div className="user-dropdown">
                                            <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                                <User size={16} />
                                                Edit Profile
                                            </Link>
                                            <button className="dropdown-item logout" onClick={handleLogout}>
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" size="sm">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="navbar-toggle mobile"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="navbar-mobile mobile">
                        {isAuthenticated ? (
                            <>
                                <Link to="/jobs" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    <Briefcase size={20} />
                                    Jobs
                                </Link>

                                {isFreelancer && (
                                    <Link to="/skill-passport" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <Award size={20} />
                                        Skill Passport
                                    </Link>
                                )}

                                {isEmployer && (
                                    <Link to="/create-job" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <Plus size={20} />
                                        Post Job
                                    </Link>
                                )}

                                <Link to="/chat" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    <MessageSquare size={20} />
                                    Chat
                                </Link>

                                <Link to="/profile" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    <User size={20} />
                                    Edit Profile
                                </Link>

                                <div className="mobile-user">
                                    <span>{user?.name}</span>
                                    <Button variant="outline" size="sm" fullWidth onClick={() => { handleLogout(); setIsOpen(false); }}>
                                        <LogOut size={18} />
                                        Logout
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" size="md" fullWidth>Login</Button>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" size="md" fullWidth>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
