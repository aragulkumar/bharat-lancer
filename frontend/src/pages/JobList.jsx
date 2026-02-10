import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, geminiAPI } from '../services/api';
import {
    Briefcase, MapPin, DollarSign, Clock, Search,
    Filter, Plus, TrendingUp, Star, Users, X, Mic, MicOff
} from 'lucide-react';
import Button from '../components/Button';
import Loader from '../components/Loader';
import './JobList.css';
import './VoiceProcessing.css';

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
    const [showJobModal, setShowJobModal] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [transcript, setTranscript] = useState('');
    const [jobFormData, setJobFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        budgetMin: '',
        budgetMax: '',
        locationPreference: '',
        duration: '',
        jobType: 'freelance'
    });

    useEffect(() => {
        fetchJobs();

        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US'; // English language (Gemini will handle Tamil translation if needed)

            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    // Just accumulate transcript, don't auto-fill yet
                    setTranscript(prev => prev + finalTranscript);
                }
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsRecording(false);
            };

            recognitionInstance.onend = () => {
                if (isRecording) {
                    recognitionInstance.start();
                }
            };

            setRecognition(recognitionInstance);
        }
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
        const matchesType = !filters.type || job.jobType === filters.type;
        const matchesBudget = (!filters.minBudget || (job.budget?.max || 0) >= Number(filters.minBudget)) &&
            (!filters.maxBudget || (job.budget?.min || 0) <= Number(filters.maxBudget));
        const matchesLocation = !filters.location ||
            (job.locationPreference || '').toLowerCase().includes(filters.location.toLowerCase());

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

    const handlePostJob = async () => {
        try {
            // Validate required fields
            if (!jobFormData.title || !jobFormData.description || !jobFormData.requiredSkills ||
                !jobFormData.budgetMin || !jobFormData.budgetMax) {
                alert('Please fill in all required fields');
                return;
            }

            // Prepare job data
            const jobData = {
                title: jobFormData.title,
                description: jobFormData.description,
                requiredSkills: jobFormData.requiredSkills.split(',').map(skill => skill.trim()),
                budget: {
                    min: parseInt(jobFormData.budgetMin),
                    max: parseInt(jobFormData.budgetMax)
                },
                locationPreference: jobFormData.locationPreference || 'Remote',
                duration: jobFormData.duration || 'Not specified',
                jobType: jobFormData.jobType
            };

            // Submit to API
            await jobsAPI.create(jobData);

            // Reset form and close modal
            setJobFormData({
                title: '',
                description: '',
                requiredSkills: '',
                budgetMin: '',
                budgetMax: '',
                locationPreference: '',
                duration: '',
                jobType: 'freelance'
            });
            setShowJobModal(false);

            // Refresh job list
            fetchJobs();

            alert('Job posted successfully!');
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error.response?.data?.message || 'Failed to post job. Please try again.');
        }
    };

    const parseJobFromTranscript = (text) => {
        // Simple AI-like parsing using keywords and patterns
        const lowerText = text.toLowerCase();

        // Extract job title (look for common patterns)
        let title = '';
        const titlePatterns = [
            /(?:need|looking for|hiring|want)\s+(?:a\s+)?([^.]+?)(?:\s+for|\s+to|\s+with|\.)/i,
            /(?:job title is|position is|role is)\s+([^.]+)/i,
            /([^.]+?)\s+(?:developer|designer|engineer|manager|specialist)/i
        ];

        for (const pattern of titlePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                title = match[1].trim();
                break;
            }
        }

        // Extract skills (look for technical keywords)
        const skillKeywords = ['python', 'javascript', 'react', 'node', 'java', 'css', 'html', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'django', 'flask', 'express', 'postgresql', 'redis', 'git', 'figma', 'photoshop', 'ui', 'ux'];
        const foundSkills = [];
        skillKeywords.forEach(skill => {
            if (lowerText.includes(skill)) {
                foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
            }
        });

        // Extract budget (look for numbers and currency)
        let budgetMin = '';
        let budgetMax = '';
        const budgetPatterns = [
            /(\d+)k?\s*(?:to|-)\s*(\d+)k?/i,
            /budget.*?(\d+).*?(\d+)/i,
            /(\d{4,})\s*(?:to|-)\s*(\d{4,})/
        ];

        for (const pattern of budgetPatterns) {
            const match = text.match(pattern);
            if (match) {
                budgetMin = match[1].includes('k') ? match[1].replace('k', '000') : match[1];
                budgetMax = match[2].includes('k') ? match[2].replace('k', '000') : match[2];
                break;
            }
        }

        // Extract location
        let location = '';
        if (lowerText.includes('remote')) {
            location = 'Remote';
        } else {
            const locationMatch = text.match(/(?:in|from|location)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
            if (locationMatch) {
                location = locationMatch[1];
            }
        }

        // Extract duration
        let duration = '';
        const durationMatch = text.match(/(\d+)\s*(?:month|week|day)s?/i);
        if (durationMatch) {
            duration = durationMatch[0];
        }

        return {
            title: title || '',
            description: text,
            requiredSkills: foundSkills.join(', '),
            budgetMin,
            budgetMax,
            locationPreference: location,
            duration
        };
    };

    const toggleRecording = async () => {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        if (isRecording) {
            recognition.stop();
            setIsRecording(false);

            // Parse the transcript using Gemini AI
            if (transcript.trim()) {
                setIsProcessing(true); // Show loading indicator
                try {
                    console.log('📤 Sending to Gemini:', transcript);
                    const response = await geminiAPI.parseJob(transcript);
                    console.log('📥 API Response:', response);
                    const parsedData = response.data.data;
                    console.log('✅ Parsed:', parsedData);

                    // Fill form fields with AI-parsed data
                    setJobFormData(prev => ({
                        ...prev,
                        title: parsedData.title || prev.title,
                        description: parsedData.description || prev.description,
                        requiredSkills: Array.isArray(parsedData.requiredSkills)
                            ? parsedData.requiredSkills.join(', ')
                            : parsedData.requiredSkills || prev.requiredSkills,
                        budgetMin: parsedData.budgetMin || prev.budgetMin,
                        budgetMax: parsedData.budgetMax || prev.budgetMax,
                        locationPreference: parsedData.locationPreference || prev.locationPreference,
                        duration: parsedData.duration || prev.duration,
                        jobType: parsedData.jobType || prev.jobType
                    }));
                    setIsProcessing(false); // Hide loading
                } catch (error) {
                    console.error('❌ Gemini Error:', error);
                    console.error('Error response:', error.response?.data);
                    setIsProcessing(false); // Hide loading
                    // Fallback to local parsing if API fails
                    const parsedData = parseJobFromTranscript(transcript);
                    setJobFormData(prev => ({
                        ...prev,
                        title: parsedData.title || prev.title,
                        description: parsedData.description || prev.description,
                        requiredSkills: parsedData.requiredSkills || prev.requiredSkills,
                        budgetMin: parsedData.budgetMin || prev.budgetMin,
                        budgetMax: parsedData.budgetMax || prev.budgetMax,
                        locationPreference: parsedData.locationPreference || prev.locationPreference,
                        duration: parsedData.duration || prev.duration
                    }));
                }
            }
        } else {
            setTranscript('');
            recognition.start();
            setIsRecording(true);
        }
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
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setShowJobModal(true)}
                        >
                            <Plus size={20} />
                            Post a Job
                        </Button>
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
                                                {job.locationPreference || 'Remote'}
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
                                            <span className="budget-amount">
                                                {formatBudget(job.budget?.min || 0)} - {formatBudget(job.budget?.max || 0)}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <Clock size={16} />
                                            <span>{job.duration}</span>
                                        </div>
                                        <div className="meta-item">
                                            <Users size={16} />
                                            <span>{job.jobType}</span>
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

            {/* Job Posting Modal */}
            {showJobModal && (
                <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
                    <div className="job-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Post a New Job</h2>
                            <button className="modal-close" onClick={() => setShowJobModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Voice Input Section */}
                            <div className="voice-input-section">
                                <button
                                    className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                                    onClick={toggleRecording}
                                    type="button"
                                    disabled={isProcessing}
                                >
                                    {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                                    {isRecording ? 'Stop Recording' : 'Record Job Details'}
                                </button>
                                <p className="voice-hint">
                                    {isProcessing ? (
                                        <span className="processing-text">
                                            🤖 AI is translating and extracting job details...
                                        </span>
                                    ) : isRecording ? (
                                        'Speak clearly about the job requirements...'
                                    ) : (
                                        'Click to record job details using your voice'
                                    )}
                                </p>
                            </div>

                            <div className="divider">
                                <span>OR</span>
                            </div>

                            {/* Manual Input Form */}
                            <form className="job-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Job Title *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Full Stack Developer"
                                            value={jobFormData.title}
                                            onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        placeholder="Describe the job requirements, responsibilities, and expectations..."
                                        value={jobFormData.description}
                                        onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Required Skills (comma-separated) *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., React, Node.js, MongoDB"
                                        value={jobFormData.requiredSkills}
                                        onChange={(e) => setJobFormData({ ...jobFormData, requiredSkills: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Min Budget (₹) *</label>
                                        <input
                                            type="number"
                                            placeholder="30000"
                                            value={jobFormData.budgetMin}
                                            onChange={(e) => setJobFormData({ ...jobFormData, budgetMin: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Budget (₹) *</label>
                                        <input
                                            type="number"
                                            placeholder="50000"
                                            value={jobFormData.budgetMax}
                                            onChange={(e) => setJobFormData({ ...jobFormData, budgetMax: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Remote, Mumbai"
                                            value={jobFormData.locationPreference}
                                            onChange={(e) => setJobFormData({ ...jobFormData, locationPreference: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2-3 months"
                                            value={jobFormData.duration}
                                            onChange={(e) => setJobFormData({ ...jobFormData, duration: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Job Type</label>
                                    <select
                                        value={jobFormData.jobType}
                                        onChange={(e) => setJobFormData({ ...jobFormData, jobType: e.target.value })}
                                    >
                                        <option value="freelance">Freelance</option>
                                        <option value="contract">Contract</option>
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <Button variant="outline" onClick={() => setShowJobModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handlePostJob}>
                                <Plus size={18} />
                                Post Job
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobList;
