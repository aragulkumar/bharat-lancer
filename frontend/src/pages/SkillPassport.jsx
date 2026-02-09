import { useState, useEffect } from 'react';
import { Award, TrendingUp, CheckCircle } from 'lucide-react';
import { usersAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import './SkillPassport.css';

const SkillPassport = () => {
    const [passport, setPassport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchPassport();
    }, []);

    const fetchPassport = async () => {
        try {
            const response = await usersAPI.getSkillPassport();
            setPassport(response.data.data.passport);
        } catch (error) {
            console.error('Error fetching passport:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const response = await usersAPI.updateSkillPassport();
            setPassport(response.data.data.passport);
        } catch (error) {
            console.error('Error updating passport:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!passport) {
        return (
            <div className="container">
                <Card>
                    <p>No skill passport available. Please update your profile.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="passport-header">
                <div>
                    <h1 className="gradient-text">AI Skill Passport</h1>
                    <p>Your verified skills and AI-calculated score</p>
                </div>
                <Button variant="primary" onClick={handleUpdate} loading={updating}>
                    <TrendingUp size={18} />
                    Recalculate Score
                </Button>
            </div>

            <div className="passport-grid">
                {/* Overall Score */}
                <Card gradient className="score-card">
                    <div className="score-content">
                        <Award size={48} className="score-icon" />
                        <div className="score-value">{passport.overallScore}</div>
                        <div className="score-label">Overall Score</div>
                    </div>
                    <div className="score-breakdown">
                        <div className="breakdown-item">
                            <span>Projects</span>
                            <strong>{passport.breakdown.projectScore}</strong>
                        </div>
                        <div className="breakdown-item">
                            <span>Portfolio</span>
                            <strong>{passport.breakdown.portfolioScore}</strong>
                        </div>
                        <div className="breakdown-item">
                            <span>Resume</span>
                            <strong>{passport.breakdown.resumeScore}</strong>
                        </div>
                    </div>
                </Card>

                {/* Verified Skills */}
                <Card className="skills-card">
                    <h3>
                        <CheckCircle size={20} className="verified-icon" />
                        Verified Skills
                    </h3>
                    <div className="verified-skills-list">
                        {passport.verifiedSkills && passport.verifiedSkills.length > 0 ? (
                            passport.verifiedSkills.map((item, index) => (
                                <div key={index} className="verified-skill-item">
                                    <div className="skill-info">
                                        <span className="skill-name">{item.skill}</span>
                                        <span className="skill-date">
                                            Verified {new Date(item.verifiedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="skill-score-bar">
                                        <div
                                            className="skill-score-fill"
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                    <div className="skill-score-value">{item.score}%</div>
                                </div>
                            ))
                        ) : (
                            <p className="no-skills">No verified skills yet</p>
                        )}
                    </div>
                </Card>

                {/* Top Skills */}
                <Card className="top-skills-card">
                    <h3>Top Skills</h3>
                    <div className="top-skills-list">
                        {passport.topSkills && passport.topSkills.length > 0 ? (
                            passport.topSkills.map((skill, index) => (
                                <span key={index} className="top-skill-badge">
                                    #{index + 1} {skill}
                                </span>
                            ))
                        ) : (
                            <p className="no-skills">No skills listed</p>
                        )}
                    </div>
                </Card>
            </div>

            <Card className="info-card">
                <h3>How is my score calculated?</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <strong>40% - Projects</strong>
                        <p>Number and quality of completed projects</p>
                    </div>
                    <div className="info-item">
                        <strong>30% - Portfolio</strong>
                        <p>Portfolio quality and presentation</p>
                    </div>
                    <div className="info-item">
                        <strong>30% - Resume</strong>
                        <p>Resume content and skill matches</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SkillPassport;
