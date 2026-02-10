import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Home, Activity, CheckSquare, Users as UsersIcon, Bell,
    Settings, FileText, HelpCircle, Radio, Zap, Network,
    ChevronLeft, ChevronRight, ChevronDown, Moon, Sun, MoreHorizontal, LogOut, User
} from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar Component
 * Main navigation sidebar with collapsible menu
 */

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState(['activity']);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleExpand = (itemId) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    // Menu structure matching reference
    const menuSections = [
        {
            id: 'main',
            label: 'MENU',
            items: [
                {
                    id: 'home',
                    path: '/jobs',
                    icon: <Home size={20} />,
                    label: 'Home'
                },
                {
                    id: 'activity',
                    path: '/activity',
                    icon: <Activity size={20} />,
                    label: 'Activity',
                    expandable: true
                },
                {
                    id: 'task',
                    path: '/tasks',
                    icon: <CheckSquare size={20} />,
                    label: 'Task'
                },
                {
                    id: 'users',
                    path: '/users',
                    icon: <UsersIcon size={20} />,
                    label: 'Users'
                },
                {
                    id: 'notification',
                    path: '/notifications',
                    icon: <Bell size={20} />,
                    label: 'Notification'
                }
            ]
        },
        {
            id: 'settings',
            divider: true,
            items: [
                {
                    id: 'settings',
                    path: '/settings',
                    icon: <Settings size={20} />,
                    label: 'Settings'
                },
                {
                    id: 'report',
                    path: '/reports',
                    icon: <FileText size={20} />,
                    label: 'Report'
                },
                {
                    id: 'support',
                    path: '/support',
                    icon: <HelpCircle size={20} />,
                    label: 'Support'
                }
            ]
        },
        {
            id: 'channels',
            divider: true,
            items: [
                {
                    id: 'channels',
                    path: '/channels',
                    icon: <Radio size={20} />,
                    label: 'Channels',
                    badge: 5
                },
                {
                    id: 'autotrack',
                    path: '/autotrack',
                    icon: <Zap size={20} />,
                    label: 'Autotrack',
                    statusBadge: 'Active'
                },
                {
                    id: 'networks',
                    path: '/networks',
                    icon: <Network size={20} />,
                    label: 'Networks',
                    badge: 3
                }
            ]
        }
    ];

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <div className="sidebar-brand">
                    <div className="brand-icon">BL</div>
                    {!collapsed && <span className="brand-text">Bharat Lancer</span>}
                </div>
                <button
                    className="collapse-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation Sections */}
            <div className="sidebar-content">
                {menuSections.map((section, sectionIndex) => (
                    <div key={section.id}>
                        {/* Section Label */}
                        {section.label && !collapsed && (
                            <div className="menu-label">{section.label}</div>
                        )}

                        {/* Divider */}
                        {section.divider && !collapsed && (
                            <div className="menu-divider"></div>
                        )}

                        {/* Menu Items */}
                        <nav className="sidebar-nav">
                            {section.items.map((item) => (
                                <div key={item.id}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `nav-item ${isActive ? 'active' : ''}`
                                        }
                                        title={collapsed ? item.label : ''}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        {!collapsed && (
                                            <>
                                                <span className="nav-label">{item.label}</span>
                                                {item.badge && (
                                                    <span className="nav-badge">{item.badge}</span>
                                                )}
                                                {item.statusBadge && (
                                                    <span className="status-badge active">{item.statusBadge}</span>
                                                )}
                                                {item.expandable && (
                                                    <button
                                                        className="expand-btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleExpand(item.id);
                                                        }}
                                                    >
                                                        {expandedItems.includes(item.id) ? (
                                                            <ChevronDown size={16} />
                                                        ) : (
                                                            <ChevronRight size={16} />
                                                        )}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </div>
                            ))}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Theme Switcher */}
            {!collapsed && (
                <div className="theme-switcher">
                    <button
                        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => theme !== 'dark' && toggleTheme()}
                    >
                        <Moon size={16} />
                        <span>Dark</span>
                    </button>
                    <button
                        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => theme !== 'light' && toggleTheme()}
                    >
                        <Sun size={16} />
                        <span>Light</span>
                    </button>
                </div>
            )}

            {/* User Profile */}
            <div className="sidebar-user">
                <div
                    className="user-profile-section"
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                    <div className="user-avatar">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    {!collapsed && (
                        <div className="user-info">
                            <div className="user-name">{user?.name || 'Alexander'}</div>
                            <div className="user-email">{user?.email || 'alex@zemlya.com'}</div>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <div className="user-menu-container">
                        <button
                            className="user-menu-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowProfileMenu(!showProfileMenu);
                            }}
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate('/profile');
                                        setShowProfileMenu(false);
                                    }}
                                >
                                    <User size={16} />
                                    <span>Edit Profile</span>
                                </button>
                                <button
                                    className="dropdown-item logout"
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                        setShowProfileMenu(false);
                                    }}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
