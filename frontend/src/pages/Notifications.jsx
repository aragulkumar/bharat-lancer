import { Bell, Check, X } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Notifications.css';

const Notifications = () => {
    const notifications = [
        { id: 1, type: 'application', title: 'New Application', message: 'John Doe applied for Flutter Food Delivery App', time: '2 hours ago', read: false },
        { id: 2, type: 'message', title: 'New Message', message: 'Jane Smith sent you a message', time: '5 hours ago', read: false },
        { id: 3, type: 'job', title: 'Job Posted', message: 'Your job "Design System Creation" was posted successfully', time: '1 day ago', read: true }
    ];

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your activities</p>
                </div>
                <Button variant="outline">Mark all as read</Button>
            </div>

            <div className="notifications-list">
                {notifications.map(notif => (
                    <Card key={notif.id} className={`notification-card ${notif.read ? 'read' : 'unread'}`}>
                        <div className="notif-icon">
                            <Bell size={20} />
                        </div>
                        <div className="notif-content">
                            <h3>{notif.title}</h3>
                            <p>{notif.message}</p>
                            <span className="notif-time">{notif.time}</span>
                        </div>
                        <div className="notif-actions">
                            <button className="icon-btn success">
                                <Check size={18} />
                            </button>
                            <button className="icon-btn danger">
                                <X size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
