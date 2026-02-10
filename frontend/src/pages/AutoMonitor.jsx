import { Zap, Activity, TrendingUp, Clock } from 'lucide-react';
import Card from '../components/Card';
import './AutoMonitor.css';

const AutoMonitor = () => {
    const trackingData = [
        { id: 1, activity: 'Job Application Submitted', time: '2 hours ago', status: 'Tracked' },
        { id: 2, activity: 'Profile Updated', time: '5 hours ago', status: 'Tracked' },
        { id: 3, activity: 'Message Sent', time: '1 day ago', status: 'Tracked' }
    ];

    return (
        <div className="automonitor-page">
            <div className="page-header">
                <div>
                    <h1>Autotrack</h1>
                    <p>Automatic activity tracking and monitoring</p>
                </div>
                <span className="active-badge">
                    <span className="pulse-dot"></span>
                    Active
                </span>
            </div>

            <div className="tracking-stats">
                <Card className="stat-card">
                    <Activity size={32} />
                    <h3>156</h3>
                    <p>Activities Tracked</p>
                </Card>
                <Card className="stat-card">
                    <TrendingUp size={32} />
                    <h3>89%</h3>
                    <p>Tracking Accuracy</p>
                </Card>
                <Card className="stat-card">
                    <Clock size={32} />
                    <h3>24/7</h3>
                    <p>Monitoring</p>
                </Card>
            </div>

            <Card className="tracking-timeline">
                <h2>Recent Activity</h2>
                <div className="timeline">
                    {trackingData.map(item => (
                        <div key={item.id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h4>{item.activity}</h4>
                                <div className="timeline-meta">
                                    <span className="time">{item.time}</span>
                                    <span className="status-badge tracked">{item.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AutoMonitor;
