import { useNavigate } from 'react-router-dom';
import { MessageCircle, Star, MapPin, DollarSign } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import './FreelancerMatchCard.css';

const FreelancerMatchCard = ({ freelancer }) => {
    const navigate = useNavigate();

    const handleMessage = () => {
        navigate(`/chat?userId=${freelancer._id}`);
    };

    return (
        <Card className="freelancer-match-card">
            <div className="match-header">
                <div className="freelancer-avatar-match">
                    {freelancer.name.charAt(0).toUpperCase()}
                </div>
                <div className="match-info">
                    <h4>{freelancer.name}</h4>
                    <div className="match-score">
                        <Star size={16} fill="var(--warning)" color="var(--warning)" />
                        <span>{freelancer.matchScore}% Match</span>
                    </div>
                </div>
            </div>

            {freelancer.bio && (
                <p className="freelancer-bio">{freelancer.bio.substring(0, 100)}...</p>
            )}

            <div className="matched-skills">
                <strong>Matched Skills:</strong>
                <div className="skills-list">
                    {freelancer.matchedSkills.map((skill, index) => (
                        <span key={index} className="skill-tag matched">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="freelancer-details">
                {freelancer.location && (
                    <span className="detail-item">
                        <MapPin size={14} />
                        {freelancer.location}
                    </span>
                )}
                {freelancer.hourlyRate && (
                    <span className="detail-item">
                        <DollarSign size={14} />
                        ₹{freelancer.hourlyRate}/hr
                    </span>
                )}
            </div>

            <Button
                variant="primary"
                fullWidth
                size="sm"
                onClick={handleMessage}
                className="message-btn"
            >
                <MessageCircle size={16} />
                Message {freelancer.name.split(' ')[0]}
            </Button>
        </Card>
    );
};

export default FreelancerMatchCard;
