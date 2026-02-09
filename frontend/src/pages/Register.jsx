import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        role: 'freelancer',
        name: '',
        email: '',
        password: '',
        location: '',
        skills: '',
        hourlyRate: '',
        companyName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = {
                ...formData,
                skills: formData.role === 'freelancer'
                    ? formData.skills.split(',').map(s => s.trim())
                    : undefined,
                hourlyRate: formData.role === 'freelancer'
                    ? Number(formData.hourlyRate)
                    : undefined
            };

            await register(data);
            navigate('/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-gradient"></div>
            <div className="auth-content">
                <Card className="auth-card">
                    <div className="auth-header">
                        <h1 className="gradient-text">Join Bharat Lancer</h1>
                        <p>Create your account and start working</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}

                        {/* Role Selection */}
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'freelancer' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'freelancer' })}
                            >
                                I'm a Freelancer
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'employer' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'employer' })}
                            >
                                I'm an Employer
                            </button>
                        </div>

                        <Input
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <Input
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Chennai, India"
                            required
                        />

                        {formData.role === 'freelancer' ? (
                            <>
                                <Input
                                    label="Skills (comma separated)"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="Python, React, Node.js"
                                    required
                                />
                                <Input
                                    label="Hourly Rate (₹)"
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                    placeholder="1500"
                                    required
                                />
                            </>
                        ) : (
                            <Input
                                label="Company Name"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Your Company"
                            />
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
