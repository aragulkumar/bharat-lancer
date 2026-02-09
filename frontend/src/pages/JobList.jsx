import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MapPin, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import './JobList.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isEmployer } = useAuth();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await jobsAPI.getAll();
            setJobs(response.data.data.jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="container">
            <div className="job-list-header">
                <h1 className="gradient-text">Browse Jobs</h1>
                {isEmployer && (
                    <Link to="/create-job">
                        <Button variant="primary">
                            <Plus size={20} />
                            Post Job
                        </Button>
                    </Link>
                )}
            </div>

            <div className="job-search">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="job-grid">
                {filteredJobs.length === 0 ? (
                    <div className="no-jobs">
                        <p>No jobs found</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <Link to={`/jobs/${job._id}`} key={job._id} className="job-card-link">
                            <Card gradient className="job-card">
                                <h3>{job.title}</h3>
                                <p className="job-description">{job.description}</p>

                                <div className="job-skills">
                                    {job.requiredSkills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="skill-badge">{skill}</span>
                                    ))}
                                    {job.requiredSkills.length > 3 && (
                                        <span className="skill-badge">+{job.requiredSkills.length - 3}</span>
                                    )}
                                </div>

                                <div className="job-meta">
                                    <div className="job-meta-item">
                                        <MapPin size={16} />
                                        <span>{job.locationPreference || 'Remote'}</span>
                                    </div>
                                    <div className="job-meta-item">
                                        <DollarSign size={16} />
                                        <span>₹{job.budget?.min} - ₹{job.budget?.max}</span>
                                    </div>
                                </div>

                                {job.createdViaVoice && (
                                    <div className="voice-badge">
                                        🎤 Voice Posted
                                    </div>
                                )}
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default JobList;
