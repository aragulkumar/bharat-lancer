import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI } from '../services/api';
import {
    Briefcase, MapPin, DollarSign, Clock, Search,
    Filter, Plus, TrendingUp, Star, Users
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import './JobList.css';

const JobList = () => {
    const { isEmployer } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: '',
        minBudget: '',
        maxBudget: '',
        location: ''
    });
    const [showFilters, setShowFilters] = useState(false);

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

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.type || job.type === filters.type;
        const matchesBudget = (!filters.minBudget || job.budget >= Number(filters.minBudget)) &&
            (!filters.maxBudget || job.budget <= Number(filters.maxBudget));
        const matchesLocation = !filters.location ||
            job.location.toLowerCase().includes(filters.location.toLowerCase());

        return matchesSearch && matchesType && matchesBudget && matchesLocation;
    });

    const formatBudget = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'Just now';
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="job-list-page">
            <div className="container">
                {/* Header Section */}
                <div className="page-header">
                    <div className="header-content">
                        <h1 className="gradient-text">Find Your Next Project</h1>
                        <p className="header-subtitle">
                            Browse {jobs.length} opportunities from top employers
                        </p>
                    </div>

                    {isEmployer && (
                        <Link to="/create-job">
                            <Button variant="primary" size="lg">
                                <Plus size={20} />
                                Post a Job
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Search and Filter Bar */}
                <div className="search-filter-bar">
                    <div className="search-box">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search jobs by title, skills, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        className="filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} />
                        Filters
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="filter-panel slide-down">
                        <div className="filter-grid">
                            <div className="filter-group">
                                <label>Job Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                >
                                    <option value="">All Types</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="contract">Contract</option>
                                    <option value="full-time">Full-time</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Min Budget (₹)</label>
                                <input
                                    type="number"
                                    placeholder="10000"
                                    value={filters.minBudget}
                                    onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
                                />
                            </div>

                            <div className="filter-group">
                                <label>Max Budget (₹)</label>
                                <input
                                    type="number"
                                    placeholder="100000"
                                    value={filters.maxBudget}
                                    onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
                                />
                            </div>

                            <div className="filter-group">
                                <label>Location</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Mumbai, Remote"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="filter-actions">
                            <button
                                className="clear-filters"
                                onClick={() => setFilters({ type: '', minBudget: '', maxBudget: '', location: '' })}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat-item">
                        <Briefcase size={18} />
                        <span>{filteredJobs.length} Jobs Found</span>
                    </div>
                    <div className="stat-item">
                        <TrendingUp size={18} />
                        <span>Updated Daily</span>
                    </div>
                </div>

                {/* Job Grid */}
                <div className="jobs-grid">
                    {filteredJobs.length === 0 ? (
                        <div className="no-jobs">
                            <Briefcase size={48} />
                            <h3>No jobs found</h3>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
                                <div className="job-card-header">
                                    <div className="job-employer">
                                        <div className="employer-avatar">
                                            {job.employer?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="employer-info">
                                            <h4>{job.employer?.name}</h4>
                                            <span className="employer-location">
                                                <MapPin size={14} />
                                                {job.location}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="job-time">{getTimeAgo(job.createdAt)}</span>
                                </div>

                                <h3 className="job-title">{job.title}</h3>

                                <p className="job-description">
                                    {job.description.length > 150
                                        ? `${job.description.substring(0, 150)}...`
                                        : job.description}
                                </p>

                                <div className="job-skills">
                                    {job.requiredSkills.slice(0, 4).map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                    {job.requiredSkills.length > 4 && (
                                        <span className="skill-tag more">
                                            +{job.requiredSkills.length - 4}
                                        </span>
                                    )}
                                </div>

                                <div className="job-card-footer">
                                    <div className="job-meta">
                                        <div className="meta-item budget">
                                            <DollarSign size={16} />
                                            <span className="budget-amount">{formatBudget(job.budget)}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{job.duration}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={16} />
                                            <span>{job.type}</span>
                                        </div>
                                    </div>

                                    {job.status === 'open' && (
                                        <span className="status-badge open">Open</span>
                                    )}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobList;
