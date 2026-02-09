import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Sparkles } from 'lucide-react';
import { jobsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import './JobDetail.css';

const JobDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isFreelancer } = useAuth();

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const [jobRes, matchesRes] = await Promise.all([
                jobsAPI.getById(id),
                jobsAPI.getMatches(id)
            ]);
            setJob(jobRes.data.data.job);
            setMatches(matchesRes.data.data.matches || []);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!job) {
        return <div className="container"><p>Job not found</p></div>;
    }

    return (
        <div className="container">
            <div className="job-detail-layout">
                <div className="job-main">
                    <Card gradient>
                        <div className="job-header">
                            <h1>{job.title}</h1>
                            {job.createdViaVoice && (
                                <span className="voice-badge">🎤 Voice Posted</span>
                            )}
                        </div>

                        <div className="job-meta-row">
                            <div className="meta-item">
                                <MapPin size={18} />
                                <span>{job.locationPreference || 'Remote'}</span>
                            </div>
                            <div className="meta-item">
                                <DollarSign size={18} />
                                <span>₹{job.budget?.min} - ₹{job.budget?.max}</span>
                            </div>
                            <div className="meta-item">
                                <Clock size={18} />
                                <span>{job.duration || 'Flexible'}</span>
                            </div>
                        </div>

                        <div className="job-section">
                            <h3>Description</h3>
                            <p>{job.description}</p>
                        </div>

                        <div className="job-section">
                            <h3>Required Skills</h3>
                            <div className="skills-list">
                                {job.requiredSkills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="job-section">
                            <h3>Job Details</h3>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <strong>Type:</strong> {job.jobType}
                                </div>
                                <div className="detail-item">
                                    <strong>Status:</strong> {job.status}
                                </div>
                                <div className="detail-item">
                                    <strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {isFreelancer && (
                            <Button variant="primary" size="lg" fullWidth>
                                Apply for this Job
                            </Button>
                        )}
                    </Card>
                </div>

                {!isFreelancer && matches.length > 0 && (
                    <div className="job-sidebar">
                        <Card className="matches-card">
                            <div className="matches-header">
                                <Sparkles size={20} className="sparkle-icon" />
                                <h3>AI Matched Freelancers</h3>
                            </div>

                            <div className="matches-list">
                                {matches.slice(0, 5).map((match, index) => (
                                    <div key={index} className="match-item">
                                        <div className="match-header">
                                            <h4>{match.freelancer.name}</h4>
                                            <div className="match-score">
                                                {match.matchScore}%
                                            </div>
                                        </div>

                                        <p className="match-location">{match.freelancer.location}</p>

                                        <div className="match-skills">
                                            {match.freelancer.skills.slice(0, 3).map((skill, i) => (
                                                <span key={i} className="match-skill">{skill}</span>
                                            ))}
                                        </div>

                                        <p className="match-explanation">{match.explanation}</p>

                                        <div className="match-rate">
                                            ₹{match.freelancer.hourlyRate}/hr
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobDetail;
