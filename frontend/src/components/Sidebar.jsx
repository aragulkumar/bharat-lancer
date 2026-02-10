import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase,
    FileText,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        {
            path: '/jobs',
            icon: <Briefcase size={20} />,
            label: 'Jobs',
            roles: ['employer', 'freelancer']
        },
        {
            path: '/applications',
            icon: <FileText size={20} />,
            label: 'Applications',
            roles: ['employer', 'freelancer']
        },
        {
            path: '/chat',
            icon: <MessageSquare size={20} />,
            label: 'Messages',
            roles: ['employer', 'freelancer']
        },
        {
            path: '/profile',
            icon: <User size={20} />,
            label: 'Profile',
            roles: ['employer', 'freelancer']
        }
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role)
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-button"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                {/* Sidebar Header */}
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <div className="brand-icon">BL</div>
                        {!collapsed && <span className="brand-text">Bharat Lancer</span>}
                    </div>
                    <button
                        className="collapse-button desktop-only"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Search Bar */}
                {!collapsed && (
                    <div className="sidebar-search">
                        <input type="text" placeholder="Search..." />
                    </div>
                )}

                {/* Menu Label */}
                {!collapsed && <div className="menu-label">MENU</div>}

                {/* User Profile */}
                <div className="sidebar-user">
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="user-info">
                            <div className="user-name">{user?.name}</div>
                            <div className="user-role">{user?.role}</div>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    {filteredMenuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? 'active' : ''}`
                            }
                            onClick={() => setMobileOpen(false)}
                            title={collapsed ? item.label : ''}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="sidebar-footer">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : ''}
                    >
                        <span className="nav-icon"><LogOut size={20} /></span>
                        {!collapsed && <span className="nav-label">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
