import { Network as NetworkIcon, Plus, Globe, Wifi } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import './Networks.css';

const Networks = () => {
    const networks = [
        { id: 1, name: 'Freelancer Network India', members: 1234, connections: 567, status: 'Connected' },
        { id: 2, name: 'Tech Professionals', members: 890, connections: 234, status: 'Connected' },
        { id: 3, name: 'Design Community', members: 456, connections: 123, status: 'Pending' }
    ];

    return (
        <div className="networks-page">
            <div className="page-header">
                <div>
                    <h1>Networks</h1>
                    <p>Manage your professional networks</p>
                </div>
                <Button variant="primary">
                    <Plus size={20} />
                    Join Network
                </Button>
            </div>

            <div className="networks-grid">
                {networks.map(network => (
                    <Card key={network.id} className="network-card">
                        <div className="network-icon">
                            <Globe size={32} />
                        </div>
                        <h3>{network.name}</h3>
                        <div className="network-stats">
                            <div className="stat-item">
                                <NetworkIcon size={16} />
                                <span>{network.members} members</span>
                            </div>
                            <div className="stat-item">
                                <Wifi size={16} />
                                <span>{network.connections} connections</span>
                            </div>
                        </div>
                        <span className={`network-status ${network.status.toLowerCase()}`}>
                            {network.status}
                        </span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Networks;
