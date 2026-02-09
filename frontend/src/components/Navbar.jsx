import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Briefcase, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <span className="gradient-text">Bharat Lancer</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="navbar-menu desktop">
                        {isAuthenticated ? (
                            <>
                                <Link to="/jobs" className="nav-link">
                                    <Briefcase size={18} />
                                    Jobs
                                </Link>
                                <Link to="/chat" className="nav-link">
                                    <MessageSquare size={18} />
                                    Chat
                                </Link>
                                {user?.role === 'freelancer' && (
                                    <Link to="/skill-passport" className="nav-link">
                                        <User size={18} />
                                        Skill Passport
                                    </Link>
                                )}
                                <div className="nav-user">
                                    <span className="nav-username">{user?.name}</span>
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        <LogOut size={18} />
                                        Logout
                                    </Button>
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
                                <Link to="/chat" className="mobile-link" onClick={() => setIsOpen(false)}>
                                    <MessageSquare size={20} />
                                    Chat
                                </Link>
                                {user?.role === 'freelancer' && (
                                    <Link to="/skill-passport" className="mobile-link" onClick={() => setIsOpen(false)}>
                                        <User size={20} />
                                        Skill Passport
                                    </Link>
                                )}
                                <div className="mobile-user">
                                    <span>{user?.name}</span>
                                    <Button variant="outline" size="sm" fullWidth onClick={handleLogout}>
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
