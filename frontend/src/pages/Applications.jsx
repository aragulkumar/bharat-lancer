import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, MessageCircle, Clock, DollarSign } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './Applications.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const { isEmployer } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isEmployer) {
            navigate('/jobs');
            return;
        }
        fetchApplications();
    }, [isEmployer, navigate]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await jobsAPI.getAll();
            const myJobs = response.data.data.jobs;

            // Flatten all applications from all jobs
            const allApps = [];
            myJobs.forEach(job => {
                if (job.applications && job.applications.length > 0) {
                    job.applications.forEach(app => {
                        allApps.push({
                            ...app,
                            jobId: job._id,
                            jobTitle: job.title,
                            jobBudget: job.budget
                        });
                    });
                }
            });

            // Sort by most recent
            allApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
            setApplications(allApps);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (jobId, applicationId, status) => {
        try {
            await jobsAPI.updateApplicationStatus(jobId, applicationId, {
                status,
                message: replyMessage
            });

            alert(`Application ${status}!`);
            setReplyMessage('');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update application status');
        }
    };

    const handleStartChat = async (freelancerId, freelancerName) => {
        try {
            // Navigate to chat with this freelancer
            navigate(`/chat?userId=${freelancerId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'status-pending', text: 'Pending' },
            accepted: { class: 'status-accepted', text: 'Accepted' },
            rejected: { class: 'status-rejected', text: 'Rejected' }
        };
        const badge = badges[status] || badges.pending;
        return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading">Loading applications...</div>;
    }

    return (
        <div className="applications-page">
            <div className="applications-header">
                <h1>Job Applications</h1>
                <p>{applications.length} total applications</p>
            </div>

            {applications.length === 0 ? (
                <Card className="empty-state">
                    <p>No applications yet. Your job posts will appear here when freelancers apply.</p>
                </Card>
            ) : (
                <div className="applications-grid">
                    {applications.map((app) => (
                        <Card key={app._id} className="application-card">
                            <div className="app-header">
                                <div className="freelancer-info">
                                    <div className="freelancer-avatar">
                                        {app.freelancer?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3>{app.freelancer?.name}</h3>
                                        <p className="freelancer-email">{app.freelancer?.email}</p>
                                    </div>
                                </div>
                                {getStatusBadge(app.status)}
                            </div>

                            <div className="job-info">
                                <h4>{app.jobTitle}</h4>
                                <div className="app-meta">
                                    <span><Clock size={16} /> {formatDate(app.appliedAt)}</span>
                                    <span><DollarSign size={16} /> ₹{app.proposedRate?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <div className="cover-letter">
                                <strong>Cover Letter:</strong>
                                <p>{app.coverLetter}</p>
                            </div>

                            <div className="app-details">
                                <p><strong>Estimated Duration:</strong> {app.estimatedDuration}</p>
                            </div>

                            {app.status === 'pending' && (
                                <div className="app-actions">
                                    {selectedApp === app._id ? (
                                        <div className="reply-section">
                                            <textarea
                                                placeholder="Add a message (optional)"
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                rows={3}
                                            />
                                            <div className="action-buttons">
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleStatusUpdate(app.jobId, app._id, 'accepted')}
                                                >
                                                    <CheckCircle size={18} />
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleStatusUpdate(app.jobId, app._id, 'rejected')}
                                                >
                                                    <XCircle size={18} />
                                                    Reject
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => {
                                                        setSelectedApp(null);
                                                        setReplyMessage('');
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            onClick={() => setSelectedApp(app._id)}
                                        >
                                            Review Application
                                        </Button>
                                    )}
                                </div>
                            )}

                            {app.employerMessage && (
                                <div className="employer-message">
                                    <strong>Your Response:</strong>
                                    <p>{app.employerMessage}</p>
                                </div>
                            )}

                            <div className="chat-action">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => handleStartChat(app.freelancer._id, app.freelancer.name)}
                                >
                                    <MessageCircle size={16} />
                                    Message {app.freelancer?.name}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;
