import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import {
    MapPin, DollarSign, Clock, Briefcase, Calendar,
    User, Award, Star, Send, X, CheckCircle, AlertCircle, MessageCircle
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isFreelancer } = useAuth();
    const [job, setJob] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        proposedRate: '',
        estimatedDuration: ''
    });
    const [applying, setApplying] = useState(false);
    const [applicationSuccess, setApplicationSuccess] = useState(false);
    const [managingApplication, setManagingApplication] = useState(null);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const [jobResponse, matchesResponse] = await Promise.all([
                jobsAPI.getById(id),
                jobsAPI.getMatches(id).catch(() => ({ data: { data: { matches: [] } } }))
            ]);

            setJob(jobResponse.data.data.job);
            setMatches(matchesResponse.data.data.matches || []);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setApplying(true);

        try {
            await jobsAPI.applyForJob(id, applicationData);

            setApplicationSuccess(true);
            setTimeout(() => {
                setShowApplicationModal(false);
                setApplicationSuccess(false);
                setApplicationData({ coverLetter: '', proposedRate: '', estimatedDuration: '' });
            }, 2000);
        } catch (error) {
            console.error('Error applying:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
            alert(errorMessage);
        } finally {
            setApplying(false);
        }
    };

    const handleContactFreelancer = async (freelancerId, freelancerName) => {
        // Redirect directly to chat with the freelancer
        navigate(`/chat?userId=${freelancerId}`);
    };

    const handleApplicationAction = async (applicationId, action, freelancerName) => {
        try {
            setManagingApplication(applicationId);
            await jobsAPI.updateApplicationStatus(id, applicationId, { status: action });
            alert(`Application ${action === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
            // Refresh job details to update application status
            fetchJobDetails();
        } catch (error) {
            console.error('Error managing application:', error);
            alert('Failed to update application status. Please try again.');
        } finally {
            setManagingApplication(null);
        }
    };

    const handleChatWithApplicant = (freelancerId) => {
        navigate(`/chat?userId=${freelancerId}`);
    };

    const formatBudget = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!job) {
        return (
            <div className="container">
                <div className="error-state">
                    <AlertCircle size={48} />
                    <h2>Job Not Found</h2>
                    <p>The job you're looking for doesn't exist or has been removed.</p>
                    <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="job-detail-page">
            <div className="container">
                <div className="job-detail-layout">
                    {/* Main Content */}
                    <div className="job-main-content">
                        {/* Job Header */}
                        <Card className="job-header-card">
                            <div className="job-header">
                                <div className="employer-section">
                                    <div className="employer-avatar-large">
                                        {job.employer?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="employer-details">
                                        <h1 className="job-title">{job.title}</h1>
                                        <div className="employer-meta">
                                            <span className="employer-name">{job.employer?.name}</span>
                                            <span className="separator">•</span>
                                            <span className="job-location">
                                                <MapPin size={16} />
                                                {job.location}
                                            </span>
                                            <span className="separator">•</span>
                                            <span className="job-posted">
                                                Posted {formatDate(job.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="job-quick-stats">
                                <div className="quick-stat">
                                    <DollarSign size={20} />
                                    <div>
                                        <span className="stat-label">Budget</span>
                                        <span className="stat-value">{formatBudget(job.budget)}</span>
                                    </div>
                                </div>
                                <div className="quick-stat">
                                    <Clock size={20} />
                                    <div>
                                        <span className="stat-label">Duration</span>
                                        <span className="stat-value">{job.duration}</span>
                                    </div>
                                </div>
                                <div className="quick-stat">
                                    <Briefcase size={20} />
                                    <div>
                                        <span className="stat-label">Type</span>
                                        <span className="stat-value">{job.type}</span>
                                    </div>
                                </div>
                                <div className="quick-stat">
                                    <Calendar size={20} />
                                    <div>
                                        <span className="stat-label">Status</span>
                                        <span className="stat-value status-open">{job.status}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Job Description */}
                        <Card className="job-section">
                            <h2>Job Description</h2>
                            <p className="job-description-text">{job.description}</p>
                        </Card>

                        {/* Applications Section - Only for Employers */}
                        {user && job.employer?._id === user.id && job.applications && job.applications.length > 0 && (
                            <Card className="job-section">
                                <h2>📋 Applications ({job.applications.length})</h2>
                                <div className="applications-list">
                                    {job.applications.map((application) => (
                                        <div key={application._id} className="application-card">
                                            <div className="application-header">
                                                <div className="applicant-info">
                                                    <div className="applicant-avatar">
                                                        {application.freelancer?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4>{application.freelancer?.name}</h4>
                                                        <p className="applicant-email">{application.freelancer?.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`application-status status-${application.status}`}>
                                                    {application.status}
                                                </span>
                                            </div>

                                            <div className="application-details">
                                                <p><strong>Cover Letter:</strong></p>
                                                <p className="cover-letter">{application.coverLetter}</p>
                                                <div className="application-meta">
                                                    <span><strong>Proposed Rate:</strong> ₹{application.proposedRate}</span>
                                                    <span><strong>Duration:</strong> {application.estimatedDuration}</span>
                                                    <span><strong>Applied:</strong> {formatDate(application.appliedAt)}</span>
                                                </div>
                                            </div>

                                            {application.status === 'pending' && (
                                                <div className="application-actions">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleApplicationAction(application._id, 'accepted', application.freelancer?.name)}
                                                        loading={managingApplication === application._id}
                                                    >
                                                        <CheckCircle size={16} />
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleApplicationAction(application._id, 'rejected', application.freelancer?.name)}
                                                        loading={managingApplication === application._id}
                                                    >
                                                        <X size={16} />
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => handleChatWithApplicant(application.freelancer?._id)}
                                                    >
                                                        <MessageCircle size={16} />
                                                        Chat
                                                    </Button>
                                                </div>
                                            )}

                                            {application.status === 'accepted' && (
                                                <div className="application-actions">
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        fullWidth
                                                        onClick={() => handleChatWithApplicant(application.freelancer?._id)}
                                                    >
                                                        <MessageCircle size={16} />
                                                        Start Chat
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* Required Skills */}
                        <Card className="job-section">
                            <h2>Required Skills</h2>
                            <div className="skills-list">
                                {job.requiredSkills.map((skill, index) => (
                                    <span key={index} className="skill-badge">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>

                        {/* AI Matched Freelancers */}
                        {isFreelancer === false && matches.length > 0 && (
                            <Card className="job-section">
                                <h2>
                                    <Award size={24} />
                                    AI-Matched Freelancers
                                </h2>
                                <div className="matches-grid">
                                    {matches.slice(0, 6).map((match, index) => (
                                        <div key={index} className="match-card">
                                            <div className="match-header">
                                                <div className="freelancer-avatar">
                                                    {match.freelancer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="match-score">
                                                    <Star size={16} fill="currentColor" />
                                                    {match.score}%
                                                </div>
                                            </div>
                                            <h4>{match.freelancer.name}</h4>
                                            <p className="match-reason">{match.reason}</p>
                                            <div className="freelancer-skills">
                                                {match.freelancer.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="skill-tag-sm">{skill}</span>
                                                ))}
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                fullWidth
                                                onClick={() => handleContactFreelancer(match.freelancer.id, match.freelancer.name)}
                                            >
                                                <MessageCircle size={16} />
                                                Contact Freelancer
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="job-sidebar">
                        <Card className="sidebar-card sticky">
                            {isFreelancer ? (
                                <>
                                    <h3>Ready to Apply?</h3>
                                    <p className="sidebar-text">
                                        Submit your proposal and stand out from other freelancers
                                    </p>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        onClick={() => setShowApplicationModal(true)}
                                    >
                                        <Send size={20} />
                                        Apply for this Job
                                    </Button>

                                    <div className="sidebar-divider"></div>

                                    <div className="sidebar-info">
                                        <h4>About the Client</h4>
                                        <div className="client-info">
                                            <User size={18} />
                                            <div>
                                                <p className="info-label">Employer</p>
                                                <p className="info-value">{job.employer?.name}</p>
                                            </div>
                                        </div>
                                        <div className="client-info">
                                            <MapPin size={18} />
                                            <div>
                                                <p className="info-label">Location</p>
                                                <p className="info-value">{job.employer?.location || 'Not specified'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h3>Job Management</h3>
                                    <p className="sidebar-text">
                                        View AI-matched candidates below
                                    </p>
                                    <Button variant="secondary" fullWidth onClick={() => navigate('/jobs')}>
                                        Back to Jobs
                                    </Button>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && (
                <div className="modal-overlay" onClick={() => !applying && setShowApplicationModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {applicationSuccess ? (
                            <div className="success-state">
                                <CheckCircle size={64} />
                                <h2>Application Submitted!</h2>
                                <p>The employer will review your proposal and get back to you soon.</p>
                            </div>
                        ) : (
                            <>
                                <div className="modal-header">
                                    <h2>Apply for {job.title}</h2>
                                    <button
                                        className="modal-close"
                                        onClick={() => setShowApplicationModal(false)}
                                        disabled={applying}
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleApply} className="application-form">
                                    <div className="form-group">
                                        <label>Cover Letter *</label>
                                        <textarea
                                            required
                                            rows="6"
                                            placeholder="Explain why you're the best fit for this project..."
                                            value={applicationData.coverLetter}
                                            onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                                            disabled={applying}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Your Proposed Rate (₹) *</label>
                                            <input
                                                type="number"
                                                required
                                                placeholder="50000"
                                                value={applicationData.proposedRate}
                                                onChange={(e) => setApplicationData({ ...applicationData, proposedRate: e.target.value })}
                                                disabled={applying}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Estimated Duration *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g., 2 weeks"
                                                value={applicationData.estimatedDuration}
                                                onChange={(e) => setApplicationData({ ...applicationData, estimatedDuration: e.target.value })}
                                                disabled={applying}
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-actions">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowApplicationModal(false)}
                                            disabled={applying}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            loading={applying}
                                        >
                                            Submit Application
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetail;
