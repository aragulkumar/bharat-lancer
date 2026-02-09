import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import './Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        skills: '',
        hourlyRate: '',
        availability: 'flexible',
        portfolioLinks: '',
        resumeText: '',
        companyName: '',
        companyDescription: ''
    });

    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || '',
                skills: user.skills?.join(', ') || '',
                hourlyRate: user.hourlyRate || '',
                availability: user.availability || 'flexible',
                portfolioLinks: user.portfolioLinks?.join('\n') || '',
                resumeText: user.resumeText || '',
                companyName: user.companyName || '',
                companyDescription: user.companyDescription || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please upload a PDF or Word document');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }

            setResumeFile(file);
            setResumeFileName(file.name);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                location: formData.location
            };

            // Add role-specific fields
            if (user.role === 'freelancer') {
                updateData.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
                updateData.hourlyRate = Number(formData.hourlyRate);
                updateData.availability = formData.availability;
                updateData.portfolioLinks = formData.portfolioLinks
                    .split('\n')
                    .map(s => s.trim())
                    .filter(s => s);
                updateData.resumeText = formData.resumeText;
            } else if (user.role === 'employer') {
                updateData.companyName = formData.companyName;
                updateData.companyDescription = formData.companyDescription;
            }

            const response = await authAPI.updateProfile(updateData);
            updateUser(response.data.data.user);
            setSuccess('Profile updated successfully!');

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/jobs');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <Loader fullScreen />;
    }

    return (
        <div className="container">
            <div className="profile-header">
                <h1 className="gradient-text">Edit Profile</h1>
                <p>Update your information and skills</p>
            </div>

            <div className="profile-content">
                <Card>
                    <form onSubmit={handleSubmit} className="profile-form">
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <h3>Basic Information</h3>

                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={user.email}
                            disabled
                            helperText="Email cannot be changed"
                        />

                        <Input
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Chennai, India"
                        />

                        {user.role === 'freelancer' ? (
                            <>
                                <h3>Freelancer Details</h3>

                                <Input
                                    label="Skills (comma separated)"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Python, React, Node.js"
                                />

                                <Input
                                    label="Hourly Rate (₹)"
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    placeholder="1500"
                                />

                                <div className="form-group">
                                    <label className="input-label">Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="select"
                                    >
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="contract">Contract</option>
                                        <option value="flexible">Flexible</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Portfolio Links (one per line)</label>
                                    <textarea
                                        name="portfolioLinks"
                                        value={formData.portfolioLinks}
                                        onChange={handleChange}
                                        placeholder="https://github.com/username&#10;https://portfolio.com"
                                        className="textarea"
                                        rows="4"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Resume File (Optional)</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="resume-file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            className="file-input"
                                        />
                                        <label htmlFor="resume-file" className="file-upload-label">
                                            {resumeFileName ? (
                                                <>
                                                    <span className="file-icon">📄</span>
                                                    <span className="file-name">{resumeFileName}</span>
                                                    <span className="file-change">Click to change</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="upload-icon">📁</span>
                                                    <span className="upload-text">Upload Resume (PDF, DOC, DOCX)</span>
                                                    <span className="upload-subtext">Max size: 5MB</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                    <small className="helper-text">
                                        Upload your resume or fill the bio below
                                    </small>
                                </div>

                                <div className="form-group">
                                    <label className="input-label">Resume / Bio</label>
                                    <textarea
                                        name="resumeText"
                                        value={formData.resumeText}
                                        onChange={handleChange}
                                        placeholder="Tell us about your experience, education, and achievements..."
                                        className="textarea"
                                        rows="6"
                                    />
                                    <small className="helper-text">
                                        Adding your resume improves your AI Skill Score by up to 30%
                                    </small>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Company Details</h3>

                                <Input
                                    label="Company Name"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Your Company"
                                />

                                <div className="form-group">
                                    <label className="input-label">Company Description</label>
                                    <textarea
                                        name="companyDescription"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        placeholder="Tell us about your company..."
                                        className="textarea"
                                        rows="4"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/jobs')}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
