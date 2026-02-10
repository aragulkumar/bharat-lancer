import { useState } from 'react';
import { Users as UsersIcon, Search, Mail, Phone } from 'lucide-react';
import Card from '../components/Card';
import './Users.css';

const Users = () => {
    const [users] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'freelancer', phone: '+91 98765 43210', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'employer', phone: '+91 98765 43211', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'freelancer', phone: '+91 98765 43212', status: 'inactive' }
    ]);

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1>Users</h1>
                    <p>Manage platform users</p>
                </div>
            </div>

            <div className="search-box">
                <Search size={20} />
                <input type="text" placeholder="Search users..." />
            </div>

            <div className="users-grid">
                {users.map(user => (
                    <Card key={user.id} className="user-card">
                        <div className="user-avatar-large">
                            {user.name.charAt(0)}
                        </div>
                        <h3>{user.name}</h3>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                        <div className="user-details">
                            <div className="detail-item">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                            <div className="detail-item">
                                <Phone size={16} />
                                <span>{user.phone}</span>
                            </div>
                        </div>
                        <span className={`status-indicator ${user.status}`}>{user.status}</span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Users;
