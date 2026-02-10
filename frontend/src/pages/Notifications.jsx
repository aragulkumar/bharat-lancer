import { useState } from 'react';
import { Bell, Check, X, MessageSquare } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'application', title: 'New Application', message: 'John Doe applied for Flutter Food Delivery App', time: '2 hours ago', read: false, actionable: true },
        { id: 2, type: 'message', title: 'New Message', message: 'Jane Smith sent you a message', time: '5 hours ago', read: false, actionable: false },
        { id: 3, type: 'job', title: 'Job Posted', message: 'Your job "Design System Creation" was posted successfully', time: '1 day ago', read: true, actionable: false }
    ]);

    const [showNoteModal, setShowNoteModal] = useState(false);
    const [currentAction, setCurrentAction] = useState(null);
    const [note, setNote] = useState('');

    const handleAccept = (notifId) => {
        setCurrentAction({ id: notifId, type: 'accept' });
        setShowNoteModal(true);
    };

    const handleReject = (notifId) => {
        setCurrentAction({ id: notifId, type: 'reject' });
        setShowNoteModal(true);
    };

    const submitAction = () => {
        if (!currentAction) return;

        const { id, type } = currentAction;
        const notif = notifications.find(n => n.id === id);

        console.log(`${type === 'accept' ? 'Accepted' : 'Rejected'} notification:`, notif.title);
        console.log('Note:', note);

        // Remove the notification after action
        setNotifications(prev => prev.filter(n => n.id !== id));

        // Reset modal
        setShowNoteModal(false);
        setCurrentAction(null);
        setNote('');
    };

    const cancelAction = () => {
        setShowNoteModal(false);
        setCurrentAction(null);
        setNote('');
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div>
                    <h1>Notifications</h1>
                    <p>Stay updated with your activities</p>
                </div>
                <Button variant="outline" onClick={markAllAsRead}>Mark all as read</Button>
            </div>

            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <Card className="empty-state">
                        <Bell size={48} />
                        <h3>No notifications</h3>
                        <p>You're all caught up!</p>
                    </Card>
                ) : (
                    notifications.map(notif => (
                        <Card key={notif.id} className={`notification-card ${notif.read ? 'read' : 'unread'}`}>
                            <div className="notif-icon">
                                <Bell size={20} />
                            </div>
                            <div className="notif-content">
                                <h3>{notif.title}</h3>
                                <p>{notif.message}</p>
                                <span className="notif-time">{notif.time}</span>
                            </div>
                            {notif.actionable && (
                                <div className="notif-actions">
                                    <button
                                        className="icon-btn success"
                                        onClick={() => handleAccept(notif.id)}
                                        title="Accept"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        className="icon-btn danger"
                                        onClick={() => handleReject(notif.id)}
                                        title="Reject"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay" onClick={cancelAction}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {currentAction?.type === 'accept' ? 'Accept' : 'Reject'} Application
                            </h2>
                            <button className="modal-close" onClick={cancelAction}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>
                                    <MessageSquare size={18} />
                                    Add a note (optional)
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder={
                                        currentAction?.type === 'accept'
                                            ? 'e.g., Great portfolio! Looking forward to working with you.'
                                            : 'e.g., Thank you for applying. We found a better match for this project.'
                                    }
                                    rows={4}
                                    className="note-textarea"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button variant="outline" onClick={cancelAction}>
                                Cancel
                            </Button>
                            <Button
                                variant={currentAction?.type === 'accept' ? 'primary' : 'danger'}
                                onClick={submitAction}
                            >
                                {currentAction?.type === 'accept' ? 'Accept' : 'Reject'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
