import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, MessageCircle, Clock, DollarSign, Briefcase } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import './Applications.css';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const isEmployer = user?.role === 'employer';
    const isFreelancer = user?.role === 'freelancer';

    useEffect(() => {
        fetchApplications();
    }, [user]);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            if (isEmployer) {
                // Fetch all applications for employer's jobs
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
            } else if (isFreelancer) {
                // Fetch freelancer's own applications
                const response = await jobsAPI.getAll();
                const allJobs = response.data.data.jobs;

                // Find jobs where current user has applied
                const myApplications = [];
                allJobs.forEach(job => {
                    if (job.applications && job.applications.length > 0) {
                        const userApp = job.applications.find(app =>
                            app.freelancer?._id === user.id || app.freelancer === user.id
                        );
                        if (userApp) {
                            myApplications.push({
                                ...userApp,
                                jobId: job._id,
                                jobTitle: job.title,
                                jobBudget: job.budget,
                                employer: job.employer
                            });
                        }
                    }
                });

                // Sort by most recent
                myApplications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                setApplications(myApplications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (jobId, applicationId, status) => {
        try {
            console.log('Updating application status:', { jobId, applicationId, status });

            const response = await jobsAPI.updateApplicationStatus(jobId, applicationId, {
                status,
                message: replyMessage
            });

            console.log('Status update response:', response);
            alert(`Application ${status}!`);
            setReplyMessage('');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error('Error updating status:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Request details:', { jobId, applicationId, status, message: replyMessage });
            alert(`Failed to update application status: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleStartChat = async (userId, userName) => {
        try {
            // Navigate to chat with this user pre-selected
            navigate(`/chat?userId=${userId}&name=${encodeURIComponent(userName || 'User')}`);
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

    // Freelancer View
    if (isFreelancer) {
        return (
            <div className="applications-page">
                <div className="applications-header">
                    <h1>My Applications</h1>
                    <p>{applications.length} total applications</p>
                </div>

                {applications.length === 0 ? (
                    <Card className="empty-state">
                        <Briefcase size={48} />
                        <p>You haven't applied to any jobs yet.</p>
                        <Button variant="primary" onClick={() => navigate('/jobs')}>
                            Browse Jobs
                        </Button>
                    </Card>
                ) : (
                    <div className="applications-grid">
                        {applications.map((app) => (
                            <Card key={app._id} className="application-card freelancer-view">
                                <div className="app-header">
                                    <div>
                                        <h3>{app.jobTitle}</h3>
                                        <p className="employer-name">
                                            Posted by: {app.employer?.name || 'Employer'}
                                        </p>
                                    </div>
                                    {getStatusBadge(app.status)}
                                </div>

                                <div className="app-meta">
                                    <span><Clock size={16} /> Applied: {formatDate(app.appliedAt)}</span>
                                    <span><DollarSign size={16} /> Your Rate: ₹{app.proposedRate?.toLocaleString('en-IN')}</span>
                                </div>

                                <div className="cover-letter">
                                    <strong>Your Cover Letter:</strong>
                                    <p>{app.coverLetter}</p>
                                </div>

                                <div className="app-details">
                                    <p><strong>Estimated Duration:</strong> {app.estimatedDuration}</p>
                                </div>

                                {app.employerMessage && (
                                    <div className="employer-message">
                                        <strong>Employer's Response:</strong>
                                        <p>{app.employerMessage}</p>
                                    </div>
                                )}

                                <div className="chat-action">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleStartChat(app.employer?._id, app.employer?.name)}
                                    >
                                        <MessageCircle size={16} />
                                        Message Employer
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/jobs/${app.jobId}`)}
                                    >
                                        View Job
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Employer View
    return (
        <div className="applications-page">
            <div className="applications-header">
                <h1>Job Applications</h1>
                <p>{applications.length} total applications</p>
            </div>

            {applications.length === 0 ? (
                <Card className="empty-state">
                    <Briefcase size={48} />
                    <p>No applications yet. Your job posts will appear here when freelancers apply.</p>
                    <Button variant="primary" onClick={() => navigate('/create-job')}>
                        Post a Job
                    </Button>
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
