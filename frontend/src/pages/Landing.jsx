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
                        <h1 className="hero-title">Ready to build<br />something awesome?</h1>
                        <p className="hero-subtitle">We make learning to code accessible to anyone, anywhere.</p>

                        <div className="search-box">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                className="search-input"
                            />
                        </div>
                    </section>

                    {/* Practical Projects Section */}
                    <section className="projects-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">Practical projects to get you ahead.</h2>
                                <p className="section-text">
                                    Learn by doing with our guided projects. Build real-world applications and gain practical experience.
                                </p>
                            </div>
                            <button className="btn-primary">
                                <Users size={18} />
                                Browse Library
                            </button>
                        </div>
                    </section>

                    {/* Testimonial 1 */}
                    <div className="testimonial-card">
                        <div className="testimonial-avatar">
                            <img src="https://i.pravatar.cc/150?img=12" alt="User" />
                        </div>
                        <div className="testimonial-content">
                            <p className="testimonial-text">
                                "My career trajectory changed the moment I created a Codecademy account. I went from zero to employed as a full-stack engineer in 6 months. The hands-on learning approach and supportive community made all the difference in my journey."
                            </p>
                            <p className="testimonial-author">— Sarah Chen, Full-Stack Developer</p>
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
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">Super Fast Data Hosting</h3>
                                <p className="card-description">
                                    Learn how to optimize your database queries and improve application performance with modern hosting solutions.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="content-card">
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">API Requests with Axios</h3>
                                <p className="card-description">
                                    Master the art of making HTTP requests in JavaScript using Axios library for seamless API integration.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="content-card">
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">Build a REST API</h3>
                                <p className="card-description">
                                    Create robust and scalable REST APIs using Node.js and Express. Learn best practices and security.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="cta-banner">
                        <div className="cta-content">
                            <h2 className="cta-title">Unlimited access<br />to everything with<br />pro membership.</h2>
                            <p className="cta-text">
                                Get unlimited access to all courses, projects, and career resources. Start learning today.
                            </p>
                        </div>
                        <button className="cta-button">Start Free Trial</button>
                    </section>

                    {/* Featured Content */}
                    <section className="featured-section">
                        <h2 className="section-title">Featured Content</h2>

                        <div className="featured-grid">
                            <div className="featured-card">
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">Super Fast Data Hosting</h3>
                                <p className="card-description">
                                    Discover the latest techniques in cloud hosting and database optimization for lightning-fast applications.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="featured-card">
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">AI-powered platforms</h3>
                                <p className="card-description">
                                    Explore how artificial intelligence is transforming modern web development and user experiences.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="featured-card">
                                <span className="card-badge">ARTICLE</span>
                                <h3 className="card-title">Practical Pair Components</h3>
                                <p className="card-description">
                                    Learn component-driven development and build reusable UI elements for scalable applications.
                                </p>
                                <button className="card-btn">
                                    Read More <ArrowRight size={16} />
                                </button>
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
                                "I credit Codecademy for the skills I have today. I went from a complete beginner to landing my dream job as a software engineer. The structured learning path and hands-on projects gave me the confidence to pursue a career in tech. The community support was invaluable throughout my journey."
                            </p>
                            <p className="testimonial-author">— Michael Rodriguez, Software Engineer</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="landing-footer">
                        <div className="footer-grid">
                            <div className="footer-column">
                                <h4>Library</h4>
                                <a href="#">Courses</a>
                                <a href="#">Projects</a>
                                <a href="#">Paths</a>
                                <a href="#">Docs</a>
                            </div>

                            <div className="footer-column">
                                <h4>Support</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Contact Us</a>
                                <a href="#">Community</a>
                                <a href="#">Blog</a>
                            </div>

                            <div className="footer-column">
                                <h4>Teams</h4>
                                <a href="#">For Business</a>
                                <a href="#">For Education</a>
                                <a href="#">Enterprise</a>
                                <a href="#">Pricing</a>
                            </div>

                            <div className="footer-column">
                                <h4>Company</h4>
                                <a href="#">About</a>
                                <a href="#">Careers</a>
                                <a href="#">Press</a>
                                <a href="#">Partners</a>
                            </div>

                            <div className="footer-column">
                                <h4>Community & Support</h4>
                                <a href="#">Forums</a>
                                <a href="#">Discord</a>
                                <a href="#">Events</a>
                                <a href="#">Newsletter</a>
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
