import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI, jobsAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import VoiceInput from '../components/VoiceInput';
import FreelancerMatchCard from '../components/FreelancerMatchCard';
import './CreateJob.css';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requiredSkills: '',
        budgetMin: '',
        budgetMax: '',
        locationPreference: '',
        duration: '',
        jobType: 'contract'
    });
    const [matchedFreelancers, setMatchedFreelancers] = useState([]);
    const [showMatches, setShowMatches] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVoiceTranscript = async (transcript) => {
        try {
            setLoading(true);
            setError('');

            // Process voice input with AI
            const response = await aiAPI.voiceToJob({
                transcript,
                language: 'ta-IN' // Tamil voice input
            });

            const { jobDetails, matchedFreelancers } = response.data.data;

            // Auto-fill form with extracted details
            setFormData({
                title: jobDetails.title || '',
                description: jobDetails.description || '',
                requiredSkills: jobDetails.requiredSkills.join(', ') || '',
                budgetMin: jobDetails.budget?.min || '',
                budgetMax: jobDetails.budget?.max || '',
                locationPreference: formData.locationPreference,
                duration: jobDetails.duration || '',
                jobType: formData.jobType
            });

            // Show matched freelancers
            setMatchedFreelancers(matchedFreelancers || []);
            setShowMatches(true);

            setLoading(false);
        } catch (err) {
            console.error('Voice processing error:', err);
            setError(err.response?.data?.message || 'Failed to process voice input');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = {
                ...formData,
                requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
                budget: {
                    min: Number(formData.budgetMin),
                    max: Number(formData.budgetMax),
                    currency: 'INR'
                }
            };

            const response = await jobsAPI.create(data);
            const jobId = response.data.data.job._id;
            navigate(`/jobs/${jobId}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="create-job-header">
                <h1 className="gradient-text">Post a Job</h1>
                <p>Find the perfect freelancer for your project</p>
            </div>

            <div className="create-job-layout">
                <div className="create-job-main">
                    {/* Voice Input Section */}
                    <VoiceInput onTranscriptReceived={handleVoiceTranscript} language="ta-IN" />

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    {/* Manual Entry Form */}
                    <Card>
                        <h3>Manual Entry</h3>
                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit} className="job-form">
                            <Input
                                label="Job Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Python Developer"
                                required
                            />

                            <div className="form-group">
                                <label className="input-label">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the job requirements..."
                                    required
                                    className="textarea"
                                    rows="4"
                                />
                            </div>

                            <Input
                                label="Required Skills (comma separated)"
                                name="requiredSkills"
                                value={formData.requiredSkills}
                                onChange={handleChange}
                                placeholder="Python, Django, React"
                                required
                            />

                            <div className="form-row">
                                <Input
                                    label="Min Budget (₹)"
                                    type="number"
                                    name="budgetMin"
                                    value={formData.budgetMin}
                                    onChange={handleChange}
                                    placeholder="20000"
                                    required
                                />
                                <Input
                                    label="Max Budget (₹)"
                                    type="number"
                                    name="budgetMax"
                                    value={formData.budgetMax}
                                    onChange={handleChange}
                                    placeholder="40000"
                                    required
                                />
                            </div>

                            <Input
                                label="Location Preference"
                                name="locationPreference"
                                value={formData.locationPreference}
                                onChange={handleChange}
                                placeholder="Chennai, India"
                            />

                            <Input
                                label="Duration"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="2 weeks"
                            />

                            <div className="form-group">
                                <label className="input-label">Job Type *</label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="select"
                                >
                                    <option value="full-time">Full Time</option>
                                    <option value="part-time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={loading}
                            >
                                Post Job
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Matched Freelancers Sidebar */}
                {showMatches && matchedFreelancers.length > 0 && (
                    <div className="matched-freelancers-sidebar">
                        <Card>
                            <h3>🎯 Top Matched Freelancers</h3>
                            <p className="sidebar-subtitle">
                                Based on your job requirements, here are the top {matchedFreelancers.length} matching freelancers:
                            </p>
                            <div className="freelancer-matches">
                                {matchedFreelancers.map((freelancer) => (
                                    <FreelancerMatchCard
                                        key={freelancer._id}
                                        freelancer={freelancer}
                                    />
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateJob;
