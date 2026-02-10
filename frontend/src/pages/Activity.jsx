import { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Briefcase, FileText, MessageSquare, User } from 'lucide-react';
import './Activity.css';

const Activity = () => {
    const [filter, setFilter] = useState('all');

    // Mock activity data
    const activities = [
        {
            id: 1,
            type: 'application',
            icon: <Briefcase size={20} />,
            title: 'Application Submitted',
            description: 'You applied for "Full Stack Developer" position',
            time: '2 hours ago',
            status: 'pending',
            color: '#3B82F6'
        },
        {
            id: 2,
            type: 'message',
            icon: <MessageSquare size={20} />,
            title: 'New Message',
            description: 'Ragul Kumar sent you a message about the project',
            time: '5 hours ago',
            status: 'unread',
            color: '#8B5CF6'
        },
        {
            id: 3,
            type: 'job',
            icon: <FileText size={20} />,
            title: 'Job Posted',
            description: 'Your job "React Developer Needed" was published',
            time: '1 day ago',
            status: 'success',
            color: '#10B981'
        },
        {
            id: 4,
            type: 'application',
            icon: <CheckCircle size={20} />,
            title: 'Application Accepted',
            description: 'Your application for "UI/UX Designer" was accepted',
            time: '2 days ago',
            status: 'success',
            color: '#10B981'
        },
        {
            id: 5,
            type: 'application',
            icon: <XCircle size={20} />,
            title: 'Application Rejected',
            description: 'Your application for "Backend Developer" was not selected',
            time: '3 days ago',
            status: 'rejected',
            color: '#EF4444'
        },
        {
            id: 6,
            type: 'profile',
            icon: <User size={20} />,
            title: 'Profile Updated',
            description: 'You updated your profile information',
            time: '4 days ago',
            status: 'info',
            color: '#6B7280'
        },
        {
            id: 7,
            type: 'message',
            icon: <MessageSquare size={20} />,
            title: 'New Message',
            description: 'Jane Smith replied to your proposal',
            time: '5 days ago',
            status: 'read',
            color: '#8B5CF6'
        },
        {
            id: 8,
            type: 'job',
            icon: <AlertCircle size={20} />,
            title: 'Job Expired',
            description: 'Your job posting "Python Developer" has expired',
            time: '1 week ago',
            status: 'warning',
            color: '#F59E0B'
        }
    ];

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(activity => activity.type === filter);

    return (
        <div className="activity-page">
            <div className="activity-header">
                <div>
                    <h1>Activity</h1>
                    <p>Track all your recent activities and updates</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="activity-filters">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All Activity
                </button>
                <button
                    className={`filter-tab ${filter === 'application' ? 'active' : ''}`}
                    onClick={() => setFilter('application')}
                >
                    Applications
                </button>
                <button
                    className={`filter-tab ${filter === 'message' ? 'active' : ''}`}
                    onClick={() => setFilter('message')}
                >
                    Messages
                </button>
                <button
                    className={`filter-tab ${filter === 'job' ? 'active' : ''}`}
                    onClick={() => setFilter('job')}
                >
                    Jobs
                </button>
                <button
                    className={`filter-tab ${filter === 'profile' ? 'active' : ''}`}
                    onClick={() => setFilter('profile')}
                >
                    Profile
                </button>
            </div>

            {/* Activity Timeline */}
            <div className="activity-timeline">
                {filteredActivities.map((activity) => (
                    <div key={activity.id} className="activity-item">
                        <div className="activity-icon" style={{ background: `${activity.color}15`, color: activity.color }}>
                            {activity.icon}
                        </div>
                        <div className="activity-content">
                            <div className="activity-header-row">
                                <h3>{activity.title}</h3>
                                <span className="activity-time">
                                    <Clock size={14} />
                                    {activity.time}
                                </span>
                            </div>
                            <p>{activity.description}</p>
                            <div className="activity-footer">
                                <span className={`activity-status status-${activity.status}`}>
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredActivities.length === 0 && (
                <div className="no-activity">
                    <AlertCircle size={48} />
                    <h3>No activities found</h3>
                    <p>Try changing the filter to see more activities</p>
                </div>
            )}
        </div>
    );
};

export default Activity;
