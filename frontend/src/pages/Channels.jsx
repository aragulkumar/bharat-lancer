import { Radio, Plus, Users, Hash } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Channels.css';

const Channels = () => {
    const channels = [
        { id: 1, name: 'General', members: 156, unread: 3, active: true },
        { id: 2, name: 'Freelancers', members: 89, unread: 0, active: true },
        { id: 3, name: 'Employers', members: 67, unread: 5, active: true },
        { id: 4, name: 'Announcements', members: 234, unread: 1, active: false },
        { id: 5, name: 'Support', members: 45, unread: 0, active: true }
    ];

    return (
        <div className="channels-page">
            <div className="page-header">
                <div>
                    <h1>Channels</h1>
                    <p>Communication channels for your team</p>
                </div>
                <Button variant="primary">
                    <Plus size={20} />
                    Create Channel
                </Button>
            </div>

            <div className="channels-grid">
                {channels.map(channel => (
                    <Card key={channel.id} className="channel-card">
                        <div className="channel-header">
                            <div className="channel-icon">
                                <Hash size={24} />
                            </div>
                            {channel.unread > 0 && (
                                <span className="unread-badge">{channel.unread}</span>
                            )}
                        </div>
                        <h3>{channel.name}</h3>
                        <div className="channel-meta">
                            <div className="meta-item">
                                <Users size={16} />
                                <span>{channel.members} members</span>
                            </div>
                            <span className={`status-dot ${channel.active ? 'active' : 'inactive'}`}></span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Channels;
