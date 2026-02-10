import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, Briefcase, Award, TrendingUp } from 'lucide-react';
import './Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Navbar */}
            <nav className="landing-nav">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">C</div>
                        <span>Bharat Lancer</span>
                    </Link>

                    <div className="nav-links">
                        <a href="#content">Content</a>
                        <a href="#subjects">Subjects</a>
                        <a href="#paths">Paths</a>
                    </div>

                    <div className="nav-actions">
                        <Link to="/login" className="nav-btn-outline">Sign In</Link>
                        <Link to="/register" className="nav-btn-primary">Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Container */}
            <div className="content-wrapper">
                <div className="main-container">
                    {/* Hero Section */}
                    <section className="hero-section">
                        <h1 className="hero-title">Find the perfect<br />freelancer or job</h1>
                        <p className="hero-subtitle">Connect with top Indian talent or discover your next opportunity.</p>

                        <div className="search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Search for jobs or freelancers..."
                                className="search-input"
                            />
                        </div>
                    </section>

                    {/* Opportunities Section */}
                    <section className="projects-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">Thousands of opportunities waiting for you.</h2>
                                <p className="section-text">
                                    Browse projects from startups to enterprises. Find work that matches your skills and grow your career.
                                </p>
                            </div>
                            <Link to="/jobs" className="btn-primary">
                                <Briefcase size={18} />
                                Browse Jobs
                            </Link>
                        </div>
                    </section>

                    {/* Testimonial 1 */}
                    <div className="testimonial-card">
                        <div className="testimonial-avatar">
                            <img src="https://i.pravatar.cc/150?img=12" alt="User" />
                        </div>
                        <div className="testimonial-content">
                            <p className="testimonial-text">
                                "Bharat Lancer transformed my freelancing career. I went from struggling to find clients to working with top companies across India. The platform's AI matching helped me find projects that perfectly matched my skills, and I've tripled my income in just 6 months."
                            </p>
                            <p className="testimonial-author">— Priya Sharma, Full-Stack Developer</p>
                        </div>
                    </div>

                    {/* Latest Content */}
                    <section className="content-section">
                        <div className="section-top">
                            <h2 className="section-title">Latest Content</h2>
                            <a href="#" className="view-all-link">
                                Browse everything <ArrowRight size={16} />
                            </a>
                        </div>

                        <div className="content-grid">
                            <div className="content-card">
                                <span className="card-badge">FEATURE</span>
                                <h3 className="card-title">AI-Powered Matching</h3>
                                <p className="card-description">
                                    Our intelligent algorithm matches freelancers with the perfect projects based on skills, experience, and preferences.
                                </p>
                                <Link to="/jobs" className="card-btn">
                                    Explore Jobs <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="content-card">
                                <span className="card-badge">FEATURE</span>
                                <h3 className="card-title">Skill Passport</h3>
                                <p className="card-description">
                                    Showcase your expertise with our comprehensive skill verification system. Build trust with employers instantly.
                                </p>
                                <Link to="/register" className="card-btn">
                                    Create Profile <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="content-card">
                                <span className="card-badge">FEATURE</span>
                                <h3 className="card-title">Secure Payments</h3>
                                <p className="card-description">
                                    Get paid on time with our integrated payment system. Milestone-based payments ensure security for both parties.
                                </p>
                                <Link to="/register" className="card-btn">
                                    Learn More <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="cta-banner">
                        <div className="cta-content">
                            <h2 className="cta-title">Unlock premium<br />features with<br />Pro membership.</h2>
                            <p className="cta-text">
                                Get priority matching, featured profile, advanced analytics, and unlimited proposals. Grow your business faster.
                            </p>
                        </div>
                        <Link to="/register" className="cta-button">Start Free Trial</Link>
                    </section>

                    {/* Featured Benefits */}
                    <section className="featured-section">
                        <h2 className="section-title">Why Choose Bharat Lancer?</h2>

                        <div className="featured-grid">
                            <div className="featured-card">
                                <span className="card-badge">FOR FREELANCERS</span>
                                <h3 className="card-title">Find Quality Projects</h3>
                                <p className="card-description">
                                    Access thousands of verified projects from startups to Fortune 500 companies. Work on your terms with flexible schedules.
                                </p>
                                <Link to="/jobs" className="card-btn">
                                    Browse Jobs <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="featured-card">
                                <span className="card-badge">FOR EMPLOYERS</span>
                                <h3 className="card-title">Hire Top Talent</h3>
                                <p className="card-description">
                                    Connect with pre-vetted Indian freelancers. Our AI matching ensures you find the perfect fit for your project needs.
                                </p>
                                <Link to="/register" className="card-btn">
                                    Post a Job <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div className="featured-card">
                                <span className="card-badge">PLATFORM</span>
                                <h3 className="card-title">Secure & Reliable</h3>
                                <p className="card-description">
                                    Milestone-based payments, dispute resolution, and 24/7 support. Your success and security are our top priorities.
                                </p>
                                <Link to="/register" className="card-btn">
                                    Get Started <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* Testimonial 2 */}
                    <div className="testimonial-card">
                        <div className="testimonial-avatar">
                            <img src="https://i.pravatar.cc/150?img=33" alt="User" />
                        </div>
                        <div className="testimonial-content">
                            <p className="testimonial-text">
                                "As a startup founder, finding reliable developers was always a challenge. Bharat Lancer's AI matching connected us with amazing talent in hours, not weeks. We've built our entire tech team through this platform, and the quality has been outstanding. It's been a game-changer for our business."
                            </p>
                            <p className="testimonial-author">— Rajesh Kumar, Founder & CEO at TechStart India</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="landing-footer">
                        <div className="footer-grid">
                            <div className="footer-column">
                                <h4>For Freelancers</h4>
                                <Link to="/jobs">Find Jobs</Link>
                                <Link to="/skill-passport">Skill Passport</Link>
                                <Link to="/register">Create Profile</Link>
                                <a href="#">Success Stories</a>
                            </div>

                            <div className="footer-column">
                                <h4>For Employers</h4>
                                <Link to="/create-job">Post a Job</Link>
                                <Link to="/jobs">Browse Talent</Link>
                                <a href="#">Pricing</a>
                                <a href="#">Enterprise</a>
                            </div>

                            <div className="footer-column">
                                <h4>Resources</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Blog</a>
                                <a href="#">Guides</a>
                                <a href="#">API Docs</a>
                            </div>

                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Careers</a>
                                <a href="#">Press</a>
                                <a href="#">Contact</a>
                            </div>

                            <div className="footer-column">
                                <h4>Community</h4>
                                <Link to="/chat">Community Chat</Link>
                                <a href="#">Events</a>
                                <a href="#">Newsletter</a>
                                <a href="#">Support</a>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <p>© 2026 Bharat Lancer. All rights reserved.</p>
                            <div className="footer-links">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Cookie Policy</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Landing;
