import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase,
    Users,
    MessageSquare,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    Globe,
    Star
} from 'lucide-react';
import Button from '../components/Button';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Redirect if already logged in
    if (user) {
        navigate('/jobs');
        return null;
    }

    const features = [
        {
            icon: <Zap size={32} />,
            title: 'AI-Powered Matching',
            description: 'Our intelligent system matches freelancers with jobs based on skills, experience, and budget.'
        },
        {
            icon: <MessageSquare size={32} />,
            title: 'Real-Time Chat',
            description: 'Communicate directly with clients and freelancers through our built-in messaging system.'
        },
        {
            icon: <Shield size={32} />,
            title: 'Secure Payments',
            description: 'Safe and secure payment processing with escrow protection for both parties.'
        },
        {
            icon: <Globe size={32} />,
            title: 'Tamil Voice Support',
            description: 'Post jobs using voice input in Tamil, making it accessible for everyone.'
        }
    ];

    const howItWorks = [
        {
            step: '1',
            title: 'Create Your Profile',
            description: 'Sign up as an employer or freelancer and complete your profile.'
        },
        {
            step: '2',
            title: 'Post or Find Jobs',
            description: 'Employers post jobs, freelancers browse and apply to opportunities.'
        },
        {
            step: '3',
            title: 'Connect & Collaborate',
            description: 'Chat, negotiate, and work together to complete projects successfully.'
        },
        {
            step: '4',
            title: 'Get Paid Securely',
            description: 'Complete the work and receive payment through our secure platform.'
        }
    ];

    const stats = [
        { value: '10,000+', label: 'Active Users' },
        { value: '5,000+', label: 'Jobs Posted' },
        { value: '₹50L+', label: 'Paid to Freelancers' },
        { value: '4.8/5', label: 'Average Rating' }
    ];

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="container hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Find the Perfect
                            <span className="gradient-text"> Freelancer</span>
                            <br />
                            for Your Project
                        </h1>
                        <p className="hero-description">
                            Connect with skilled professionals across India. Post jobs, find talent,
                            and collaborate seamlessly with AI-powered matching and real-time communication.
                        </p>
                        <div className="hero-buttons">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate('/register')}
                            >
                                Get Started Free
                                <ArrowRight size={20} />
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                        </div>
                        <div className="hero-stats">
                            {stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="floating-card card-1">
                            <Briefcase size={24} />
                            <div>
                                <div className="card-title">New Job Posted</div>
                                <div className="card-subtitle">Web Development</div>
                            </div>
                        </div>
                        <div className="floating-card card-2">
                            <Users size={24} />
                            <div>
                                <div className="card-title">5 Applicants</div>
                                <div className="card-subtitle">Matched by AI</div>
                            </div>
                        </div>
                        <div className="floating-card card-3">
                            <Star size={24} />
                            <div>
                                <div className="card-title">4.9 Rating</div>
                                <div className="card-subtitle">Top Freelancer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Bharat Lancer?</h2>
                        <p>Everything you need to find talent or get hired</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <div className="container">
                    <div className="section-header">
                        <h2>How It Works</h2>
                        <p>Get started in 4 simple steps</p>
                    </div>
                    <div className="steps-grid">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="step-card">
                                <div className="step-number">{item.step}</div>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                                {index < howItWorks.length - 1 && (
                                    <ArrowRight className="step-arrow" size={24} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Get Started?</h2>
                        <p>Join thousands of employers and freelancers already using Bharat Lancer</p>
                        <div className="cta-buttons">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => navigate('/register?role=employer')}
                            >
                                I'm Hiring
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => navigate('/register?role=freelancer')}
                            >
                                I'm a Freelancer
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>Bharat Lancer</h3>
                            <p>Connecting talent with opportunity across India</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Platform</h4>
                                <a href="#features">Features</a>
                                <a href="#how-it-works">How It Works</a>
                                <a href="#pricing">Pricing</a>
                            </div>
                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#about">About Us</a>
                                <a href="#contact">Contact</a>
                                <a href="#careers">Careers</a>
                            </div>
                            <div className="footer-column">
                                <h4>Legal</h4>
                                <a href="#privacy">Privacy Policy</a>
                                <a href="#terms">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 Bharat Lancer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
